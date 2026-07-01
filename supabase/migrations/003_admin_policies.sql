-- =============================================================================
-- Farmácia do Povo — Migração 003: Políticas admin + Storage de imagens
-- Execute no Supabase SQL Editor após 002_rbac.sql
-- =============================================================================

-- =============================================================================
-- PASSO 1 — Permissões de produto para atendentes
-- 002 não concedeu produto.criar/editar/remover ao atendente.
-- =============================================================================
INSERT INTO public.perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id
FROM public.perfis p
CROSS JOIN public.permissoes pm
WHERE p.nome  = 'atendente'
  AND pm.nome IN ('produto.criar', 'produto.editar', 'produto.remover', 'estoque.gerenciar')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- PASSO 2 — Políticas RLS para produtos (INSERT / UPDATE / DELETE por admin/atendente)
-- A leitura pública (ativo = true) já existe em 001.
-- =============================================================================

-- Admin e atendentes podem ver todos os produtos (inclusive inativos)
CREATE POLICY "produtos_staff_ver_todos" ON produtos
  FOR SELECT
  USING (fn_usuario_tem_permissao(auth.uid(), 'estoque.ver'));

-- Criar produto
CREATE POLICY "produtos_staff_inserir" ON produtos
  FOR INSERT
  WITH CHECK (fn_usuario_tem_permissao(auth.uid(), 'produto.criar'));

-- Editar produto
CREATE POLICY "produtos_staff_editar" ON produtos
  FOR UPDATE
  USING  (fn_usuario_tem_permissao(auth.uid(), 'produto.editar'))
  WITH CHECK (fn_usuario_tem_permissao(auth.uid(), 'produto.editar'));

-- Remover produto (somente admin)
CREATE POLICY "produtos_admin_remover" ON produtos
  FOR DELETE
  USING (fn_usuario_tem_permissao(auth.uid(), 'produto.remover'));

-- =============================================================================
-- PASSO 3 — Políticas RLS para categorias (admin/atendente gerenciam)
-- =============================================================================
CREATE POLICY "categorias_staff_inserir" ON categorias
  FOR INSERT
  WITH CHECK (fn_usuario_tem_permissao(auth.uid(), 'produto.criar'));

CREATE POLICY "categorias_staff_editar" ON categorias
  FOR UPDATE
  USING (fn_usuario_tem_permissao(auth.uid(), 'produto.editar'));

-- =============================================================================
-- PASSO 4 — Admin pode ver TODOS os clientes (para gestão de equipe)
-- =============================================================================
CREATE POLICY "clientes_admin_ver_todos" ON clientes
  FOR SELECT
  USING (fn_usuario_tem_permissao(auth.uid(), 'usuario.gerenciar'));

CREATE POLICY "clientes_admin_editar_todos" ON clientes
  FOR UPDATE
  USING (fn_usuario_tem_permissao(auth.uid(), 'usuario.gerenciar'));

-- =============================================================================
-- PASSO 5 — Bucket de imagens de produtos no Supabase Storage
-- Cria o bucket 'produtos' como público (imagens acessíveis via URL direta)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'produtos',
  'produtos',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public            = true,
  file_size_limit   = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- Leitura pública das imagens
CREATE POLICY "produtos_imagens_publicas" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'produtos');

-- Upload (admin/atendente com produto.criar)
CREATE POLICY "produtos_imagens_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'produtos'
    AND fn_usuario_tem_permissao(auth.uid(), 'produto.criar')
  );

-- Atualizar (admin/atendente com produto.editar)
CREATE POLICY "produtos_imagens_atualizar" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'produtos'
    AND fn_usuario_tem_permissao(auth.uid(), 'produto.editar')
  );

-- Deletar (somente admin)
CREATE POLICY "produtos_imagens_deletar" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'produtos'
    AND fn_eh_admin()
  );

-- =============================================================================
-- VERIFICAÇÃO (execute separado)
-- SELECT p.nome AS papel, pm.nome AS permissao
-- FROM perfis p
-- JOIN perfis_permissoes pp ON pp.perfil_id = p.id
-- JOIN permissoes pm ON pm.id = pp.permissao_id
-- WHERE p.nome IN ('admin','atendente')
-- ORDER BY p.nome, pm.nome;
-- =============================================================================
