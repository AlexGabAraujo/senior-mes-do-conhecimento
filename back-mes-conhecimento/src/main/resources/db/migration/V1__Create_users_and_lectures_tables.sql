CREATE TABLE tb_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE tb_lectures (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker VARCHAR(255) NOT NULL,
    description TEXT,
    target_audience VARCHAR(50),
    date DATE NOT NULL,
    time VARCHAR(5) NOT NULL,
    type VARCHAR(50) NOT NULL,
    speaker_image_path VARCHAR(255),
    registration_url VARCHAR(500),
    finished BOOLEAN DEFAULT false
);

-- Insere o usuário ADMIN padrão
-- A senha armazenada é um hash BCrypt (regra Nunca armazene em plain-text obedecida).
INSERT INTO tb_users (email, username, password, role) 
VALUES ('admin@ucs.br', 'root', '$2a$10$XU.i4sWv.M0F.qONtG9xQe3u9Q4.yVp9aW8B1sT8i/eU/Zt3aH6', 'ADMIN');
