# Documento de Requisitos - Sistema de Chat/Fórum de Palestras

## Introdução

Este documento especifica os requisitos para um sistema de chat/fórum vinculado a palestras existentes. O sistema permitirá que usuários autenticados participem de discussões específicas de cada palestra, visualizem histórico de mensagens e naveguem entre diferentes chats de palestras através de uma interface intuitiva.

## Glossário

- **Sistema_Chat**: O sistema completo de chat/fórum vinculado a palestras
- **Palestra**: Entidade existente no sistema que representa um evento/apresentação
- **Mensagem_Chat**: Registro de uma mensagem enviada por um usuário em um chat de palestra
- **Usuário_Autenticado**: Usuário que realizou login no sistema com credenciais válidas
- **Chat_Palestra**: Espaço de discussão específico vinculado a uma palestra
- **Chat_Geral**: Espaço de discussão não vinculado a nenhuma palestra específica, acessível a todos os usuários autenticados
- **Sidebar**: Área lateral esquerda da interface que lista os chats disponíveis
- **Área_Mensagens**: Área principal da interface onde as mensagens são exibidas
- **Timestamp**: Registro de data e hora de criação de uma mensagem
- **Remetente**: Usuário que enviou uma mensagem específica
- **Mensagem_Pai**: Mensagem_Chat de nível raiz à qual uma ou mais respostas estão vinculadas; identificada pelo campo `mensagem_pai_id` NULL
- **Resposta_Aninhada**: Mensagem_Chat vinculada a uma Mensagem_Pai, exibida com recuo visual abaixo da mensagem original
- **Avaliacao_Mensagem**: Registro de interação de um Usuário_Autenticado com uma Mensagem_Chat, podendo ser Like ou Dislike; cada usuário pode ter no máximo uma avaliação por mensagem
- **Like**: Tipo de Avaliacao_Mensagem que representa aprovação ou concordância com o conteúdo de uma mensagem
- **Dislike**: Tipo de Avaliacao_Mensagem que representa desaprovação ou discordância com o conteúdo de uma mensagem
- **Avatar_Usuario**: Elemento visual circular exibido ao lado de cada mensagem, contendo a primeira letra do nome do Remetente

## Requisitos

### Requisito 1: Modelagem de Dados - Entidade Mensagem

**User Story:** Como desenvolvedor, eu quero uma estrutura de dados para mensagens de chat, para que o sistema possa armazenar e recuperar discussões de palestras.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL criar uma tabela MensagemChat com os campos: ID da mensagem, ID da palestra vinculada, ID do usuário remetente, conteúdo da mensagem e timestamp
2. WHEN uma Mensagem_Chat é criada, THE Sistema_Chat SHALL registrar automaticamente o timestamp de criação
3. THE Sistema_Chat SHALL garantir que cada Mensagem_Chat possua referência válida para uma Palestra existente
4. THE Sistema_Chat SHALL garantir que cada Mensagem_Chat possua referência válida para um Usuário_Autenticado existente
5. THE Sistema_Chat SHALL permitir que uma Palestra tenha zero ou mais Mensagens_Chat associadas (relação 1:N)

### Requisito 2: Recuperação de Mensagens por Palestra

**User Story:** Como usuário autenticado, eu quero visualizar todas as mensagens de uma palestra específica, para que eu possa acompanhar as discussões relacionadas.

#### Acceptance Criteria

1. WHEN um Usuário_Autenticado solicita mensagens de uma Palestra, THE Sistema_Chat SHALL retornar todas as Mensagens_Chat vinculadas ordenadas por timestamp crescente
2. THE Sistema_Chat SHALL incluir nas mensagens retornadas: conteúdo, timestamp, e identificação do Remetente
3. IF a Palestra solicitada não existir, THEN THE Sistema_Chat SHALL retornar um erro descritivo seguindo o padrão RFC 7807
4. WHEN uma Palestra não possui mensagens, THE Sistema_Chat SHALL retornar uma lista vazia

### Requisito 3: Envio de Novas Mensagens

**User Story:** Como usuário autenticado, eu quero enviar mensagens em um chat de palestra, para que eu possa participar das discussões.

#### Acceptance Criteria

1. WHEN um Usuário_Autenticado envia uma mensagem para um Chat_Palestra, THE Sistema_Chat SHALL persistir a Mensagem_Chat com o ID do usuário, ID da palestra, conteúdo e timestamp
2. THE Sistema_Chat SHALL validar que o conteúdo da mensagem não está vazio antes de persistir
3. THE Sistema_Chat SHALL validar que a Palestra de destino existe antes de persistir a mensagem
4. IF o conteúdo da mensagem estiver vazio, THEN THE Sistema_Chat SHALL retornar um erro de validação
5. IF a Palestra não existir, THEN THE Sistema_Chat SHALL retornar um erro descritivo

