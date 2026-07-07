-- =============================================================================
-- Farmácia do Povo — Migração 005: Esteira de produção / histórico com executor
-- Execute no Supabase SQL Editor após 004
--
-- Por quê: o app registra o status do pedido usando a service role (supabaseAdmin),
-- então o gatilho fn_registrar_status_pedido gravava criado_por = auth.uid() = NULL.
-- Agora a APLICAÇÃO passa a inserir o histórico explicitamente, com o id do
-- usuário que executou a etapa. Removemos o gatilho para não duplicar registros.
-- =============================================================================

DROP TRIGGER IF EXISTS tg_pedidos_historico_status ON public.pedidos;

-- A função fn_registrar_status_pedido é mantida (inofensiva) para referência,
-- mas não está mais vinculada a nenhum gatilho.

-- Índice para ordenar a timeline por pedido/data (idempotente)
CREATE INDEX IF NOT EXISTS idx_historico_pedido_data
  ON public.historico_pedidos (pedido_id, criado_em);
