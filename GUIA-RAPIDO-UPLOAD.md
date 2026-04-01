# Guia Rápido - Upload de Imagens

## 🚀 Como Iniciar

### Terminal 1: File Server (Node.js)
```bash
cd front-mes-conhecimento
npm run file-server
```

Você verá:
```
🚀 File server rodando em http://localhost:3001
📁 Salvando arquivos em: /path/to/front-mes-conhecimento/src/assets/uploads
```

### Terminal 2: Backend (Spring Boot)
```bash
cd back-mes-conhecimento
./mvnw spring-boot:run
```

### Terminal 3: Frontend (Angular)
```bash
cd front-mes-conhecimento
npm start
```

## 📝 Como Usar

1. Acesse `http://localhost:4200/admin`
2. Faça login como admin
3. Clique em "Nova Palestra"
4. Selecione uma imagem
5. Preencha os dados
6. Clique em "Salvar"

## ✅ O que acontece

1. **Seleção da imagem**: Preview é exibido no modal
2. **Salvamento local**: Imagem é enviada para `http://localhost:3001/upload`
3. **File server**: Salva em `src/assets/uploads/speaker-xxx.jpg`
4. **Retorno da URL**: `/assets/uploads/speaker-xxx.jpg`
5. **Criação da palestra**: Dados + URL são enviados para `/api/admin/lectures`
6. **Backend**: Salva apenas a URL no banco de dados
7. **Listagem**: Frontend carrega imagem de `/assets/uploads/speaker-xxx.jpg`

## 🔧 Troubleshooting

### Erro: "Falha ao salvar imagem"
```bash
# Verifique se o file-server está rodando
cd front-mes-conhecimento
npm run file-server
```

### Imagem não aparece
- Verifique se o arquivo existe em `front-mes-conhecimento/src/assets/uploads/`
- Abra o console do navegador (F12) e veja se há erros 404
- Verifique se a URL no banco está correta

### Porta 3001 em uso
Edite `file-server.js` e mude a porta:
```javascript
const PORT = 3002; // ou outra porta disponível
```

E atualize `file-upload.service.ts`:
```typescript
private readonly fileServerUrl = 'http://localhost:3002/upload';
```

## 📦 Arquivos Modificados

### Removidos
- ❌ `FileUploadController.java` (backend)
- ❌ Endpoint `/api/upload/image`
- ❌ Regras de segurança para `/api/upload/**`

### Adicionados
- ✅ `file-server.js` (servidor Node.js)
- ✅ Script `npm run file-server`

### Modificados
- ✅ `file-upload.service.ts` - Usa servidor local
- ✅ `SecurityConfig.java` - Removidas regras de upload
- ✅ `package.json` - Adicionado script file-server

## 🎯 Fluxo Simplificado

```
[Usuário seleciona imagem]
         ↓
[FileUploadService.saveImageLocally()]
         ↓
[POST http://localhost:3001/upload]
         ↓
[File Server salva em assets/uploads/]
         ↓
[Retorna: /assets/uploads/speaker-xxx.jpg]
         ↓
[Modal envia dados + URL]
         ↓
[POST /api/admin/lectures]
         ↓
[Backend salva URL no banco]
         ↓
[Listagem carrega imagem da URL]
```

## 🌐 Produção

Para produção, substitua o file-server por um serviço de storage:

```typescript
// file-upload.service.ts
private readonly fileServerUrl = 'https://api.seu-dominio.com/upload';
```

Opções:
- AWS S3
- Firebase Storage
- Cloudinary
- Azure Blob Storage
- Google Cloud Storage
