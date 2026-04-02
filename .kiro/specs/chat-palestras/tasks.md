# Plano de Implementação: Sistema de Chat/Fórum de Palestras

## Visão Geral

Este plano detalha a implementação do sistema de chat/fórum vinculado a palestras, incluindo um Chat Geral. A implementação segue a arquitetura DDD no backend (Java 21 Spring Boot 3.4) e feature-based no frontend (Angular 19), com testes de propriedades e unitários para garantir corretude.

## Tarefas

- [x] 1. Configurar dependências de testes
  - Adicionar jqwik ao pom.xml do backend para property-based testing
  - Adicionar fast-check ao package.json do frontend para property-based testing
  - _Requisitos: Estratégia de Testes_

- [x] 2. Backend - Camada de Domínio
  - [x] 2.1 Criar entidade de domínio ChatMessage
    - Implementar classe ChatMessage em `domain/entities/ChatMessage.java`
    - Incluir campos: id, lectureId (nullable), userId, content, timestamp
    - Implementar métodos auxiliares: isGeneralChat(), isFromUser()
    - Adicionar validação de conteúdo não vazio
    - _Requisitos: 1.1, 1.2, 1.4_
  
  - [x] 2.2 Criar interface ChatMessageRepository
    - Implementar interface em `domain/repositories/ChatMessageRepository.java`
    - Definir métodos: save(), findByLectureIdOrderByTimestampAsc(), findGeneralChatMessagesOrderByTimestampAsc()
    - _Requisitos: 1.5, 2.1, 13.2_

- [x] 3. Backend - Camada de Infraestrutura (Persistência)
  - [x] 3.1 Criar migration Flyway para tabela mensagem_chat
    - Criar arquivo `V3__create_mensagem_chat_table.sql` em `resources/db/migration/`
    - Definir tabela com colunas: id, lecture_id (nullable), user_id, content, timestamp
    - Adicionar foreign keys com CASCADE DELETE para lecture_id e user_id
    - Criar índices: idx_mensagem_chat_lecture_timestamp, idx_mensagem_chat_user, idx_mensagem_chat_general
    - _Requisitos: 1.1, 1.3, 1.4, 12.1, 12.2, 12.3_
  
  - [x] 3.2 Criar ChatMessageEntity (JPA)
    - Implementar entidade JPA em `infrastructure/persistence/entities/ChatMessageEntity.java`
    - Mapear para tabela mensagem_chat
    - Configurar relacionamentos lazy com LectureEntity e UserEntity
    - Adicionar anotações de índices
    - _Requisitos: 1.1, 1.3, 1.4_
  
  - [x] 3.3 Criar ChatMessageMapper
    - Implementar mapper em `infrastructure/persistence/mappers/ChatMessageMapper.java`
    - Criar métodos estáticos: toDomain(), toEntity()
    - _Requisitos: Conversão entre camadas_
  
  - [x] 3.4 Criar ChatMessageJpaRepository
    - Implementar interface JPA em `infrastructure/persistence/repositories/ChatMessageJpaRepository.java`
    - Estender JpaRepository<ChatMessageEntity, Long>
    - Adicionar query methods: findByLectureIdOrderByTimestampAsc(), findGeneralChatMessagesOrderByTimestampAsc()
    - _Requisitos: 2.1, 13.2_
  
  - [x] 3.5 Implementar ChatMessageRepositoryImpl
    - Implementar classe em `infrastructure/persistence/repositories/ChatMessageRepositoryImpl.java`
    - Implementar interface ChatMessageRepository do domínio
    - Delegar operações para ChatMessageJpaRepository
    - Usar ChatMessageMapper para conversões
    - _Requisitos: 1.5, 2.1, 13.2_
  
  - [ ]*  3.6 Escrever testes de propriedade para round-trip de mapeamento
    - **Property: Round-trip de mapeamento Entity ↔ Domain**
    - **Valida: Requisitos de conversão entre camadas**
    - Testar que toDomain(toEntity(domain)) preserva dados

