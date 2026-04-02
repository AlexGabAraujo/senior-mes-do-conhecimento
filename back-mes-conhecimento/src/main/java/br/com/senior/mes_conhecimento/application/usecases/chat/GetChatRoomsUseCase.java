package br.com.senior.mes_conhecimento.application.usecases.chat;

import br.com.senior.mes_conhecimento.application.dtos.ChatRoomDTO;
import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Use Case para buscar todos os chats disponíveis.
 * Retorna o Chat Geral como primeira opção seguido dos chats de palestras.
 */
@Service
public class GetChatRoomsUseCase {
    
    private final LectureRepository lectureRepository;
    
    public GetChatRoomsUseCase(LectureRepository lectureRepository) {
        this.lectureRepository = lectureRepository;
    }
    
    /**
     * Busca todos os chats disponíveis
     * @return Lista de chats com Chat Geral como primeira opção
     */
    public List<ChatRoomDTO> execute() {
        List<ChatRoomDTO> rooms = new ArrayList<>();
        
        // Adicionar Chat Geral como primeira opção
        rooms.add(new ChatRoomDTO(null, "Chat Geral", null, true));
        
        // Adicionar chats de palestras
        var lectures = lectureRepository.findAll();
        lectures.forEach(lecture -> 
            rooms.add(new ChatRoomDTO(
                lecture.getId(),
                lecture.getTitle(),
                lecture.getDate(),
                false
            ))
        );
        
        return rooms;
    }
}
