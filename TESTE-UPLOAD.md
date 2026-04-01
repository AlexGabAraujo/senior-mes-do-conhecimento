# Teste do Novo Fluxo de Upload

## 🧪 Roteiro de Testes

### Pré-requisitos
- [ ] Node.js instalado
- [ ] Java/Maven instalado
- [ ] Banco de dados configurado

### Passo 1: Iniciar Serviços

#### Terminal 1: File Server
```bash
cd front-mes-conhecimento
npm run file-server
```

**Resultado esperado:**
```
🚀 File server rodando em http://localhost:3001
📁 Salvando arquivos em: C:\...\front-mes-conhecimento\src\assets\uploads

💡 Para usar:
   1. Mantenha este servidor rodando
   2. Inicie o frontend: npm start
   3. Crie uma palestra e selecione uma imagem
```

- [ ] File server iniciou sem erros
- [ ] Porta 3001 está disponível

#### Terminal 2: Backend
```bash
cd back-mes-conhecimento
./mvnw spring-boot:run
```

**Resultado esperado:**
```
Started MesConhecimentoApplication in X.XXX seconds
```

- [ ] Backend iniciou sem erros
- [ ] Porta 8080 está disponível
- [ ] Conexão com banco de dados OK

#### Terminal 3: Frontend
```bash
cd front-mes-conhecimento
npm start
```

**Resultado esperado:**
```
** Angular Live Development Server is listening on localhost:4200 **
```

- [ ] Frontend iniciou sem erros
- [ ] Porta 4200 está disponível

### Passo 2: Teste de Upload

1. **Acesse a aplicação**
   - URL: `http://localhost:4200/admin`
   - [ ] Página carregou corretamente

2. **Faça login**
   - Usuário: admin
   - Senha: (sua senha de admin)
   - [ ] Login realizado com sucesso

3. **Abra o modal de nova palestra**
   - Clique em "Nova Palestra"
   - [ ] Modal abriu corretamente

4. **Selecione uma imagem**
   - Clique em "Escolher arquivo"
   - Selecione uma imagem JPG, PNG ou WEBP (máx 5MB)
   - [ ] Preview da imagem apareceu no modal

5. **Verifique o console do file-server**
   - Deve aparecer: `✅ Arquivo salvo: speaker-XXXXX.jpg`
   - [ ] Mensagem de sucesso apareceu

6. **Verifique a pasta assets**
   - Navegue até: `front-mes-conhecimento/src/assets/uploads/`
   - [ ] Arquivo foi criado com nome `speaker-XXXXX.jpg`

7. **Preencha os dados da palestra**
   - Título: "Teste de Upload"
   - Palestrante: "João Silva"
   - Descrição: "Palestra de teste"
   - Data: (qualquer data futura)
   - Horário: "14:00"
   - Tipo: "PALESTRA"
   - Público-alvo: "TODOS"
   - [ ] Todos os campos preenchidos

8. **Salve a palestra**
   - Clique em "Salvar"
   - [ ] Modal fechou
   - [ ] Palestra apareceu na listagem

9. **Verifique a imagem na listagem**
   - [ ] Imagem do palestrante aparece corretamente
   - [ ] Não há erro 404 no console do navegador

### Passo 3: Teste de Edição

1. **Edite a palestra criada**
   - Clique no botão de editar
   - [ ] Modal abriu com dados preenchidos
   - [ ] Preview da imagem aparece

2. **Troque a imagem**
   - Selecione outra imagem
   - [ ] Novo preview apareceu
   - [ ] File server salvou novo arquivo

3. **Salve as alterações**
   - Clique em "Salvar"
   - [ ] Palestra atualizada
   - [ ] Nova imagem aparece na listagem

### Passo 4: Teste de Validação

1. **Tente enviar arquivo muito grande**
   - Selecione imagem > 5MB
   - [ ] Erro: "Arquivo muito grande. Máximo 5MB"

2. **Tente enviar arquivo não-imagem**
   - Selecione PDF, TXT, etc
   - [ ] Erro: "Formato inválido. Use JPG, PNG ou WEBP"

### Passo 5: Teste de Fallback

1. **Pare o file-server** (Ctrl+C no Terminal 1)

2. **Tente criar palestra com imagem**
   - [ ] Erro: "Falha ao salvar imagem. Verifique se o file-server está rodando"
   - [ ] Console mostra: "⚠️ Certifique-se de que o file-server está rodando"

3. **Reinicie o file-server**
   - `npm run file-server`
   - [ ] Upload volta a funcionar

### Passo 6: Teste de Imagem Padrão

1. **Crie palestra sem selecionar imagem**
   - Preencha todos os campos
   - Não selecione imagem
   - Salve
   - [ ] Palestra criada com imagem padrão (avatar gerado)

## 📊 Checklist Final

### Funcionalidades
- [ ] Upload de imagem funciona
- [ ] Preview da imagem funciona
- [ ] Imagem é salva em assets/uploads/
- [ ] URL correta é salva no banco
- [ ] Imagem aparece na listagem
- [ ] Edição de imagem funciona
- [ ] Validações funcionam
- [ ] Fallback para imagem padrão funciona

### Servidores
- [ ] File server roda sem erros
- [ ] Backend roda sem erros
- [ ] Frontend roda sem erros
- [ ] Não há erros no console do navegador
- [ ] Não há erros no console do file-server
- [ ] Não há erros no console do backend

### Arquivos
- [ ] Imagens são salvas em assets/uploads/
- [ ] Nomes de arquivo são únicos
- [ ] Extensões são preservadas
- [ ] Arquivos não são corrompidos

## 🐛 Problemas Comuns

### File server não inicia
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solução:** Porta 3001 em uso. Mude a porta no `file-server.js`

### Erro 404 na imagem
**Solução:** 
1. Verifique se o arquivo existe em `assets/uploads/`
2. Verifique se a URL no banco está correta
3. Reinicie o frontend

### Upload falha
**Solução:**
1. Verifique se o file-server está rodando
2. Verifique se a pasta `assets/uploads/` existe
3. Verifique permissões de escrita

## ✅ Resultado Esperado

Todos os testes devem passar. Se algum falhar, verifique:
1. Logs do file-server
2. Logs do backend
3. Console do navegador (F12)
4. Permissões de arquivo
5. Portas disponíveis

## 📝 Relatório de Teste

Data: ___/___/______
Testador: _________________

| Teste | Status | Observações |
|-------|--------|-------------|
| Passo 1 | ⬜ | |
| Passo 2 | ⬜ | |
| Passo 3 | ⬜ | |
| Passo 4 | ⬜ | |
| Passo 5 | ⬜ | |
| Passo 6 | ⬜ | |

Status: ⬜ Não testado | ✅ Passou | ❌ Falhou
