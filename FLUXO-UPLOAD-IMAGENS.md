# Fluxo de Upload de Imagens - Palestras

## Arquitetura Simplificada

O fluxo de upload foi refatorado para ser mais simples e direto:

### ❌ Fluxo Antigo (Removido)
1. Usuário seleciona imagem no modal
2. POST para `/api/upload/image` (backend Java)
3. Backend salva em `../front-mes-conhecimento/src/assets/uploads/`
4. Retorna URL
5. Frontend envia URL junto com dados da palestra

### ✅ Fluxo Novo (Atual)
1. Usuário seleciona imagem no modal
2. POST para `http://localhost:3001/upload` (servidor Node.js local)
3. Servidor Node salva em `front-mes-conhecimento/src/assets/uploads/`
4. Retorna URL `/assets/uploads/speaker-xxx.jpg`
5. Frontend envia URL junto com dados da palestra para `/api/admin/lectures`
6. Backend salva apenas a URL no banco de dados

## Componentes

### Frontend (Angular)

**FileUploadService** (`file-upload.service.ts`)
- `saveImageLocally(file)`: Envia arquivo para servidor Node.js local
- `validateImage(file)`: Valida tipo e tamanho
- `createImagePreview(file)`: Cria preview base64

**PalestraFormModalComponent**
- Seleciona imagem
- Valida e cria preview
- Salva localmente via `FileUploadService`
- Envia URL junto com dados da palestra

### File Server (Node.js)

**file-server.js** - Porta 3001
- Recebe arquivos via POST `/upload`
- Salva em `src/assets/uploads/`
- Retorna URL `/assets/uploads/filename`
- Suporta CORS para desenvolvimento

### Backend (Spring Boot)

**AdminLectureController**
- Recebe `LectureRequestDTO` com `speakerImagePath` (string)
- Salva apenas a URL no banco
- Não processa arquivos

## Como Usar

### 1. Iniciar o File Server

```bash
cd front-mes-conhecimento
node file-server.js
```

Saída esperada:
```
🚀 File server rodando em http://localhost:3001
📁 Salvando arquivos em: /path/to/front-mes-conhecimento/src/assets/uploads
```

### 2. Iniciar o Backend

```bash
cd back-mes-conhecimento
./mvnw spring-boot:run
```

### 3. Iniciar o Frontend

```bash
cd front-mes-conhecimento
npm start
```

### 4. Criar Palestra

1. Acesse a área administrativa
2. Clique em "Nova Palestra"
3. Selecione uma imagem
4. Preencha os dados
5. Salve

O fluxo completo:
- Imagem é salva em `assets/uploads/` via file-server
- URL é retornada: `/assets/uploads/speaker-xxx.jpg`
- Dados + URL são enviados para `/api/admin/lectures`
- Backend salva tudo no banco

## Estrutura de Arquivos

```
front-mes-conhecimento/
├── file-server.js                    # Servidor Node.js para salvar arquivos
├── src/
│   ├── assets/
│   │   └── uploads/                  # Imagens salvas aqui
│   │       ├── speaker-xxx.jpg
│   │       └── ...
│   └── app/
│       └── core/
│           └── services/
│               └── file-upload.service.ts  # Serviço de upload

back-mes-conhecimento/
└── src/
    └── main/
        └── java/
            └── .../web/controllers/
                └── AdminLectureController.java  # Recebe URL da imagem
```

## Vantagens do Novo Fluxo

1. ✅ Separação de responsabilidades
   - Node.js: Gerencia arquivos estáticos
   - Spring Boot: Gerencia lógica de negócio

2. ✅ Simplicidade
   - Sem endpoint de upload no backend Java
   - Sem manipulação de arquivos no Spring

3. ✅ Desenvolvimento mais rápido
   - File server leve e simples
   - Fácil de debugar

4. ✅ Preparado para produção
   - Fácil migrar para S3, Firebase Storage, etc
   - Apenas trocar o `fileServerUrl` no serviço

## Migração para Produção

Para produção, substitua o file-server por um serviço de storage:

```typescript
// file-upload.service.ts
private readonly fileServerUrl = 'https://api.seu-dominio.com/upload';
// ou
private readonly fileServerUrl = 'https://seu-bucket.s3.amazonaws.com/upload';
```

## Troubleshooting

### Erro: "Falha ao salvar imagem"
- Verifique se o file-server está rodando: `node file-server.js`
- Verifique se a porta 3001 está livre

### Imagem não aparece na listagem
- Verifique se o arquivo existe em `src/assets/uploads/`
- Verifique o console do navegador para erros 404
- Verifique se a URL no banco está correta: `/assets/uploads/filename`

### CORS Error
- O file-server já está configurado com CORS
- Se persistir, verifique se está usando `http://localhost:3001`
