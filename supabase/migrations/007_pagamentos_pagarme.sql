-- =============================================================================
-- Farmácia do Povo — Migração 007: campos de pagamento (Pagar.me)
-- Execute no Supabase SQL Editor após 006
--
-- Guarda a referência do pedido no Pagar.me e os dados de exibição de PIX/boleto.
-- NUNCA guardamos dados de cartão aqui (isso fica no gateway, via token).
-- =============================================================================

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS pagarme_pedido_id        TEXT,
  ADD COLUMN IF NOT EXISTS pagamento_qr_code        TEXT,  -- PIX copia e cola
  ADD COLUMN IF NOT EXISTS pagamento_qr_code_url    TEXT,  -- PIX imagem do QR
  ADD COLUMN IF NOT EXISTS pagamento_boleto_url     TEXT,  -- link do boleto
  ADD COLUMN IF NOT EXISTS pagamento_linha_digitavel TEXT; -- boleto linha digitável

CREATE INDEX IF NOT EXISTS idx_pedidos_pagarme_id ON public.pedidos (pagarme_pedido_id);