### Requisito 4: Controle de Acesso - Autenticação Obrigatória

**User Story:** Como administrador do sistema, eu quero que apenas usuários autenticados acessem os chats, para que o sistema mantenha a segurança e rastreabilidade das discussões.

#### Acceptance Criteria

1. WHEN um usuário não autenticado tenta acessar funcionalidades de chat, THE Sistema_Chat SHALL bloquear o acesso e retornar erro de autenticação
2. THE Sistema_Chat SHALL exibir a aba "Discussões" no header somente para Usuários_Autenticados
3. THE Sistema_Chat SHALL exibir o botão "Acessar Chat da Palestra" nos cards de palestra somente para Usuários_Autenticados
4. WHEN um Usuário_Autenticado acessa a interface de chat, THE Sistema_Chat SHALL permitir visualização e envio de mensagens

### Requisito 5: Interface - Listagem de Chats na Sidebar

**User Story:** Como usuário autenticado, eu quero visualizar uma lista de todos os chats de palestras disponíveis, para que eu possa navegar entre diferentes discussões.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL exibir na Sidebar uma lista de todos os Chats_Palestra disponíveis
2. WHEN um Usuário_Autenticado acessa a página de discussões, THE Sistema_Chat SHALL carregar e exibir os chats na Sidebar
3. THE Sistema_Chat SHALL exibir para cada Chat_Palestra na lista: o nome da palestra associada
4. WHEN um Usuário_Autenticado seleciona um chat na Sidebar, THE Sistema_Chat SHALL carregar as mensagens correspondentes na Área_Mensagens

### Requisito 6: Interface - Pesquisa de Chats

**User Story:** Como usuário autenticado, eu quero pesquisar chats por nome de palestra, para que eu possa encontrar rapidamente discussões específicas.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL fornecer um campo de pesquisa na Sidebar com placeholder "Pesquisar por nome"
2. WHEN um Usuário_Autenticado digita no campo de pesquisa, THE Sistema_Chat SHALL filtrar a lista de chats exibindo apenas aqueles cujo nome da palestra contenha o texto digitado
3. THE Sistema_Chat SHALL realizar a filtragem de forma case-insensitive
4. WHEN o campo de pesquisa está vazio, THE Sistema_Chat SHALL exibir todos os chats disponíveis

### Requisito 7: Interface - Filtro por Status de Palestra

**User Story:** Como usuário autenticado, eu quero filtrar chats por status da palestra (já ocorreram, não ocorreram, todos), para que eu possa focar em discussões relevantes ao momento atual.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL fornecer na Sidebar um filtro com três opções: "Já ocorreram", "Não ocorreram" e "Todos"
2. WHEN o filtro "Já ocorreram" está selecionado, THE Sistema_Chat SHALL exibir apenas chats de palestras cuja data já passou
3. WHEN o filtro "Não ocorreram" está selecionado, THE Sistema_Chat SHALL exibir apenas chats de palestras cuja data ainda não passou
4. WHEN o filtro "Todos" está selecionado, THE Sistema_Chat SHALL exibir todos os chats independente do status da palestra
5. THE Sistema_Chat SHALL aplicar o filtro de status em conjunto com a pesquisa por nome quando ambos estiverem ativos

### Requisito 8: Interface - Exibição de Mensagens com Distinção Visual

**User Story:** Como usuário autenticado, eu quero visualizar mensagens com distinção clara entre minhas mensagens e as de outros usuários, para que eu possa acompanhar facilmente a conversa.

#### Acceptance Criteria

1. WHEN uma mensagem foi enviada pelo Usuário_Autenticado atual, THE Sistema_Chat SHALL exibir a mensagem alinhada à direita da Área_Mensagens com cor de destaque diferenciada
2. WHEN uma mensagem foi enviada por outro usuário, THE Sistema_Chat SHALL exibir a mensagem alinhada à esquerda da Área_Mensagens
3. WHEN uma mensagem de outro usuário é exibida, THE Sistema_Chat SHALL mostrar o nome do Remetente acima do conteúdo da mensagem
4. THE Sistema_Chat SHALL exibir o horário de envio (timestamp) para todas as mensagens
5. THE Sistema_Chat SHALL ordenar as mensagens cronologicamente do mais antigo para o mais recente na Área_Mensagens