- [x] 4. Backend - Camada de Aplicação (DTOs)
  - [x] 4.1 Criar ChatMessageRequestDTO
    - Implementar record em `application/dtos/ChatMessageRequestDTO.java`
    - Campos: lectureId (nullable), content
    - Adicionar validação @NotBlank para content
    - _Requisitos: 3.1, 3.2, 13.3_
  
  - [x] 4.2 Criar ChatMessageResponseDTO
    - Implementar record em `application/dtos/ChatMessageResponseDTO.java`
    - Campos: id, lectureId, userId, username, content, timestamp
    - _Requisitos: 2.2, 2.3_
  
  - [x] 4.3 Criar ChatRoomDTO
    - Implementar record em `application/dtos/ChatRoomDTO.java`
    - Campos: lectureId (nullable), name, lectureDate (nullable), isGeneral
    - _Requisitos: 5.1, 5.3, 13.4_

- [x] 5. Backend - Camada de Aplicação (Use Cases)
  - [x] 5.1 Implementar GetChatMessagesUseCase
    - Criar classe em `application/usecases/chat/GetChatMessagesUseCase.java`
    - Implementar método execute(Long lectureId) para mensagens de palestra
    - Implementar método executeForGeneralChat() para Chat Geral
    - Buscar mensagens ordenadas por timestamp
    - Enriquecer com username do remetente
    - _Requisitos: 2.1, 2.2, 2.3, 13.2_
  
  - [ ]*  5.2 Escrever teste de propriedade para ordenação de mensagens
    - **Property 2: Mensagens Ordenadas por Timestamp**
    - **Valida: Requisitos 2.1, 13.2**
    - Gerar mensagens com timestamps aleatórios, verificar ordenação crescente
  
  - [x] 5.3 Implementar SendChatMessageUseCase
    - Criar classe em `application/usecases/chat/SendChatMessageUseCase.java`
    - Implementar método execute(ChatMessageRequestDTO, Long userId)
    - Validar que palestra existe (se lectureId não NULL)
    - Validar que usuário existe
    - Criar ChatMessage com timestamp automático
    - Persistir e retornar ChatMessageResponseDTO
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 13.3_
  
  - [ ]*  5.4 Escrever teste de propriedade para round-trip de persistência
    - **Property 4: Round-Trip de Persistência de Mensagens**
    - **Valida: Requisitos 3.1, 13.3**
    - Persistir mensagem válida e recuperar, verificar equivalência de dados
  
  - [ ]*  5.5 Escrever teste de propriedade para rejeição de conteúdo vazio
    - **Property 5: Rejeição de Conteúdo Vazio**
    - **Valida: Requisito 3.2**
    - Gerar strings vazias/whitespace, verificar erro de validação
  
  - [ ]*  5.6 Escrever teste de propriedade para validação de palestra existente
    - **Property 6: Validação de Palestra Existente**
    - **Valida: Requisito 3.3**
    - Gerar IDs de palestras inexistentes, verificar erro
  
  - [x] 5.7 Implementar GetChatRoomsUseCase
    - Criar classe em `application/usecases/chat/GetChatRoomsUseCase.java`
    - Implementar método execute()
    - Adicionar Chat Geral como primeira opção (lectureId NULL)
    - Buscar todas as palestras e converter para ChatRoomDTO
    - _Requisitos: 5.1, 5.2, 5.3, 13.4_
  
  - [ ]*  5.8 Escrever teste unitário para completude da lista de chats
    - **Property 9: Completude da Lista de Chats**
    - **Valida: Requisitos 5.1, 5.3**
    - Verificar que retorna N+1 chats (N palestras + Chat Geral)

