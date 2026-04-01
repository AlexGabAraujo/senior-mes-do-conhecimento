# Sistema de Upload de Imagens - Mês do Conhecimento

## 📖 Visão Geral

Sistema simplificado de upload de imagens para palestras, onde:
- Imagens são salvas localmente na pasta `assets` do frontend
- Apenas a URL é enviada para o backend
- Tudo acontece em um único fluxo integrado

## 🏗️ Arquitetura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Angular   │─────▶│ File Server  │─────▶│   assets/   │
│  (Frontend) │      │  (Node.js)   │      │   uploads/  │
└─────────────┘      └──────────────┘      └─────────────┘
       │                                            │
       │                                            │
       │              ┌──────────────┐              │
       └─────────────▶│  Spring Boot │◀─────────────┘
                      │   (Backend)  │
                      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   Database   │
                      │  (URL only)  │
                      └──────────────┘
```

## 📚 Documentação

- **[GUIA-RAPIDO-UPLOAD.md](GUIA-RAPIDO-UPLOAD.md)** - Como iniciar e usar
- **[FLUXO-UPLOAD-IMAGENS.md](FLUXO-UPLOAD-IMAGENS.md)** - Documentação técnica completa
- **[RESUMO-REFATORACAO.md](RESUMO-REFATORACAO.md)** - O que foi mudado
- **[TESTE-UPLOAD.md](TESTE-UPLOAD.md)** - Roteiro de testes

## 🚀 Início Rápido

### 1. Instale as dependências
```bash
cd front-mes-conhecimento
npm install
```

### 2. Inicie os serviços (3 terminais)

**Terminal 1 - File Server:**
```bash
cd front-mes-conhecimento
npm run file-server
```

**Terminal 2 - Backend:**
```bash
cd back-mes-conhecimento
./mvnw spring-boot:run
```

**Terminal 3 - Frontend:**
```bash
cd front-mes-conhecimento
npm start
```

### 3. Acesse e teste
- URL: `http://localhost:4200/admin`
- Crie uma palestra
- Selecione uma imagem
- Salve e veja a imagem na listagem

## 🔧 Componentes

### File Server (Node.js)
- **Arquivo:** `front-mes-conhecimento/file-server.js`
- **Porta:** 3001
- **Função:** Salva arquivos em `assets/uploads/`
- **Comando:** `npm run file-server`

### Frontend (Angular)
- **Serviço:** `file-upload.service.ts`
- **Componente:** `palestra-form-modal.component.ts`
- **Função:** Gerencia upload e preview de imagens

### Backend (Spring Boot)
- **Controller:** `AdminLectureController.java`
- **DTO:** `LectureRequestDTO.java`
- **Função:** Recebe e salva URL da imagem

## 📁 Estrutura de Arquivos

```
projeto/
├── front-mes-conhecimento/
│   ├── file-server.js                 # Servidor de arquivos
│   ├── package.json                   # Script: npm run file-server
│   └── src/
│       ├── assets/
│       │   └── uploads/               # Imagens salvas aqui
│       │       └── speaker-*.jpg
│       └── app/core/services/
│           └── file-upload.service.ts # Serviço de upload
│
├── back-mes-conhecimento/
│   ├── fix-old-image-paths.sql        # Migração de dados antigos
│   └── src/.../controllers/
│       └── AdminLectureController.java # Recebe URL
│
└── Documentação/
    ├── README-UPLOAD-IMAGENS.md       # Este arquivo
    ├── GUIA-RAPIDO-UPLOAD.md          # Guia rápido
    ├── FLUXO-UPLOAD-IMAGENS.md        # Documentação técnica
    ├── RESUMO-REFATORACAO.md          # Mudanças realizadas
    └── TESTE-UPLOAD.md                # Roteiro de testes
```

## 🔄 Fluxo de Upload

1. **Usuário seleciona imagem** no modal
2. **Preview** é exibido (base64)
3. **POST** para `http://localhost:3001/upload`
4. **File server** salva em `assets/uploads/speaker-xxx.jpg`
5. **Retorna** URL: `/assets/uploads/speaker-xxx.jpg`
6. **Formulário** é preenchido com a URL
7. **POST** para `/api/admin/lectures` com todos os dados + URL
8. **Backend** salva URL no banco de dados
9. **Listagem** carrega imagem da URL

## ✅ Vantagens

- ✅ Sem endpoint de upload no backend Java
- ✅ Separação de responsabilidades
- ✅ Fácil migração para cloud storage
- ✅ Desenvolvimento mais rápido
- ✅ Menos complexidade no backend

## 🌐 Migração para Produção

Para produção, substitua o file-server por um serviço de storage:

```typescript
// file-upload.service.ts
private readonly fileServerUrl = 'https://api.seu-dominio.com/upload';
```

Opções recomendadas:
- **AWS S3** - Escalável e confiável
- **Firebase Storage** - Fácil integração
- **Cloudinary** - Otimização automática de imagens
- **Azure Blob Storage** - Integração com Microsoft
- **Google Cloud Storage** - Integração com Google

## 🐛 Troubleshooting

### File server não inicia
```bash
# Verifique se a porta 3001 está livre
netstat -ano | findstr :3001

# Ou mude a porta no file-server.js
const PORT = 3002;
```

### Imagem não aparece
1. Verifique se o arquivo existe em `assets/uploads/`
2. Abra o console do navegador (F12)
3. Verifique erros 404
4. Reinicie o frontend

### Upload falha
1. Certifique-se de que o file-server está rodando
2. Verifique permissões de escrita na pasta
3. Veja os logs do file-server

## 📊 Checklist de Implementação

- [x] FileUploadController.java removido
- [x] Endpoint /api/upload/image removido
- [x] file-server.js criado
- [x] file-upload.service.ts atualizado
- [x] SecurityConfig.java atualizado
- [x] Documentação criada
- [x] Scripts de teste criados
- [x] Script de migração SQL criado

## 🤝 Contribuindo

Para adicionar melhorias:
1. Leia a documentação técnica em `FLUXO-UPLOAD-IMAGENS.md`
2. Execute os testes em `TESTE-UPLOAD.md`
3. Faça suas alterações
4. Teste novamente
5. Atualize a documentação

## 📞 Suporte

Se encontrar problemas:
1. Consulte `TESTE-UPLOAD.md` para troubleshooting
2. Verifique os logs dos 3 servidores
3. Abra o console do navegador (F12)
4. Verifique as permissões de arquivo

## 📝 Licença

Este projeto faz parte do sistema Mês do Conhecimento da Senior Sistemas.

---

**Última atualização:** Abril 2026
**Versão:** 2.0 (Fluxo simplificado)
