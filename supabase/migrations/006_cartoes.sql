-- =============================================================================
-- Farmácia do Povo — Migração 006: Cartões salvos (padrão PCI-DSS)
-- Execute no Supabase SQL Editor após 005
--
-- ⚠️ SEGURANÇA (LEIA):
-- Esta tabela NUNCA armazena o número completo do cartão (PAN) nem o CVV.
-- Guardamos apenas dados NÃO SENSÍVEIS (bandeira, 4 últimos dígitos, validade,
-- nome) + um TOKEN de um gateway de pagamento (Stripe, Pagar.me, Mercado Pago…).
-- O PAN/CVV devem ser tokenizados no provedor; o token vem em token_gateway.
-- Isso mantém o sistema fora do escopo pesado de PCI-DSS.
-- =============================================================================

CREATE TABLE IF NOT EXISTS cartoes (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id    UUID        NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  -- Dados não sensíveis (exibição)
  bandeira      TEXT        NOT NULL,          -- visa, mastercard, amex, elo, hipercard…
  ultimos4      TEXT        NOT NULL CHECK (ultimos4 ~ '^[0-9]{4}$'),
  validade_mes  INT         NOT NULL CHECK (validade_mes BETWEEN 1 AND 12),
  validade_ano  INT         NOT NULL CHECK (validade_ano BETWEEN 2000 AND 2100),
  nome_titular  TEXT        NOT NULL,
  -- Token do gateway (NUNCA o PAN). Nulo até integrar um provedor real.
  token_gateway TEXT,
  padrao        BOOLEAN     DEFAULT false,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cartoes_cliente ON cartoes(cliente_id);

-- ── RLS: cada cliente só enxerga/gerencia os próprios cartões ─────────────────
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cartoes_proprio_tudo" ON cartoes;
CREATE POLICY "cartoes_proprio_tudo" ON cartoes
  FOR ALL
  USING (auth.uid() = cliente_id)
  WITH CHECK (auth.uid() = cliente_id);

-- ── Trigger: garante no máximo 1 cartão padrão por cliente ────────────────────
CREATE OR REPLACE FUNCTION fn_cartao_padrao_unico()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.padrao = true THEN
    UPDATE cartoes SET padrao = false
    WHERE cliente_id = NEW.cliente_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_cartoes_padrao_unico ON cartoes;
CREATE TRIGGER tg_cartoes_padrao_unico
  BEFORE INSERT OR UPDATE ON cartoes
  FOR EACH ROW EXECUTE FUNCTION fn_cartao_padrao_unico();
