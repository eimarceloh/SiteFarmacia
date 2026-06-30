-- =============================================================================
-- Farmácia do Povo — Migração 002: RBAC Completo
-- Execute APÓS 001_schema.sql no Supabase SQL Editor
--
-- O que esta migração faz:
--   1. Substitui clientes.perfil (TEXT) por clientes.papel_id (FK → perfis)
--   2. Redefine papéis e permissões granulares no banco
--   3. Cria funções RPC: fn_usuario_tem_permissao, fn_minhas_permissoes
--   4. Atualiza fn_eh_admin e fn_novo_usuario para o novo modelo
--
-- PRINCÍPIO: adicionar papel ou permissão = INSERT no banco. Zero alteração de código.
-- =============================================================================

-- =============================================================================
-- PASSO 1 — Adicionar papel_id na tabela clientes
-- (nullable primeiro para permitir a migração de dados)
-- =============================================================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'clientes'
      AND column_name  = 'papel_id'
  ) THEN
    ALTER TABLE public.clientes
      ADD COLUMN papel_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =============================================================================
-- PASSO 2 — Repopular tabelas RBAC (limpa e reinicia)
-- Ordem: perfis_permissoes → permissoes → perfis (devido às FKs)
-- =============================================================================
DELETE FROM public.perfis_permissoes;
DELETE FROM public.permissoes;
DELETE FROM public.perfis;

-- =============================================================================
-- PASSO 3 — Papéis (roles)
-- Fase 1: cliente, atendente, admin
-- Fase 2 (sem permissões ainda, mas já existem no banco): farmaceutico, manipulador
-- =============================================================================
INSERT INTO public.perfis (nome, descricao) VALUES
  ('cliente',      'Acesso ao catálogo, compras e acompanhamento dos próprios pedidos'),
  ('atendente',    'Visualiza todos os pedidos, atende clientes e atualiza status'),
  ('admin',        'Acesso total ao sistema — dono/gestor da farmácia'),
  ('farmaceutico', 'Fase 2: valida receitas médicas e acompanha manipulação'),
  ('manipulador',  'Fase 2: atualiza status de manipulação no laboratório')
ON CONFLICT (nome) DO UPDATE SET descricao = EXCLUDED.descricao;

-- =============================================================================
-- PASSO 4 — Permissões granulares por ação/recurso
-- Chave = nome (ex: 'produto.criar', 'pedido.ver_todos')
-- Nunca altere a chave após ela estar em uso — crie uma nova se necessário.
-- =============================================================================
INSERT INTO public.permissoes (nome, descricao, recurso, acao) VALUES
  -- ── Catálogo ────────────────────────────────────────────────────────────────
  ('produto.ver',             'Visualizar catálogo de produtos',             'produto',      'ver'),
  ('produto.criar',           'Cadastrar novo produto',                      'produto',      'criar'),
  ('produto.editar',          'Editar produto existente',                    'produto',      'editar'),
  ('produto.remover',         'Remover produto',                             'produto',      'remover'),
  -- ── Estoque ─────────────────────────────────────────────────────────────────
  ('estoque.ver',             'Visualizar quantidades de estoque',           'estoque',      'ver'),
  ('estoque.gerenciar',       'Editar estoque e configurar campanhas',       'estoque',      'gerenciar'),
  -- ── Pedidos ─────────────────────────────────────────────────────────────────
  ('pedido.criar',            'Criar pedido (próprio ou em nome de cliente)','pedido',       'criar'),
  ('pedido.ver_proprios',     'Ver somente os próprios pedidos',             'pedido',       'ver_proprios'),
  ('pedido.ver_todos',        'Ver todos os pedidos do sistema',             'pedido',       'ver_todos'),
  ('pedido.atualizar_status', 'Atualizar status de qualquer pedido',         'pedido',       'atualizar_status'),
  ('pedido.cancelar',         'Cancelar pedido',                             'pedido',       'cancelar'),
  -- ── Clientes ────────────────────────────────────────────────────────────────
  ('cliente.ver',             'Visualizar dados de clientes',                'cliente',      'ver'),
  ('cliente.editar',          'Editar dados de clientes',                    'cliente',      'editar'),
  -- ── Perfil próprio ──────────────────────────────────────────────────────────
  ('perfil.ver_proprio',      'Ver o próprio perfil e dados pessoais',       'perfil',       'ver_proprio'),
  ('perfil.editar_proprio',   'Editar o próprio perfil e dados pessoais',    'perfil',       'editar_proprio'),
  -- ── Relatórios ──────────────────────────────────────────────────────────────
  ('relatorio.ver',           'Acessar relatórios e métricas do sistema',    'relatorio',    'ver'),
  -- ── Administração ───────────────────────────────────────────────────────────
  ('usuario.gerenciar',       'Criar, editar e definir papéis de usuários',  'usuario',      'gerenciar'),
  ('config.gerenciar',        'Gerenciar configurações do sistema',           'config',       'gerenciar'),
  -- ── Fase 2 — inseridas agora para não exigir refatoração futura ─────────────
  ('receita.ver',             'Visualizar receitas médicas',                 'receita',      'ver'),
  ('receita.validar',         'Aprovar ou rejeitar receitas médicas',        'receita',      'validar'),
  ('manipulacao.ver',         'Visualizar etapas de manipulação',            'manipulacao',  'ver'),
  ('manipulacao.atualizar',   'Atualizar status de manipulação',             'manipulacao',  'atualizar')
