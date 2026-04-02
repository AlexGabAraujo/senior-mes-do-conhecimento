-- Migration para criar tabela de mensagens de chat
-- Suporta mensagens vinculadas a palestras específicas ou ao Chat Geral (lecture_id NULL)

CREATE TABLE mensagem_chat (
    id BIGSERIAL PRIMARY KEY,
    lecture_id BIGINT,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_mensagem_chat_lecture 
        FOREIGN KEY (lecture_id) 
        REFERENCES tb_lectures(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_mensagem_chat_user 
        FOREIGN KEY (user_id) 
        REFERENCES tb_users(id) 
        ON DELETE CASCADE
);

-- Índice composto para otimizar queries de mensagens por palestra ordenadas por timestamp
CREATE INDEX idx_mensagem_chat_lecture_timestamp 
    ON mensagem_chat(lecture_id, timestamp);

-- Índice para otimizar joins com tabela de usuários
CREATE INDEX idx_mensagem_chat_user 
    ON mensagem_chat(user_id);

-- Índice parcial para otimizar queries do Chat Geral (WHERE lecture_id IS NULL)
CREATE INDEX idx_mensagem_chat_general 
    ON mensagem_chat(timestamp) 
    WHERE lecture_id IS NULL;