- [x] 6. Backend - Camada Web (Controller)
  - [x] 6.1 Criar ChatController
    - Implementar controller em `web/controllers/ChatController.java`
    - Adicionar anotação @RestController e @RequestMapping("/api/chat")
    - Injetar UseCases via construtor
    - _Requisitos: Estrutura base do controller_
  
  - [x] 6.2 Implementar endpoint GET /api/chat/messages
    - Criar método getMessages(@RequestParam Long lectureId)
    - Chamar GetChatMessagesUseCase.execute(lectureId)
    - Retornar ResponseEntity<List<ChatMessageResponseDTO>>
    - _Requisitos: 2.1, 2.2, 2.3_
  
  - [x] 6.3 Implementar endpoint GET /api/chat/messages/general
    - Criar método getGeneralMessages()
    - Chamar GetChatMessagesUseCase.executeForGeneralChat()
    - Retornar ResponseEntity<List<ChatMessageResponseDTO>>
    - _Requisitos: 13.2, 13.10_
  
  - [x] 6.4 Implementar endpoint POST /api/chat/messages
    - Criar método sendMessage(@Valid @RequestBody ChatMessageRequestDTO, Authentication)
    - Extrair userId do token JWT (Authentication)
    - Chamar SendChatMessageUseCase.execute(request, userId)
    - Retornar ResponseEntity<ChatMessageResponseDTO>
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 13.3_
  
  - [x] 6.5 Implementar endpoint GET /api/chat/rooms
    - Criar método getRooms()
    - Chamar GetChatRoomsUseCase.execute()
    - Retornar ResponseEntity<List<ChatRoomDTO>>
    - _Requisitos: 5.1, 5.2, 5.3_
  
  - [ ]*  6.6 Escrever testes unitários para ChatController
    - Testar todos os endpoints com MockMvc
    - Verificar status codes, estrutura de resposta
    - Testar casos de erro (404, 400)