### Requisito 9: Interface - Campo de Envio de Mensagem

**User Story:** Como usuário autenticado, eu quero um campo para digitar e enviar novas mensagens, para que eu possa participar ativamente das discussões.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL fornecer um campo de entrada de texto na parte inferior da Área_Mensagens
2. THE Sistema_Chat SHALL fornecer um botão de envio adjacente ao campo de entrada
3. WHEN um Usuário_Autenticado digita uma mensagem e clica no botão de envio, THE Sistema_Chat SHALL enviar a mensagem para o Chat_Palestra atualmente selecionado
4. WHEN uma mensagem é enviada com sucesso, THE Sistema_Chat SHALL limpar o campo de entrada
5. WHEN uma mensagem é enviada com sucesso, THE Sistema_Chat SHALL atualizar a Área_Mensagens exibindo a nova mensagem

### Requisito 10: Navegação - Acesso via Header

**User Story:** Como usuário autenticado, eu quero acessar a página de discussões através de uma aba no header, para que eu possa navegar facilmente para os chats.

#### Acceptance Criteria

1. WHERE o usuário está autenticado, THE Sistema_Chat SHALL exibir uma aba "Discussões" no header da aplicação
2. WHEN um Usuário_Autenticado clica na aba "Discussões", THE Sistema_Chat SHALL navegar para a página de discussões
3. WHILE o usuário não está autenticado, THE Sistema_Chat SHALL ocultar a aba "Discussões" do header

### Requisito 11: Navegação - Acesso via Card de Palestra

**User Story:** Como usuário autenticado, eu quero acessar o chat de uma palestra específica diretamente do card da palestra, para que eu possa rapidamente entrar na discussão relevante.

#### Acceptance Criteria

1. WHERE o usuário está autenticado, THE Sistema_Chat SHALL exibir um botão "Acessar Chat da Palestra" em cada card de palestra
2. WHEN um Usuário_Autenticado clica no botão "Acessar Chat da Palestra", THE Sistema_Chat SHALL navegar para a página de discussões com o chat correspondente já selecionado
3. WHILE o usuário não está autenticado, THE Sistema_Chat SHALL ocultar o botão "Acessar Chat da Palestra" dos cards de palestra

### Requisito 12: Persistência e Integridade de Dados

**User Story:** Como desenvolvedor, eu quero garantir a integridade referencial dos dados de chat, para que o sistema mantenha consistência mesmo com exclusões de entidades relacionadas.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL configurar a relação entre Mensagem_Chat e Palestra com integridade referencial
2. THE Sistema_Chat SHALL configurar a relação entre Mensagem_Chat e Usuário com integridade referencial
3. IF uma Palestra é excluída, THEN THE Sistema_Chat SHALL definir comportamento apropriado para as Mensagens_Chat associadas (cascade ou restrict)
4. THE Sistema_Chat SHALL garantir que não existam Mensagens_Chat órfãs (sem palestra ou usuário válido)

### Requisito 13: Chat Geral (Não Vinculado a Palestras)

**User Story:** Como usuário autenticado, eu quero acessar um chat geral não vinculado a palestras específicas, para que eu possa discutir assuntos diversos com outros usuários.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL permitir que o campo ID da palestra na tabela MensagemChat seja NULL para identificar mensagens do Chat_Geral
2. WHEN um Usuário_Autenticado solicita mensagens do Chat_Geral, THE Sistema_Chat SHALL retornar todas as Mensagens_Chat onde o ID da palestra é NULL, ordenadas por timestamp crescente
3. WHEN um Usuário_Autenticado envia uma mensagem para o Chat_Geral, THE Sistema_Chat SHALL persistir a Mensagem_Chat com ID da palestra NULL, ID do usuário, conteúdo e timestamp
4. THE Sistema_Chat SHALL exibir o Chat_Geral como primeira opção na Sidebar, sempre visível e destacado com o nome "Chat Geral"
5. THE Sistema_Chat SHALL selecionar o Chat_Geral por padrão quando um Usuário_Autenticado acessa a página de discussões pela primeira vez
6. WHILE os filtros de status de palestra ("Já ocorreram", "Não ocorreram") estão ativos, THE Sistema_Chat SHALL manter o Chat_Geral visível na Sidebar independente do filtro selecionado
7. WHEN um Usuário_Autenticado pesquisa por "Chat Geral" ou "Geral" no campo de pesquisa, THE Sistema_Chat SHALL incluir o Chat_Geral nos resultados
8. THE Sistema_Chat SHALL aplicar as mesmas regras de exibição de mensagens ao Chat_Geral (mensagens do usuário à direita, mensagens de outros à esquerda)
9. THE Sistema_Chat SHALL validar que apenas Usuários_Autenticados podem visualizar e enviar mensagens no Chat_Geral
10. THE Sistema_Chat SHALL criar endpoints específicos para buscar e enviar mensagens do Chat_Geral