ON CONFLICT (nome) DO UPDATE SET
  descricao = EXCLUDED.descricao,
  recurso   = EXCLUDED.recurso,
  acao      = EXCLUDED.acao;

-- =============================================================================
-- PASSO 5 — Atribuir permissões aos papéis
-- Negar por padrão: somente permissões explicitamente listadas são concedidas.
-- Para adicionar permissão futura: INSERT em perfis_permissoes. Só isso.
-- =============================================================================

-- ── CLIENTE ──────────────────────────────────────────────────────────────────
INSERT INTO public.perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM public.perfis p
CROSS JOIN public.permissoes pm
WHERE p.nome  = 'cliente'
  AND pm.nome IN (
    'produto.ver',
    'pedido.criar',
    'pedido.ver_proprios',
    'perfil.ver_proprio',
    'perfil.editar_proprio'
  )
ON CONFLICT DO NOTHING;

-- ── ATENDENTE ────────────────────────────────────────────────────────────────
INSERT INTO public.perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM public.perfis p
CROSS JOIN public.permissoes pm
WHERE p.nome  = 'atendente'
  AND pm.nome IN (
    'produto.ver',
    'estoque.ver',
    'pedido.criar',
    'pedido.ver_todos',
    'pedido.atualizar_status',
    'pedido.cancelar',
    'cliente.ver',
    'cliente.editar',
    'perfil.ver_proprio',
    'perfil.editar_proprio'
  )
ON CONFLICT DO NOTHING;

-- ── ADMIN — todas as permissões ──────────────────────────────────────────────
INSERT INTO public.perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM public.perfis p
CROSS JOIN public.permissoes pm
WHERE p.nome = 'admin'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- PASSO 6 — Migrar dados: clientes.perfil (TEXT) → clientes.papel_id (FK)
-- Mapeia: 'admin' → admin, 'farmaceutico' → farmaceutico,
--         'suporte' → atendente (papel mais próximo), 'cliente' → cliente
-- =============================================================================
UPDATE public.clientes c
SET papel_id = p.id
FROM public.perfis p
WHERE p.nome = c.perfil
  AND c.papel_id IS NULL;

-- Fallback: suporte → atendente (suporte não existe mais como papel)
UPDATE public.clientes
SET papel_id = (SELECT id FROM public.perfis WHERE nome = 'atendente' LIMIT 1)
WHERE papel_id IS NULL
  AND perfil = 'suporte';

-- Fallback final: qualquer outro valor desconhecido → cliente
UPDATE public.clientes
SET papel_id = (SELECT id FROM public.perfis WHERE nome = 'cliente' LIMIT 1)
WHERE papel_id IS NULL;

-- Remove coluna legada (execute somente após confirmar que papel_id está correto)
ALTER TABLE public.clientes DROP COLUMN IF EXISTS perfil;

-- =============================================================================
-- PASSO 7 — Funções RPC
-- =============================================================================

-- Verifica se um usuário tem uma permissão (chamado pelo backend)
-- SECURITY DEFINER: ignora RLS e lê as tabelas com permissão total
CREATE OR REPLACE FUNCTION fn_usuario_tem_permissao(
  p_usuario_id UUID,
  p_chave      TEXT
)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clientes          c
    JOIN public.perfis_permissoes pp ON pp.perfil_id  = c.papel_id
    JOIN public.permissoes        pm ON pm.id         = pp.permissao_id
    WHERE c.id    = p_usuario_id
      AND pm.nome = p_chave
  );
$$;

-- Lista as permissões do usuário logado (chamado pelo frontend via RPC)
-- Retorna array vazio se não autenticado ou sem papel
CREATE OR REPLACE FUNCTION fn_minhas_permissoes()
RETURNS TEXT[]
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE(
    ARRAY_AGG(pm.nome ORDER BY pm.nome),
    ARRAY[]::TEXT[]
  )
  FROM public.clientes          c
  JOIN public.perfis_permissoes pp ON pp.perfil_id = c.papel_id
  JOIN public.permissoes        pm ON pm.id        = pp.permissao_id
  WHERE c.id = auth.uid();
$$;

-- =============================================================================
-- PASSO 8 — Atualiza fn_eh_admin para usar o novo modelo de permissões
-- fn_eh_admin() agora = "tem usuario.gerenciar?"
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_eh_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT fn_usuario_tem_permissao(auth.uid(), 'usuario.gerenciar');
$$;

-- =============================================================================
-- PASSO 9 — Atualiza trigger de novo usuário para setar papel_id = 'cliente'
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_novo_usuario()
RETURNS TRIGGER AS $$
DECLARE
  v_papel_id UUID;
BEGIN
  SELECT id INTO v_papel_id
  FROM public.perfis
  WHERE nome = 'cliente'
  LIMIT 1;

  INSERT INTO public.clientes (id, email, papel_id)
  VALUES (NEW.id, NEW.email, v_papel_id)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VERIFICAÇÃO FINAL (opcional — copie em outra query para confirmar)
-- =============================================================================
-- SELECT p.nome AS papel, pm.nome AS permissao
-- FROM perfis p
-- JOIN perfis_permissoes pp ON pp.perfil_id = p.id
-- JOIN permissoes pm ON pm.id = pp.permissao_id
-- ORDER BY p.nome, pm.nome;
