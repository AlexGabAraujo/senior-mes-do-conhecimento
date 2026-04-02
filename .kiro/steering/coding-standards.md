# Regras Antigravity v1.1

## Regras Gerais
- **Idioma:** Sempre utilize Português do Brasil para comentários, documentação e logs.
- **Qualidade de Código:** Siga rigorosamente os princípios de Clean Code e SOLID.
- **DRY (Don't Repeat Yourself):** Evite duplicidade de código; priorize a reutilização lógica.
- **Segurança:** Nunca armazene senhas em texto plano; utilize obrigatoriamente BCrypt para hashing.
- **Tratamento de Erros:** Utilize o padrão RFC 7807 (Problem Details) para respostas de erro na API.

## Frontend (Angular 19)
- **Stack:** Angular 19, Tailwind CSS, Spartan UI.
- **Arquitetura:** Estrutura de pastas baseada em funcionalidades (feature-based).
- **Estilo de Código:** Uso de Signals para gerenciamento de estado, Componentes Standalone e tipagem estrita (Proibido o uso de `any`).
- **Padrões:** Prefira a função `inject()` em vez de injeção via construtor; utilize obrigatoriamente inputs, outputs e models baseados em Signals.

## Backend (Java 21)
- **Stack:** Spring Boot 3.4, Java 21, PostgreSQL.
- **Arquitetura:** Camadas inspiradas em DDD (Web, Application, Domain, Infrastructure).
- **Estilo de Código:** Uso de Records para DTOs, Injeção de Dependência via Construtor e Virtual Threads habilitadas.
- **API:** Documentação automática via OpenAPI/Swagger; Uso de Bean Validation (JSR 303) para validação de DTOs.
- **Bibliotecas** O projeto base foi criado sem nenhuma biblioteca, se necessario adicione-as ao pom

## Workflow de Execução (Passo a Passo)
- **Atomicidade:** Nunca execute múltiplas tarefas complexas simultaneamente.
- **Checkpoint de Validação:** Ao concluir uma subtarefa, você DEVE parar e perguntar explicitamente: *"A tarefa [Nome da Task] está funcionando conforme o esperado? Posso prosseguir?"*. Em caso de confirmação positiva, realize o commit imediatamente.
- **Proibição de Avanço:** Não inicie a próxima tarefa sem a confirmação e autorização explícita do usuário.

## Protocolo de Git
- **Commit Automático:** Realize um commit após a validação bem-sucedida de cada tarefa.
- **Mensagens (Conventional Commits):** Utilize os prefixos `feat:`, `fix:`, `refactor:`, ou `chore:`. 
  - *Exemplo:* `feat(auth): implementa lógica de autenticação com jwt`.
- **Escopo:** Sempre inclua o escopo da alteração entre parênteses (ex: `api`, `ui`, `db`, `auth`) para facilitar o rastreio histórico.