### Requisito 14: Banco de Dados - Suporte a Respostas Aninhadas

**User Story:** Como desenvolvedor, eu quero adicionar suporte a auto-relacionamento na tabela de mensagens, para que o sistema possa armazenar respostas vinculadas a mensagens específicas.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL adicionar a coluna `mensagem_pai_id` (nullable, FK para a própria tabela mensagem_chat) via migration Flyway V3
2. WHEN `mensagem_pai_id` é NULL, THE Sistema_Chat SHALL tratar a Mensagem_Chat como uma Mensagem_Pai (mensagem raiz)
3. WHEN `mensagem_pai_id` possui valor, THE Sistema_Chat SHALL tratar a Mensagem_Chat como uma Resposta_Aninhada vinculada à Mensagem_Pai correspondente
4. THE Sistema_Chat SHALL garantir integridade referencial do auto-relacionamento, impedindo referências a mensagens inexistentes
5. THE Sistema_Chat SHALL permitir que uma Mensagem_Pai tenha zero ou mais Respostas_Aninhadas associadas (relação 1:N)

### Requisito 15: Banco de Dados - Tabela de Avaliações de Mensagens

**User Story:** Como desenvolvedor, eu quero uma tabela para registrar likes e dislikes de mensagens, para que o sistema possa armazenar e consultar avaliações de forma íntegra.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL criar a tabela `mensagem_avaliacao` via migration Flyway V3 com os campos: ID da avaliação, ID do usuário, ID da mensagem, tipo de interação (LIKE ou DISLIKE) e timestamp
2. THE Sistema_Chat SHALL garantir que a combinação de ID do usuário e ID da mensagem seja única na tabela `mensagem_avaliacao` (constraint UNIQUE)
3. THE Sistema_Chat SHALL configurar integridade referencial entre `mensagem_avaliacao` e a tabela de usuários
4. THE Sistema_Chat SHALL configurar integridade referencial entre `mensagem_avaliacao` e a tabela `mensagem_chat`
5. IF uma Mensagem_Chat é excluída, THEN THE Sistema_Chat SHALL excluir em cascata todas as Avaliacao_Mensagem associadas
6. THE Sistema_Chat SHALL criar índice na coluna `mensagem_id` da tabela `mensagem_avaliacao` para otimizar consultas de contagem

### Requisito 16: Backend - Entidade e Persistência de Respostas Aninhadas

**User Story:** Como desenvolvedor, eu quero atualizar a entidade de mensagem para suportar o relacionamento pai-filho, para que o sistema possa persistir e recuperar respostas aninhadas.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL atualizar a entidade de domínio ChatMessage para incluir o campo `mensagemPaiId` (nullable Long)
2. THE Sistema_Chat SHALL atualizar a entidade JPA ChatMessageEntity para mapear a coluna `mensagem_pai_id` com relacionamento `@ManyToOne` lazy para a própria entidade
3. THE Sistema_Chat SHALL atualizar a interface ChatMessageRepository para incluir o método `findByMensagemPaiIdOrderByTimestampAsc(Long mensagemPaiId)`
4. WHEN um Usuário_Autenticado envia uma Resposta_Aninhada, THE Sistema_Chat SHALL persistir a mensagem com o `mensagemPaiId` referenciando a Mensagem_Pai
5. IF o `mensagemPaiId` informado não corresponder a uma Mensagem_Chat existente, THEN THE Sistema_Chat SHALL retornar um erro descritivo seguindo o padrão RFC 7807

### Requisito 17: Backend - Entidade e Persistência de Avaliações

