-- Script para corrigir URLs de imagens antigas no banco de dados
-- Execute este script se você tiver palestras criadas com o fluxo antigo

-- Verifica os registros atuais
SELECT id, title, speaker, speaker_image_path 
FROM lectures 
WHERE speaker_image_path IS NOT NULL;

-- Corrige URLs que começam com 'uploads/' (sem barra inicial)
UPDATE lectures 
SET speaker_image_path = CONCAT('/assets/', speaker_image_path)
WHERE speaker_image_path LIKE 'uploads/%';

-- Verifica os registros após a correção
SELECT id, title, speaker, speaker_image_path 
FROM lectures 
WHERE speaker_image_path LIKE '/assets/uploads/%';

-- Resultado esperado: todas as URLs devem começar com /assets/uploads/
