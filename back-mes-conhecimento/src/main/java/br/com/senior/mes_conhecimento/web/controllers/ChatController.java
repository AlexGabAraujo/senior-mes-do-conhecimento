package br.com.senior.mes_conhecimento.web.controllers;

import br.com.senior.mes_conhecimento.application.dtos.AvaliarMensagemRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.ChatMessageRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.ChatMessageResponseDTO;
import br.com.senior.mes_conhecimento.application.dtos.ChatRoomDTO;
import br.com.senior.mes_conhecimento.application.dtos.ResponderMensagemRequestDTO;
import br.com.senior.mes_conhecimento.application.usecases.chat.AvaliarMensagemUseCase;
import br.com.senior.mes_conhecimento.application.usecases.chat.GetChatMessagesUseCase;
import br.com.senior.mes_conhecimento.application.usecases.chat.GetChatRoomsUseCase;
import br.com.senior.mes_conhecimento.application.usecases.chat.ResponderMensagemUseCase;
import br.com.senior.mes_conhecimento.application.usecases.chat.SendChatMessageUseCase;
import br.com.senior.mes_conhecimento.domain.entities.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para operações de chat.
 * Todos os endpoints requerem autenticação.
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GetChatMessagesUseCase getChatMessagesUseCase;
    private final SendChatMessageUseCase sendChatMessageUseCase;
    private final GetChatRoomsUseCase getChatRoomsUseCase;
    private final AvaliarMensagemUseCase avaliarMensagemUseCase;
    private final ResponderMensagemUseCase responderMensagemUseCase;

    public ChatController(GetChatMessagesUseCase getChatMessagesUseCase,
                          SendChatMessageUseCase sendChatMessageUseCase,
                          GetChatRoomsUseCase getChatRoomsUseCase,
                          AvaliarMensagemUseCase avaliarMensagemUseCase,
                          ResponderMensagemUseCase responderMensagemUseCase) {
        this.getChatMessagesUseCase = getChatMessagesUseCase;
        this.sendChatMessageUseCase = sendChatMessageUseCase;
        this.getChatRoomsUseCase = getChatRoomsUseCase;
        this.avaliarMensagemUseCase = avaliarMensagemUseCase;
        this.responderMensagemUseCase = responderMensagemUseCase;
    }

    /**
     * GET /api/chat/messages?lectureId={id}
     * Busca mensagens de uma palestra específica
     */
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageResponseDTO>> getMessages(
            @RequestParam Long lectureId,
            Authentication authentication) {
        Long userId = extractUserIdFromAuth(authentication);
        List<ChatMessageResponseDTO> messages = getChatMessagesUseCase.execute(lectureId, userId);
        return ResponseEntity.ok(messages);
    }

    /**
     * GET /api/chat/messages/general
     * Busca mensagens do Chat Geral
     */
    @GetMapping("/messages/general")
    public ResponseEntity<List<ChatMessageResponseDTO>> getGeneralMessages(
            Authentication authentication) {
        Long userId = extractUserIdFromAuth(authentication);
        List<ChatMessageResponseDTO> messages = getChatMessagesUseCase.executeForGeneralChat(userId);
        return ResponseEntity.ok(messages);
    }

    /**
     * POST /api/chat/messages
     * Envia uma nova mensagem
     */
    @PostMapping("/messages")
    public ResponseEntity<ChatMessageResponseDTO> sendMessage(
            @Valid @RequestBody ChatMessageRequestDTO request,
            Authentication authentication) {
        Long userId = extractUserIdFromAuth(authentication);
        ChatMessageResponseDTO response = sendChatMessageUseCase.execute(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/chat/messages/{mensagemId}/avaliar
     * Avalia uma mensagem com LIKE ou DISLIKE (toggle)
     */
    @PostMapping("/messages/{mensagemId}/avaliar")
    public ResponseEntity<ChatMessageResponseDTO> avaliarMensagem(
            @PathVariable Long mensagemId,
            @Valid @RequestBody AvaliarMensagemRequestDTO request,
            Authentication authentication) {
        Long userId = extractUserIdFromAuth(authentication);
        ChatMessageResponseDTO response = avaliarMensagemUseCase.execute(mensagemId, request.tipo(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/chat/messages/{mensagemPaiId}/responder
     * Responde a uma mensagem existente (apenas um nível de aninhamento)
     */
    @PostMapping("/messages/{mensagemPaiId}/responder")
    public ResponseEntity<ChatMessageResponseDTO> responderMensagem(
            @PathVariable Long mensagemPaiId,
            @Valid @RequestBody ResponderMensagemRequestDTO request,
            Authentication authentication) {
        Long userId = extractUserIdFromAuth(authentication);
        ChatMessageResponseDTO response = responderMensagemUseCase.execute(mensagemPaiId, request.content(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/chat/rooms
     * Lista todos os chats disponíveis
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getRooms() {
        List<ChatRoomDTO> rooms = getChatRoomsUseCase.execute();
        return ResponseEntity.ok(rooms);
    }

    /**
     * Extrai o ID do usuário autenticado a partir do objeto Authentication.
     * O principal é uma instância de User carregada pelo Spring Security.
     *
     * @param authentication Objeto de autenticação do Spring Security
     * @return ID do usuário autenticado
     */
    private Long extractUserIdFromAuth(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
}
