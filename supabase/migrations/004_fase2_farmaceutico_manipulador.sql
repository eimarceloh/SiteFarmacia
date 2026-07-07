-- =============================================================================
-- Farmácia do Povo — Migração 004: Fase 2 (Farmacêutico e Manipulador)
-- Execute no Supabase SQL Editor após 003_admin_policies.sql
--
-- O que esta migração faz:
--   1. Concede as permissões dos papéis farmaceutico e manipulador
--      (definidas em 002, mas ainda sem atribuição)
--   2. Cria políticas RLS para a tabela receitas (staff ver/validar)
--
-- Após rodar: farmacêutico entra no painel via receita.ver e manipulador via
-- manipulacao.ver (ver ajuste em app/admin/layout.tsx).
-- =============================================================================

-- =============================================================================
-- PASSO 1 — FARMACÊUTICO: valida receitas e acompanha manipulação
-- =============================================================================
INSERT INTO public.perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM public.perfis p
CROSS JOIN public.permissoes pm
WHERE p.nome  = 'farmaceutico'
  AND pm.nome IN (
    'receita.ver',
    'receita.validar',
    'manipulacao.ver',        -- acompanha a manipulação (somente leitura)
    'perfil.ver_proprio',
    'perfil.editar_proprio'
  )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- PASSO 2 — MANIPULADOR: atualiza status de manipulação no laboratório
-- =============================================================================
INSERT INTO public.perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM public.perfis p
CROSS JOIN public.permissoes pm
WHERE p.nome  = 'manipulador'
  AND pm.nome IN (
    'manipulacao.ver',
    'manipulacao.atualizar',
    'perfil.ver_proprio',
    'perfil.editar_proprio'
  )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- PASSO 3 — RLS: receitas visíveis/validáveis pelo staff com permissão
-- (as leituras/updates no app usam service role, mas mantemos a RLS coerente)
-- =============================================================================
DROP POLICY IF EXISTS "receitas_staff_ver"       ON public.receitas;
DROP POLICY IF EXISTS "receitas_staff_atualizar" ON public.receitas;

CREATE POLICY "receitas_staff_ver" ON public.receitas
  FOR SELECT
  USING (fn_usuario_tem_permissao(auth.uid(), 'receita.ver'));

CREATE POLICY "receitas_staff_atualizar" ON public.receitas
  FOR UPDATE
  USING     (fn_usuario_tem_permissao(auth.uid(), 'receita.validar'))
  WITH CHECK (fn_usuario_tem_permissao(auth.uid(), 'receita.validar'));

-- =============================================================================
-- VERIFICAÇÃO (execute separado)
-- SELECT p.nome AS papel, pm.nome AS permissao
-- FROM perfis p
-- JOIN perfis_permissoes pp ON pp.perfil_id = p.id
-- JOIN permissoes pm ON pm.id = pp.permissao_id
-- WHERE p.nome IN ('farmaceutico','manipulador')
-- ORDER BY p.nome, pm.nome;
-- =============================================================================