**User Story:** Como desenvolvedor, eu quero implementar a camada de persistência para avaliações de mensagens, para que likes e dislikes sejam armazenados com integridade.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL criar a entidade de domínio MensagemAvaliacao com os campos: id, usuarioId, mensagemId, tipo (LIKE ou DISLIKE) e timestamp
2. THE Sistema_Chat SHALL criar a entidade JPA MensagemAvaliacaoEntity mapeada para a tabela `mensagem_avaliacao`
3. THE Sistema_Chat SHALL criar a interface de domínio MensagemAvaliacaoRepository com os métodos: `save()`, `findByMensagemIdAndUsuarioId()`, `deleteByMensagemIdAndUsuarioId()`, `countByMensagemIdAndTipo()`
4. THE Sistema_Chat SHALL criar o enum TipoAvaliacao com os valores LIKE e DISLIKE
5. THE Sistema_Chat SHALL garantir que a implementação do repositório respeite a constraint de unicidade (um usuário, uma avaliação por mensagem)

### Requisito 18: Backend - DTOs Atualizados com Contagens e Respostas

**User Story:** Como desenvolvedor, eu quero atualizar os DTOs de resposta do chat para incluir dados de avaliações e respostas aninhadas, para que o frontend receba todas as informações necessárias em uma única chamada.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL atualizar o ChatMessageResponseDTO para incluir os campos: `likeCount` (Long), `dislikeCount` (Long), `usuarioJaAvaliou` (Boolean), `tipoAvaliacaoUsuario` (String nullable) e `respostas` (List<ChatMessageResponseDTO>)
2. WHEN o endpoint de busca de mensagens é chamado com um Usuário_Autenticado, THE Sistema_Chat SHALL preencher `usuarioJaAvaliou` e `tipoAvaliacaoUsuario` com base no histórico de avaliações do usuário autenticado
3. WHEN o endpoint de busca de mensagens é chamado, THE Sistema_Chat SHALL retornar apenas Mensagens_Pai no nível raiz, com as Respostas_Aninhadas populadas no campo `respostas` de cada mensagem
4. THE Sistema_Chat SHALL calcular `likeCount` e `dislikeCount` para cada mensagem retornada

### Requisito 19: Backend - Endpoint de Avaliação de Mensagens

**User Story:** Como usuário autenticado, eu quero registrar ou remover minha avaliação (like/dislike) em uma mensagem, para que eu possa expressar minha opinião sobre os comentários.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL criar o endpoint `POST /api/chat/messages/{mensagemId}/avaliar` que recebe o tipo de avaliação (LIKE ou DISLIKE)
2. WHEN um Usuário_Autenticado envia uma avaliação para uma mensagem sem avaliação prévia, THE Sistema_Chat SHALL registrar a Avaliacao_Mensagem e retornar os contadores atualizados
3. WHEN um Usuário_Autenticado envia o mesmo tipo de avaliação que já registrou anteriormente, THE Sistema_Chat SHALL remover a avaliação existente (toggle) e retornar os contadores atualizados
4. WHEN um Usuário_Autenticado envia um tipo de avaliação diferente do que já registrou, THE Sistema_Chat SHALL substituir a avaliação anterior pelo novo tipo e retornar os contadores atualizados
5. IF a Mensagem_Chat informada não existir, THEN THE Sistema_Chat SHALL retornar um erro descritivo seguindo o padrão RFC 7807
6. WHEN um usuário não autenticado tenta avaliar uma mensagem, THE Sistema_Chat SHALL bloquear o acesso e retornar erro de autenticação

### Requisito 20: Backend - Endpoint de Resposta a Mensagem

**User Story:** Como usuário autenticado, eu quero responder diretamente a uma mensagem específica, para que eu possa criar discussões encadeadas dentro de um chat.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL criar o endpoint `POST /api/chat/messages/{mensagemPaiId}/responder` que recebe o conteúdo da resposta
2. WHEN um Usuário_Autenticado envia uma resposta, THE Sistema_Chat SHALL persistir a Resposta_Aninhada com o `mensagemPaiId` correto e retornar o ChatMessageResponseDTO da nova resposta
3. THE Sistema_Chat SHALL validar que o conteúdo da resposta não está vazio antes de persistir
4. IF a Mensagem_Pai informada não existir, THEN THE Sistema_Chat SHALL retornar um erro descritivo seguindo o padrão RFC 7807
5. THE Sistema_Chat SHALL validar que a Mensagem_Pai não é ela própria uma Resposta_Aninhada, impedindo aninhamento de mais de um nível

### Requisito 21: Frontend - Bugfix na Navegação do Card de Palestra

**User Story:** Como usuário autenticado, eu quero que o botão "Acessar Chat da Palestra" no card de palestra me redirecione para o chat correto da palestra, para que eu não seja direcionado para o chat geral incorretamente.

#### Acceptance Criteria

