-- =============================================================================
-- Farmácia do Povo — Schema completo (nomes em português)
-- Execute no Supabase SQL Editor: Dashboard > SQL Editor > New Query
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- FUNÇÕES AUXILIARES
-- =============================================================================

-- Auto-atualiza o campo atualizado_em em qualquer tabela
CREATE OR REPLACE FUNCTION fn_atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. CATEGORIAS
-- =============================================================================
CREATE TABLE IF NOT EXISTS categorias (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        UNIQUE NOT NULL,
  titulo          TEXT        NOT NULL,
  descricao       TEXT,
  descricao_longa TEXT,
  icone           TEXT,
  ordem           INT         DEFAULT 0,
  ativo           BOOLEAN     DEFAULT true,
  criado_em       TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER tg_categorias_timestamp
  BEFORE UPDATE ON categorias
  FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

-- =============================================================================
-- 2. PRODUTOS (inclui estoque e precificação — fonte única de verdade)
-- =============================================================================
CREATE TABLE IF NOT EXISTS produtos (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT          UNIQUE NOT NULL,
  nome             TEXT          NOT NULL,
  tag              TEXT          NOT NULL,
  categoria_id     UUID          REFERENCES categorias(id) ON DELETE SET NULL,
  url_imagem       TEXT,
  descricao        TEXT          NOT NULL DEFAULT '',
  beneficios       TEXT[]        DEFAULT '{}',
  ingredientes     TEXT          DEFAULT '',
  modo_de_uso      TEXT          DEFAULT '',
  -- Precificação
  preco_original   NUMERIC(10,2),
  preco_base       NUMERIC(10,2) NOT NULL,
  preco_campanha   NUMERIC(10,2),
  label_campanha   TEXT,                        -- ex: "Black Friday"
  -- Estoque
  estoque          INT           NOT NULL DEFAULT 0,
  -- Estado
  ativo            BOOLEAN       DEFAULT true,
  ordem            INT           DEFAULT 0,
  -- Estatísticas (atualizadas via trigger)
  media_avaliacao  NUMERIC(3,2)  DEFAULT 0.0,
  total_avaliacoes INT           DEFAULT 0,
  criado_em        TIMESTAMPTZ   DEFAULT NOW(),
  atualizado_em    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_slug       ON produtos(slug);
CREATE INDEX idx_produtos_ativo      ON produtos(ativo);
CREATE INDEX idx_produtos_estoque    ON produtos(estoque);

CREATE TRIGGER tg_produtos_timestamp
  BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

-- =============================================================================
-- 3. AVALIAÇÕES
-- =============================================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id        UUID        NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  cliente_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  nome_autor        TEXT        NOT NULL,
  nota              INT         NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario        TEXT,
  compra_verificada BOOLEAN     DEFAULT false,
  aprovado          BOOLEAN     DEFAULT true,
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_avaliacoes_produto  ON avaliacoes(produto_id);
CREATE INDEX idx_avaliacoes_aprovado ON avaliacoes(produto_id, aprovado);

-- Trigger: recalcula media_avaliacao e total_avaliacoes após cada avaliação
CREATE OR REPLACE FUNCTION fn_recalcular_media_produto()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE produtos
  SET
    media_avaliacao  = (
      SELECT ROUND(AVG(nota)::NUMERIC, 1)
      FROM avaliacoes
      WHERE produto_id = COALESCE(NEW.produto_id, OLD.produto_id)
        AND aprovado = true
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM avaliacoes
      WHERE produto_id = COALESCE(NEW.produto_id, OLD.produto_id)
        AND aprovado = true
    )
  WHERE id = COALESCE(NEW.produto_id, OLD.produto_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_avaliacoes_recalcular_media
  AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
  FOR EACH ROW EXECUTE FUNCTION fn_recalcular_media_produto();

-- =============================================================================
-- 4. CLIENTES (perfil associado ao auth.users do Supabase)
-- =============================================================================
CREATE TABLE IF NOT EXISTS clientes (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT,
  cpf           TEXT,
  telefone      TEXT,
  email         TEXT,
  -- 'cliente' | 'admin' | 'farmaceutico' | 'suporte'
  perfil        TEXT        NOT NULL DEFAULT 'cliente',
  ativo         BOOLEAN     DEFAULT true,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER tg_clientes_timestamp
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

-- Verifica se o usuário logado tem perfil de admin ou farmacêutico
-- SECURITY DEFINER: roda com permissões do criador, bypassa RLS
-- Definida APÓS a tabela clientes para que o parser SQL possa resolver a referência
CREATE OR REPLACE FUNCTION fn_eh_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE(
    (SELECT perfil IN ('admin', 'farmaceutico')
     FROM public.clientes
     WHERE id = auth.uid()),
    false
  );
$$;

-- Trigger: cria automaticamente o perfil ao registrar via Supabase Auth
CREATE OR REPLACE FUNCTION fn_novo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.clientes (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tg_auth_novo_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_novo_usuario();

-- =============================================================================
-- 5. ENDEREÇOS
-- =============================================================================
CREATE TABLE IF NOT EXISTS enderecos (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id    UUID        NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  rotulo        TEXT        DEFAULT 'Casa',
  logradouro    TEXT        NOT NULL,
  numero        TEXT        NOT NULL,
  complemento   TEXT,
  bairro        TEXT        NOT NULL,
  cidade        TEXT        NOT NULL,
  estado        TEXT        NOT NULL,
  cep           TEXT        NOT NULL,
  padrao        BOOLEAN     DEFAULT false,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enderecos_cliente ON enderecos(cliente_id);

-- Trigger: garante no máximo 1 endereço padrão por cliente
CREATE OR REPLACE FUNCTION fn_endereco_padrao_unico()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.padrao = true THEN
    UPDATE enderecos SET padrao = false
    WHERE cliente_id = NEW.cliente_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_enderecos_padrao_unico
  BEFORE INSERT OR UPDATE ON enderecos
  FOR EACH ROW EXECUTE FUNCTION fn_endereco_padrao_unico();

-- =============================================================================
-- 6. PEDIDOS
-- =============================================================================
CREATE TABLE IF NOT EXISTS pedidos (
  id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido        TEXT          UNIQUE NOT NULL,
  cliente_id           UUID          REFERENCES clientes(id) ON DELETE SET NULL,
  -- Snapshot do cliente no momento da compra (suporta guest checkout)
  nome_cliente         TEXT          NOT NULL,
  email_cliente        TEXT          NOT NULL,
  telefone_cliente     TEXT,
  cpf_cliente          TEXT,
  -- Endereço de entrega (snapshot no momento da compra)
  entrega_logradouro   TEXT,
  entrega_numero       TEXT,
  entrega_complemento  TEXT,
  entrega_bairro       TEXT,
  entrega_cidade       TEXT,
  entrega_estado       TEXT,
  entrega_cep          TEXT,
  -- Pagamento
  forma_pagamento      TEXT          NOT NULL DEFAULT 'pix',
  -- 'pendente' | 'pago' | 'falhou' | 'estornado'
  status_pagamento     TEXT          NOT NULL DEFAULT 'pendente',
  -- Status do pedido
  -- 'confirmado' | 'manipulacao' | 'despachado' | 'transito' | 'entregue' | 'cancelado'
  status               TEXT          NOT NULL DEFAULT 'confirmado',
  -- Financeiro
  subtotal             NUMERIC(10,2) NOT NULL,
  frete                NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_desconto       NUMERIC(10,2) DEFAULT 0,
  total                NUMERIC(10,2) NOT NULL,
  -- Rastreio
  codigo_rastreio      TEXT,
  previsao_entrega     DATE,
  -- Uso interno
  observacoes          TEXT,
  criado_em            TIMESTAMPTZ   DEFAULT NOW(),
  atualizado_em        TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX idx_pedidos_cliente        ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_numero         ON pedidos(numero_pedido);
CREATE INDEX idx_pedidos_status         ON pedidos(status);
CREATE INDEX idx_pedidos_criado_em      ON pedidos(criado_em DESC);

CREATE TRIGGER tg_pedidos_timestamp
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

-- =============================================================================
-- 7. ITENS DO PEDIDO
-- =============================================================================
CREATE TABLE IF NOT EXISTS itens_pedido (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id       UUID          NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id      UUID          REFERENCES produtos(id) ON DELETE SET NULL,
  -- Snapshot no momento da compra
  nome_produto    TEXT          NOT NULL,
  imagem_produto  TEXT,
  slug_produto    TEXT,
  quantidade      INT           NOT NULL CHECK (quantidade > 0),
  preco_unitario  NUMERIC(10,2) NOT NULL,
  preco_total     NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);

-- =============================================================================
-- 8. HISTÓRICO DE STATUS DO PEDIDO (timeline de rastreio)
-- =============================================================================
CREATE TABLE IF NOT EXISTS historico_pedidos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id    UUID        NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL,
  rotulo       TEXT        NOT NULL,
  observacao   TEXT,
  criado_por   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_historico_pedido ON historico_pedidos(pedido_id);

-- Trigger: registra automaticamente no histórico ao mudar o status do pedido
CREATE OR REPLACE FUNCTION fn_registrar_status_pedido()
RETURNS TRIGGER AS $$
DECLARE
  rotulos JSONB := '{
    "confirmado":  "Pedido confirmado",
    "manipulacao": "Em manipulação",
    "despachado":  "Despachado",
    "transito":    "Em trânsito",
    "entregue":    "Entregue",
    "cancelado":   "Pedido cancelado"
  }';
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO historico_pedidos (pedido_id, status, rotulo, criado_por)
    VALUES (
      NEW.id,
      NEW.status,
      COALESCE(rotulos ->> NEW.status, NEW.status),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_pedidos_historico_status
  AFTER UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION fn_registrar_status_pedido();

-- =============================================================================
-- 9. RECEITAS MÉDICAS
-- =============================================================================
CREATE TABLE IF NOT EXISTS receitas (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id       UUID        REFERENCES clientes(id) ON DELETE SET NULL,
  pedido_id        UUID        REFERENCES pedidos(id) ON DELETE SET NULL,
  nome_medico      TEXT,
  crm              TEXT,
  uf_crm           TEXT,
  data_receita     DATE,
  url_arquivo      TEXT,
  nome_arquivo     TEXT,
  observacoes      TEXT,
  -- 'aguardando_revisao' | 'aprovado' | 'rejeitado'
  status           TEXT        NOT NULL DEFAULT 'aguardando_revisao',
  revisado_por     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  revisado_em      TIMESTAMPTZ,
  motivo_rejeicao  TEXT,
  criado_em        TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_receitas_cliente ON receitas(cliente_id);
CREATE INDEX idx_receitas_status  ON receitas(status);

CREATE TRIGGER tg_receitas_timestamp
  BEFORE UPDATE ON receitas
  FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

-- =============================================================================
-- 10. NEWSLETTER
-- =============================================================================
CREATE TABLE IF NOT EXISTS newsletter (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  nome          TEXT,
  ativo         BOOLEAN     DEFAULT true,
  origem        TEXT,       -- 'rodape' | 'popup' | 'checkout'
  inscrito_em   TIMESTAMPTZ DEFAULT NOW(),
  cancelado_em  TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter(email);
CREATE INDEX idx_newsletter_ativo ON newsletter(ativo);

-- =============================================================================
-- 11. MENSAGENS DE CONTATO
-- =============================================================================
CREATE TABLE IF NOT EXISTS mensagens_contato (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  telefone         TEXT,
  assunto          TEXT        NOT NULL,
  mensagem         TEXT        NOT NULL,
  -- 'nao_lida' | 'lida' | 'respondida' | 'arquivada'
  status           TEXT        DEFAULT 'nao_lida',
  respondido_por   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  respondido_em    TIMESTAMPTZ,
  texto_resposta   TEXT,
  criado_em        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mensagens_status    ON mensagens_contato(status);
CREATE INDEX idx_mensagens_criado_em ON mensagens_contato(criado_em DESC);

-- =============================================================================
-- 12–15. RBAC — Perfis e Permissões (estrutura para implementação futura)
-- =============================================================================
CREATE TABLE IF NOT EXISTS perfis (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT UNIQUE NOT NULL,
  descricao   TEXT,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT UNIQUE NOT NULL,   -- ex: 'pedidos.ler', 'produtos.escrever'
  descricao   TEXT,
  recurso     TEXT NOT NULL,          -- ex: 'pedidos', 'produtos'
  acao        TEXT NOT NULL           -- ex: 'ler', 'escrever', 'excluir', 'gerenciar'
);

CREATE TABLE IF NOT EXISTS perfis_permissoes (
  perfil_id    UUID REFERENCES perfis(id) ON DELETE CASCADE,
  permissao_id UUID REFERENCES permissoes(id) ON DELETE CASCADE,
  PRIMARY KEY (perfil_id, permissao_id)
);

CREATE TABLE IF NOT EXISTS usuarios_perfis (
  usuario_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil_id    UUID REFERENCES perfis(id) ON DELETE CASCADE,
  concedido_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  concedido_em TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (usuario_id, perfil_id)
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE categorias          ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido         ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_pedidos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas             ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter           ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_contato    ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis               ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissoes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis_permissoes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_perfis      ENABLE ROW LEVEL SECURITY;

-- ── CATEGORIAS ───────────────────────────────────────────────────────────────
CREATE POLICY "categorias_leitura_publica" ON categorias
  FOR SELECT USING (ativo = true);

-- ── PRODUTOS ─────────────────────────────────────────────────────────────────
CREATE POLICY "produtos_leitura_publica" ON produtos
  FOR SELECT USING (ativo = true);

-- ── AVALIAÇÕES ───────────────────────────────────────────────────────────────
CREATE POLICY "avaliacoes_leitura_publica" ON avaliacoes
  FOR SELECT USING (aprovado = true);

CREATE POLICY "avaliacoes_inserir_autenticado" ON avaliacoes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "avaliacoes_atualizar_proprio" ON avaliacoes
  FOR UPDATE USING (auth.uid() = cliente_id);

-- ── CLIENTES ─────────────────────────────────────────────────────────────────
CREATE POLICY "clientes_ver_proprio" ON clientes
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "clientes_atualizar_proprio" ON clientes
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ── ENDEREÇOS ────────────────────────────────────────────────────────────────
CREATE POLICY "enderecos_proprio_tudo" ON enderecos
  FOR ALL USING (auth.uid() = cliente_id) WITH CHECK (auth.uid() = cliente_id);

-- ── PEDIDOS ──────────────────────────────────────────────────────────────────
CREATE POLICY "pedidos_ver_proprio" ON pedidos
  FOR SELECT USING (auth.uid() = cliente_id);

-- ── ITENS DO PEDIDO ──────────────────────────────────────────────────────────
CREATE POLICY "itens_pedido_ver_proprio" ON itens_pedido
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pedidos
      WHERE pedidos.id = itens_pedido.pedido_id
        AND pedidos.cliente_id = auth.uid()
    )
  );

-- ── HISTÓRICO DE PEDIDOS ─────────────────────────────────────────────────────
CREATE POLICY "historico_ver_proprio" ON historico_pedidos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pedidos
      WHERE pedidos.id = historico_pedidos.pedido_id
        AND pedidos.cliente_id = auth.uid()
    )
  );

-- ── RECEITAS ─────────────────────────────────────────────────────────────────
CREATE POLICY "receitas_ver_proprio" ON receitas
  FOR SELECT USING (auth.uid() = cliente_id);

CREATE POLICY "receitas_inserir_proprio" ON receitas
  FOR INSERT WITH CHECK (auth.uid() = cliente_id);

-- ── NEWSLETTER ───────────────────────────────────────────────────────────────
CREATE POLICY "newsletter_inscrever_publico" ON newsletter
  FOR INSERT WITH CHECK (true);

-- ── MENSAGENS DE CONTATO ─────────────────────────────────────────────────────
CREATE POLICY "mensagens_contato_enviar_publico" ON mensagens_contato
  FOR INSERT WITH CHECK (true);

-- ── RBAC (leitura pública para verificação de permissões no cliente) ──────────
CREATE POLICY "perfis_leitura_publica" ON perfis
  FOR SELECT USING (true);

CREATE POLICY "permissoes_leitura_publica" ON permissoes
  FOR SELECT USING (true);

CREATE POLICY "perfis_permissoes_leitura_publica" ON perfis_permissoes
  FOR SELECT USING (true);

CREATE POLICY "usuarios_perfis_ver_proprio" ON usuarios_perfis
  FOR SELECT USING (auth.uid() = usuario_id);
