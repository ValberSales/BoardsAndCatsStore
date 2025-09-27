package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.UserCreateDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User entity) {
        UserDTO dto = new UserDTO();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setDisplayName(entity.getDisplayName());
        dto.setPhone(entity.getPhone());
        return dto;
    }

    public User toEntity(UserCreateDTO dto) {
        User entity = new User();
        entity.setUsername(dto.getUsername());
        entity.setDisplayName(dto.getDisplayName());
        entity.setPassword(dto.getPassword()); // A senha em texto plano vem aqui
        entity.setPhone(dto.getPhone());
        return entity;
    }
}