1. WHEN um Usuário_Autenticado clica em "Acessar Chat da Palestra", THE Sistema_Chat SHALL navegar para `/discussoes?lectureId={id_da_palestra}` com o ID correto da palestra
2. THE Sistema_Chat SHALL garantir que o LectureCardComponent utilize o ID da palestra do card atual ao construir a rota de navegação
3. WHEN o DiscussoesComponent é carregado com o parâmetro `lectureId` na URL, THE Sistema_Chat SHALL selecionar automaticamente o chat correspondente à palestra informada
4. IF o `lectureId` informado na URL não corresponder a nenhum chat disponível, THEN THE Sistema_Chat SHALL selecionar o Chat_Geral como fallback

### Requisito 22: Frontend - Botão Voltar na Página de Discussões

**User Story:** Como usuário autenticado, eu quero um botão "Voltar" na página de discussões, para que eu possa retornar à página anterior sem precisar usar os controles do navegador.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL exibir um botão "Voltar" na área de cabeçalho da página de discussões
2. WHEN um Usuário_Autenticado clica no botão "Voltar", THE Sistema_Chat SHALL navegar para a página anterior no histórico do navegador
3. THE Sistema_Chat SHALL posicionar o botão "Voltar" de forma visível e acessível, com aria-label descritivo

### Requisito 23: Frontend - Avatar do Usuário nas Mensagens

**User Story:** Como usuário autenticado, eu quero ver um avatar com a inicial do nome do remetente em cada mensagem, para que eu possa identificar visualmente quem enviou cada comentário.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL exibir um Avatar_Usuario circular ao lado de cada Mensagem_Chat e Resposta_Aninhada na Área_Mensagens
2. THE Sistema_Chat SHALL renderizar no Avatar_Usuario a primeira letra do nome do Remetente em maiúsculo
3. WHEN a mensagem foi enviada pelo Usuário_Autenticado atual, THE Sistema_Chat SHALL exibir o Avatar_Usuario com cor de destaque diferenciada das mensagens de outros usuários
4. THE Sistema_Chat SHALL garantir contraste adequado entre a letra do Avatar_Usuario e o fundo do avatar para legibilidade

### Requisito 24: Frontend - Ações de Like, Dislike e Responder nas Mensagens

**User Story:** Como usuário autenticado, eu quero botões de like, dislike e responder abaixo de cada mensagem, para que eu possa interagir com os comentários diretamente na interface.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL exibir abaixo de cada Mensagem_Chat os botões: Like (com contador), Dislike (com contador) e "Responder"
2. WHEN um Usuário_Autenticado clica no botão Like, THE Sistema_Chat SHALL chamar o endpoint de avaliação e atualizar o contador de likes exibido
3. WHEN um Usuário_Autenticado clica no botão Dislike, THE Sistema_Chat SHALL chamar o endpoint de avaliação e atualizar o contador de dislikes exibido
4. WHEN o Usuário_Autenticado já avaliou uma mensagem, THE Sistema_Chat SHALL destacar visualmente o botão correspondente ao tipo de avaliação registrado
5. WHEN um Usuário_Autenticado clica em "Responder", THE Sistema_Chat SHALL exibir um campo de entrada de texto contextualizado abaixo da mensagem para digitação da resposta
6. WHEN um Usuário_Autenticado confirma o envio da resposta, THE Sistema_Chat SHALL chamar o endpoint de resposta e exibir a Resposta_Aninhada na interface sem recarregar a página

### Requisito 25: Frontend - Exibição de Comentários Aninhados

**User Story:** Como usuário autenticado, eu quero visualizar as respostas a uma mensagem com recuo visual abaixo da mensagem original, para que eu possa acompanhar o encadeamento das discussões.

#### Acceptance Criteria

1. THE Sistema_Chat SHALL renderizar as Respostas_Aninhadas diretamente abaixo da Mensagem_Pai correspondente na Área_Mensagens
2. THE Sistema_Chat SHALL aplicar recuo visual à esquerda (indentação) nas Respostas_Aninhadas para diferenciá-las visualmente das Mensagens_Pai
3. THE Sistema_Chat SHALL exibir Avatar_Usuario, nome do Remetente, conteúdo, timestamp e botões de Like e Dislike em cada Resposta_Aninhada
4. WHEN uma Mensagem_Pai não possui Respostas_Aninhadas, THE Sistema_Chat SHALL exibir apenas a mensagem raiz sem área de respostas
5. THE Sistema_Chat SHALL exibir as Respostas_Aninhadas ordenadas por timestamp crescente abaixo de cada Mensagem_Pai