- [x] 7. Backend - Configuração de Segurança
  - [x] 7.1 Configurar proteção de endpoints /api/chat/*
    - Modificar SecurityConfig para proteger rotas /api/chat/**
    - Garantir que apenas usuários autenticados acessem
    - _Requisitos: 4.1, 13.9_
  
  - [ ]*  7.2 Escrever teste de propriedade para proteção de endpoints
    - **Property 7: Proteção de Endpoints por Autenticação**
    - **Valida: Requisitos 4.1, 13.9**
    - Testar requisições sem token JWT, verificar erro 401/403

- [ ] 8. Checkpoint Backend - Validação de Integração
  - Executar todos os testes (unitários e de propriedades)
  - Testar endpoints manualmente com Postman/Insomnia
  - Verificar criação da tabela mensagem_chat no banco
  - Perguntar ao usuário se pode prosseguir para o frontend

- [x] 9. Frontend - Core (Models e Services)
  - [x] 9.1 Criar model ChatMessage
    - Criar interface em `core/models/chat-message.model.ts`
    - Definir interfaces: ChatMessage, ChatMessageState
    - _Requisitos: 2.2, 8.1, 8.2, 8.3_
  
  - [x] 9.2 Criar model ChatRoom
    - Criar interface em `core/models/chat-room.model.ts`
    - Definir interfaces: ChatRoom, ChatRoomState
    - _Requisitos: 5.3, 13.4_
  
  - [x] 9.3 Criar ChatService
    - Implementar service em `core/services/chat.service.ts`
    - Usar signals para estado: messageState, roomState
    - Implementar computed signals: messages, rooms, selectedRoom, isLoading
    - _Requisitos: Gerenciamento de estado_
  
  - [x] 9.4 Implementar método carregarRooms() no ChatService
    - Fazer GET /api/chat/rooms
    - Atualizar roomState signal
    - Selecionar Chat Geral por padrão
    - Carregar mensagens do primeiro chat
    - _Requisitos: 5.1, 5.2, 13.4, 13.5_
  
  - [x] 9.5 Implementar método selecionarRoom() no ChatService
    - Atualizar selectedRoom signal
    - Chamar carregarMensagens() para o chat selecionado
    - _Requisitos: 5.4_
  
  - [x] 9.6 Implementar método carregarMensagens() no ChatService
    - Fazer GET /api/chat/messages/general ou GET /api/chat/messages?lectureId={id}
    - Atualizar messageState signal
    - Parsear timestamps para Date
    - _Requisitos: 2.1, 2.2, 13.2_
  
  - [x] 9.7 Implementar método enviarMensagem() no ChatService
    - Fazer POST /api/chat/messages com {lectureId, content}
    - Adicionar nova mensagem ao messages signal
    - _Requisitos: 3.1, 9.3, 9.5_
  
  - [ ]*  9.8 Escrever testes unitários para ChatService
    - Mockar HttpClient
    - Testar todos os métodos e atualização de signals
    - Verificar tratamento de erros

- [x] 10. Frontend - Componente Principal (Discussões)
  - [x] 10.1 Criar DiscussoesComponent
    - Criar componente standalone em `features/discussoes/discussoes.component.ts`
    - Injetar ChatService
    - Criar signal currentUserId (obtido do AuthService)
    - Chamar chatService.carregarRooms() no constructor
    - _Requisitos: 4.2, 10.2_
  
  - [x] 10.2 Implementar template do DiscussoesComponent
    - Layout flex com sidebar e área principal
    - Incluir app-chat-sidebar, app-chat-messages, app-message-input
    - Passar inputs e outputs necessários
    - _Requisitos: Interface geral_
  
  - [x] 10.3 Implementar handlers de eventos no DiscussoesComponent
    - onRoomSelected(): chamar chatService.selecionarRoom()
    - onMessageSent(): chamar chatService.enviarMensagem()
    - _Requisitos: 5.4, 9.3_

- [x] 11. Frontend - Componente Sidebar
  - [x] 11.1 Criar ChatSidebarComponent
    - Criar componente standalone em `features/discussoes/chat-sidebar/chat-sidebar.component.ts`
    - Definir inputs: rooms, selectedRoom, isLoading
    - Definir output: roomSelected
    - Criar signals: searchTerm, statusFilter
    - _Requisitos: 5.1, 5.3, 6.1, 7.1_
  
  - [x] 11.2 Implementar computed signal filteredRooms
    - Aplicar filtro de pesquisa (case-insensitive)
    - Aplicar filtro de status (Já ocorreram, Não ocorreram, Todos)
    - Manter Chat Geral sempre visível
    - _Requisitos: 6.2, 6.3, 7.2, 7.3, 7.5, 13.6_
  
  - [ ]*  11.3 Escrever teste de propriedade para filtro case-insensitive
    - **Property 11: Filtro de Pesquisa Case-Insensitive**
    - **Valida: Requisitos 6.2, 6.3**
    - Gerar termos de pesquisa com diferentes casos, verificar mesmos resultados
  
  - [ ]*  11.4 Escrever teste de propriedade para composição de filtros
    - **Property 13: Composição de Filtros**
    - **Valida: Requisito 7.5**
    - Testar que pesquisa + status retorna interseção correta
  
  - [x] 11.5 Implementar template do ChatSidebarComponent
    - Header com título "Discussões"
    - Campo de pesquisa com placeholder "Pesquisar por nome"
    - Botões de filtro de status
    - Lista de chats com destaque para selecionado
    - _Requisitos: 5.1, 5.3, 6.1, 7.1_
  
  - [ ]*  11.6 Escrever testes unitários para ChatSidebarComponent
    - Testar renderização de lista de chats
    - Testar emissão de evento roomSelected
    - Testar aplicação de filtros

- [x] 12. Frontend - Componente de Mensagens
  - [x] 12.1 Criar ChatMessagesComponent
    - Criar componente standalone em `features/discussoes/chat-messages/chat-messages.component.ts`
    - Definir inputs: messages, isLoading, currentUserId
    - Implementar effect para auto-scroll ao adicionar mensagens
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 12.2 Implementar template do ChatMessagesComponent
    - Container com padding e scroll vertical
    - Renderizar mensagens com distinção visual (próprias à direita, outras à esquerda)
    - Exibir username para mensagens de outros usuários
    - Exibir timestamp formatado (HH:mm)
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5, 13.8_
  
  - [ ]*  12.3 Escrever teste de propriedade para distinção visual
    - **Property 14: Distinção Visual de Mensagens Próprias vs Outros**
    - **Valida: Requisitos 8.1, 8.2, 8.3, 13.8**
    - Verificar classes CSS corretas baseadas em userId
  
  - [ ]*  12.4 Escrever testes unitários para ChatMessagesComponent
    - Testar renderização de mensagens
    - Testar exibição de username e timestamp
    - Testar auto-scroll

- [x] 13. Frontend - Componente de Input de Mensagem
  - [x] 13.1 Criar MessageInputComponent
    - Criar componente standalone em `features/discussoes/message-input/message-input.component.ts`
    - Definir output: messageSent
    - Criar signal: messageContent
    - _Requisitos: 9.1, 9.2_
  
  - [x] 13.2 Implementar método enviar() no MessageInputComponent
    - Validar que conteúdo não está vazio (trim)
    - Emitir evento messageSent com conteúdo
    - Limpar campo de entrada (messageContent.set(''))
    - _Requisitos: 9.3, 9.4, 9.5_
  
  - [x] 13.3 Implementar template do MessageInputComponent
    - Input de texto com placeholder "Digite sua mensagem..."
    - Botão "Enviar" desabilitado se conteúdo vazio
    - Suporte para Enter key para enviar
    - _Requisitos: 9.1, 9.2_
  
  - [ ]*  13.4 Escrever teste de propriedade para limpeza de campo
    - **Property 18: Limpeza de Campo após Envio**
    - **Valida: Requisito 9.4**
    - Verificar que messageContent é limpo após envio bem-sucedido
  
  - [ ]*  13.5 Escrever testes unitários para MessageInputComponent
    - Testar emissão de evento messageSent
    - Testar limpeza de campo
    - Testar desabilitação de botão

- [x] 14. Frontend - Routing e Navegação
  - [x] 14.1 Criar discussoes.routes.ts
    - Criar arquivo de rotas em `features/discussoes/discussoes.routes.ts`
    - Configurar rota '' com loadComponent para DiscussoesComponent
    - Adicionar authGuard para proteger rota
    - _Requisitos: 4.2, 10.1_
  
  - [x] 14.2 Integrar rotas no app.routes.ts
    - Adicionar rota 'discussoes' com loadChildren
    - _Requisitos: 10.2_
  
  - [x] 14.3 Modificar HeaderComponent
    - Adicionar aba "Discussões" ao array de navegação
    - Configurar requiresAuth: true para a aba
    - Adicionar condição no template para exibir apenas se autenticado
    - _Requisitos: 4.2, 10.1, 10.3_
  
  - [x] 14.4 Modificar LectureCardComponent
    - Adicionar botão "Acessar Chat da Palestra" no template
    - Configurar routerLink para '/discussoes' com queryParams {lectureId}
    - Adicionar condição para exibir apenas se autenticado
    - _Requisitos: 4.3, 11.1, 11.2, 11.3_
  
  - [x] 14.5 Implementar leitura de queryParams no DiscussoesComponent
    - Injetar ActivatedRoute
    - Ler queryParam 'lectureId' após carregar rooms
    - Selecionar chat correspondente se lectureId presente
    - _Requisitos: 11.2_
  
  - [ ]*  14.6 Escrever testes E2E para navegação
    - Testar navegação via header
    - Testar navegação via card de palestra
    - Verificar proteção por authGuard

- [x] 15. Frontend - Acessibilidade e Responsividade
  - [x] 15.1 Adicionar ARIA labels aos componentes
    - Sidebar: role="navigation", aria-label="Lista de chats"
    - Mensagens: role="log", aria-live="polite"
    - Botões: aria-label descritivos
    - _Requisitos: Acessibilidade_
  
  - [x] 15.2 Implementar navegação por teclado
    - Tab navigation entre chats na sidebar
    - Enter para enviar mensagem
    - Escape para limpar campo de pesquisa
    - _Requisitos: Acessibilidade_
  
  - [x] 15.3 Verificar contraste de cores (WCAG 2.1 AA)
    - Validar contraste de mensagens próprias (teal-600 + branco)
    - Validar contraste de mensagens de outros (slate-800 + branco)
    - _Requisitos: Acessibilidade_
  
  - [ ]*  15.4 Testar responsividade em diferentes tamanhos de tela
    - Testar layout em mobile, tablet, desktop
    - Verificar que sidebar e mensagens se adaptam

- [x] 16. Checkpoint Final - Validação Completa
  - Executar todos os testes (backend e frontend)
  - Testar fluxo completo end-to-end manualmente
  - Verificar propriedades de corretude
  - Validar acessibilidade e responsividade
  - Perguntar ao usuário se tudo está funcionando conforme esperado

## Notas

- Tarefas marcadas com `*` são opcionais (testes) e podem ser puladas para MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedades validam propriedades universais de corretude
- Testes unitários validam exemplos específicos e casos extremos
- Seguir Conventional Commits: `feat(chat): descrição da tarefa`
- Realizar commit após validação bem-sucedida de cada tarefa

- [x] 17. Backend - Migration V3 (Respostas e Avaliações)
  - [x] 17.1 Criar migration Flyway V3 para suporte a respostas e avaliações
    - Adicionar coluna `mensagem_pai_id` (nullable, FK auto-relacionamento) na tabela `mensagem_chat`
    - Criar tabela `mensagem_avaliacao` com campos: id, usuario_id, mensagem_id, tipo (LIKE/DISLIKE), timestamp
    - Adicionar constraint UNIQUE em (usuario_id, mensagem_id) na tabela `mensagem_avaliacao`
    - Configurar CASCADE DELETE para avaliações quando mensagem for excluída
    - Criar índice em `mensagem_id` na tabela `mensagem_avaliacao`
    - _Requisitos: 14.1, 14.4, 14.5, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 18. Backend - Domínio: Entidades e Repositórios para Respostas e Avaliações
  - [x] 18.1 Atualizar entidade de domínio ChatMessage
    - Adicionar campo `mensagemPaiId` (nullable Long) à classe ChatMessage
    - _Requisitos: 16.1_

  - [x] 18.2 Atualizar ChatMessageEntity (JPA)
    - Mapear coluna `mensagem_pai_id` com `@ManyToOne(fetch = FetchType.LAZY)` auto-referenciando a própria entidade
    - _Requisitos: 16.2_

  - [x] 18.3 Atualizar ChatMessageRepository e implementação
    - Adicionar método `findByMensagemPaiIdOrderByTimestampAsc(Long mensagemPaiId)` na interface de domínio
    - Implementar o método no `ChatMessageRepositoryImpl` delegando para o JPA repository
    - _Requisitos: 16.3_

  - [x] 18.4 Criar enum TipoAvaliacao
    - Criar enum em `domain/enums/TipoAvaliacao.java` com valores LIKE e DISLIKE
    - _Requisitos: 17.4_

  - [x] 18.5 Criar entidade de domínio MensagemAvaliacao
    - Criar classe em `domain/entities/MensagemAvaliacao.java` com campos: id, usuarioId, mensagemId, tipo (TipoAvaliacao), timestamp
    - _Requisitos: 17.1_

  - [x] 18.6 Criar interface MensagemAvaliacaoRepository
    - Criar interface em `domain/repositories/MensagemAvaliacaoRepository.java`
    - Definir métodos: `save()`, `findByMensagemIdAndUsuarioId()`, `deleteByMensagemIdAndUsuarioId()`, `countByMensagemIdAndTipo()`
    - _Requisitos: 17.3_

- [x] 19. Backend - Infraestrutura: Persistência de Avaliações
  - [x] 19.1 Criar MensagemAvaliacaoEntity (JPA)
    - Criar entidade JPA em `infrastructure/persistence/entities/MensagemAvaliacaoEntity.java` mapeada para `mensagem_avaliacao`
    - Configurar relacionamentos lazy com UserEntity e ChatMessageEntity
    - _Requisitos: 17.2_

  - [x] 19.2 Criar MensagemAvaliacaoJpaRepository
    - Criar interface em `infrastructure/persistence/repositories/MensagemAvaliacaoJpaRepository.java`
    - Estender JpaRepository<MensagemAvaliacaoEntity, Long>
    - Adicionar query methods para busca por mensagem+usuário e contagem por tipo
    - _Requisitos: 17.3_

  - [x] 19.3 Criar MensagemAvaliacaoMapper
    - Criar mapper em `infrastructure/persistence/mappers/MensagemAvaliacaoMapper.java` com métodos estáticos toDomain() e toEntity()
    - _Requisitos: 17.2_

  - [x] 19.4 Implementar MensagemAvaliacaoRepositoryImpl
    - Criar classe em `infrastructure/persistence/repositories/MensagemAvaliacaoRepositoryImpl.java`
    - Implementar interface MensagemAvaliacaoRepository do domínio
    - Implementar `deleteByMensagemIdAndUsuarioId` via query JPQL ou método derivado
    - _Requisitos: 17.3, 17.5_

- [x] 20. Backend - Aplicação: DTOs e Use Cases Atualizados
  - [x] 20.1 Atualizar ChatMessageResponseDTO
    - Adicionar campos ao record: `likeCount` (Long), `dislikeCount` (Long), `usuarioJaAvaliou` (Boolean), `tipoAvaliacaoUsuario` (String nullable), `respostas` (List<ChatMessageResponseDTO>)
    - _Requisitos: 18.1_

  - [x] 20.2 Atualizar GetChatMessagesUseCase
    - Refatorar para retornar apenas Mensagens_Pai no nível raiz (mensagemPaiId == null)
    - Popular campo `respostas` de cada mensagem com as Respostas_Aninhadas correspondentes
    - Calcular `likeCount`, `dislikeCount`, `usuarioJaAvaliou` e `tipoAvaliacaoUsuario` para cada mensagem e resposta
    - Receber `Long authenticatedUserId` como parâmetro para preencher dados de avaliação do usuário
    - _Requisitos: 18.2, 18.3, 18.4_

  - [x] 20.3 Criar AvaliarMensagemRequestDTO
    - Criar record em `application/dtos/AvaliarMensagemRequestDTO.java` com campo `tipo` (String com @NotNull)
    - _Requisitos: 19.1_

  - [x] 20.4 Criar AvaliarMensagemUseCase
    - Criar classe em `application/usecases/chat/AvaliarMensagemUseCase.java`
    - Implementar lógica de toggle: mesmo tipo = remove avaliação; tipo diferente = substitui
    - Retornar ChatMessageResponseDTO atualizado com novos contadores
    - _Requisitos: 19.2, 19.3, 19.4_

  - [ ]* 20.5 Escrever teste de propriedade para lógica de toggle de avaliação
    - **Property: Toggle de Avaliação (mesmo tipo remove, tipo diferente substitui)**
    - **Valida: Requisitos 19.3, 19.4**

  - [x] 20.6 Criar ResponderMensagemRequestDTO
    - Criar record em `application/dtos/ResponderMensagemRequestDTO.java` com campo `content` (@NotBlank)
    - _Requisitos: 20.1_

  - [x] 20.7 Criar ResponderMensagemUseCase
    - Criar classe em `application/usecases/chat/ResponderMensagemUseCase.java`
    - Validar que a Mensagem_Pai existe e que ela própria não é uma Resposta_Aninhada (mensagemPaiId == null)
    - Persistir a resposta com mensagemPaiId preenchido e retornar ChatMessageResponseDTO
    - _Requisitos: 20.2, 20.3, 20.4, 20.5_

  - [ ]* 20.8 Escrever teste de propriedade para validação de profundidade de aninhamento
    - **Property: Resposta_Aninhada não pode ser pai de outra resposta**
    - **Valida: Requisito 20.5**

- [x] 21. Backend - Web: Novos Endpoints no ChatController
  - [x] 21.1 Atualizar endpoints GET de mensagens no ChatController
    - Passar `authenticatedUserId` para `GetChatMessagesUseCase.execute()` e `executeForGeneralChat()`
    - _Requisitos: 18.2_

  - [x] 21.2 Adicionar endpoint POST /api/chat/messages/{mensagemId}/avaliar
    - Criar método `avaliarMensagem(@PathVariable Long mensagemId, @Valid @RequestBody AvaliarMensagemRequestDTO, Authentication)`
    - Chamar AvaliarMensagemUseCase e retornar ResponseEntity<ChatMessageResponseDTO>
    - _Requisitos: 19.1, 19.5, 19.6_

  - [x] 21.3 Adicionar endpoint POST /api/chat/messages/{mensagemPaiId}/responder
    - Criar método `responderMensagem(@PathVariable Long mensagemPaiId, @Valid @RequestBody ResponderMensagemRequestDTO, Authentication)`
    - Chamar ResponderMensagemUseCase e retornar ResponseEntity<ChatMessageResponseDTO>
    - _Requisitos: 20.1, 20.4_

- [ ] 22. Checkpoint Backend - Validação dos Novos Endpoints
  - Executar todos os testes do backend
  - Verificar migration V3 aplicada corretamente no banco
  - Testar endpoints de avaliação e resposta com Postman/Insomnia
  - Perguntar ao usuário se pode prosseguir para o frontend

- [x] 23. Frontend - Bugfix: Navegação do LectureCardComponent
  - [x] 23.1 Corrigir LectureCardComponent para navegar com ID correto
    - Garantir que o routerLink ou navegação programática use o ID da palestra do card atual
    - Navegar para `/discussoes?lectureId={id}` com o ID correto (não hardcoded)
    - _Requisitos: 21.1, 21.2_

- [x] 24. Frontend - Botão Voltar no DiscussoesComponent
  - [x] 24.1 Adicionar botão "Voltar" ao DiscussoesComponent
    - Injetar `Location` do `@angular/common`
    - Adicionar botão no template com `(click)="location.back()"` e `aria-label="Voltar para a página anterior"`
    - _Requisitos: 22.1, 22.2, 22.3_

- [x] 25. Frontend - Atualizar Models e ChatService
  - [x] 25.1 Atualizar interface ChatMessage
    - Adicionar campos: `likeCount`, `dislikeCount`, `usuarioJaAvaliou`, `tipoAvaliacaoUsuario` (string | null), `respostas` (ChatMessage[])
    - _Requisitos: 24.1_

  - [x] 25.2 Adicionar método avaliarMensagem() no ChatService
    - Implementar `avaliarMensagem(mensagemId: number, tipo: 'LIKE' | 'DISLIKE'): void`
    - Fazer POST `/api/chat/messages/{mensagemId}/avaliar` com `{ tipo }`
    - Atualizar a mensagem correspondente no signal `messages` com os contadores retornados
    - _Requisitos: 24.2, 24.3_

  - [x] 25.3 Adicionar método responderMensagem() no ChatService
    - Implementar `responderMensagem(mensagemPaiId: number, content: string): void`
    - Fazer POST `/api/chat/messages/{mensagemPaiId}/responder` com `{ content }`
    - Adicionar a resposta retornada ao array `respostas` da mensagem pai no signal
    - _Requisitos: 24.6_

- [x] 26. Frontend - Avatares e Ações nas Mensagens (ChatMessagesComponent)
  - [x] 26.1 Adicionar Avatar_Usuario ao ChatMessagesComponent
    - Renderizar elemento circular com a primeira letra do `username` em maiúsculo
    - Aplicar cor diferenciada para mensagens do usuário atual vs outros (ex: teal para próprias, slate para outros)
    - _Requisitos: 23.1, 23.2, 23.3, 23.4_

  - [x] 26.2 Adicionar botões Like, Dislike e Responder às mensagens
    - Exibir botão Like com contador `likeCount`, Dislike com `dislikeCount` e botão "Responder"
    - Destacar visualmente o botão do tipo de avaliação já registrado pelo usuário (`tipoAvaliacaoUsuario`)
    - Ao clicar em Like/Dislike, chamar output ou método que invoca `chatService.avaliarMensagem()`
    - _Requisitos: 24.1, 24.2, 24.3, 24.4_

  - [x] 26.3 Implementar campo de resposta inline
    - Ao clicar em "Responder", exibir campo de texto contextualizado abaixo da mensagem
    - Ao confirmar envio, chamar `chatService.responderMensagem()` e ocultar o campo
    - _Requisitos: 24.5, 24.6_

  - [ ]* 26.4 Escrever teste de propriedade para distinção visual de avatares
    - **Property: Avatar com cor diferenciada para mensagens próprias vs outros**
    - **Valida: Requisitos 23.3**

- [x] 27. Frontend - Comentários Aninhados no ChatMessagesComponent
  - [x] 27.1 Renderizar Respostas_Aninhadas abaixo de cada Mensagem_Pai
    - Iterar sobre `message.respostas` e renderizar cada resposta com recuo visual (ex: `ml-8`)
    - Exibir Avatar_Usuario, nome do remetente, conteúdo, timestamp e botões Like/Dislike em cada resposta
    - Ordenar respostas por timestamp crescente (já garantido pelo backend)
    - Não exibir área de respostas quando `respostas` estiver vazio
    - _Requisitos: 25.1, 25.2, 25.3, 25.4, 25.5_

  - [ ]* 27.2 Escrever teste de propriedade para renderização de respostas aninhadas
    - **Property: Respostas_Aninhadas renderizadas com recuo e ordenadas por timestamp**
    - **Valida: Requisitos 25.2, 25.5**

- [x] 28. Checkpoint Final - Validação Completa
  - Executar todos os testes (backend e frontend)
  - Testar fluxo completo: enviar mensagem, responder, like/dislike, navegar via card
  - Verificar bugfix de navegação do LectureCardComponent
  - Verificar botão Voltar, avatares e comentários aninhados
  - Perguntar ao usuário se tudo está funcionando conforme esperado
