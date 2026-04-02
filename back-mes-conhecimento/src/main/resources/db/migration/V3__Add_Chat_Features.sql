-- Migration V3: Suporte a respostas e avaliações de mensagens no chat
-- Adiciona auto-relacionamento em mensagem_chat e cria tabela de avaliações

-- ============================================================
-- 1. Adicionar coluna de referência à mensagem pai (para respostas)
-- ============================================================

ALTER TABLE mensagem_chat
    ADD COLUMN mensagem_pai_id BIGINT,
    ADD CONSTRAINT fk_mensagem_chat_pai
        FOREIGN KEY (mensagem_pai_id)
        REFERENCES mensagem_chat(id)
        ON DELETE SET NULL;

-- ============================================================
-- 2. Criar tabela de avaliações de mensagens (LIKE / DISLIKE)
-- ============================================================

CREATE TABLE mensagem_avaliacao (
    id          BIGSERIAL    PRIMARY KEY,
    usuario_id  BIGINT       NOT NULL,
    mensagem_id BIGINT       NOT NULL,
    tipo        VARCHAR(10)  NOT NULL,
    timestamp   TIMESTAMP    NOT NULL DEFAULT NOW(),

    -- Chave estrangeira para o usuário que avaliou
    CONSTRAINT fk_avaliacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES tb_users(id)
        ON DELETE CASCADE,

    -- Chave estrangeira para a mensagem avaliada; exclui avaliações ao excluir mensagem
    CONSTRAINT fk_avaliacao_mensagem
        FOREIGN KEY (mensagem_id)
        REFERENCES mensagem_chat(id)
        ON DELETE CASCADE,

    -- Garante que cada usuário avalie uma mensagem no máximo uma vez
    CONSTRAINT uq_avaliacao_usuario_mensagem
        UNIQUE (usuario_id, mensagem_id),

    -- Restringe os valores aceitos para o tipo de avaliação
    CONSTRAINT chk_avaliacao_tipo
        CHECK (tipo IN ('LIKE', 'DISLIKE'))
);

-- ============================================================
-- 3. Índices para otimização de consultas
-- ============================================================

-- Índice para buscas de avaliações por mensagem
CREATE INDEX idx_avaliacao_mensagem
    ON mensagem_avaliacao(mensagem_id);
