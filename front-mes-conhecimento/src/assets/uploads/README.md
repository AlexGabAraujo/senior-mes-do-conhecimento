# Pasta de Uploads

Esta pasta armazena as imagens dos palestrantes enviadas através do painel administrativo.

## Como funciona

1. **Upload**: Quando um admin faz upload de uma imagem no formulário de palestra, o arquivo é enviado para o backend via POST `/api/upload/image`

2. **Armazenamento**: O backend salva o arquivo nesta pasta com um nome único (ex: `speaker-1234567890-abc123.jpg`)

3. **Referência**: O caminho relativo (ex: `uploads/speaker-1234567890-abc123.jpg`) é salvo no banco de dados

4. **Exibição**: O frontend carrega as imagens usando o caminho salvo no banco

## Formato dos arquivos

- **Tipos aceitos**: JPG, JPEG, PNG, WEBP
- **Tamanho máximo**: 5MB
- **Nomenclatura**: `speaker-{timestamp}-{uuid}.{extensão}`

## Observações

- Esta pasta deve ter permissões de escrita para o backend
- As imagens são servidas estaticamente pelo Angular
- Não versionar as imagens no Git (apenas o .gitkeep)
