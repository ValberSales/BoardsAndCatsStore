package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserCreateDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserProfileDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users") // A base para todos os endpoints de usuário
public class UserController {

    private final IUserService userService;
    private final ModelMapper modelMapper;

    public UserController(IUserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid UserCreateDTO userCreateDTO) {
        User userToSave = modelMapper.map(userCreateDTO, User.class);
        User savedUser = userService.save(userToSave);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedUser, UserDTO.class));
    }


    @GetMapping("me")
    public ResponseEntity<UserDTO> getMyProfile(@AuthenticationPrincipal User user) {
        // A anotação @AuthenticationPrincipal já injeta o usuário logado.
        // Apenas o convertemos para o DTO de resposta.
        return ResponseEntity.ok(modelMapper.map(user, UserDTO.class));
    }


    @PutMapping("me")
    public ResponseEntity<UserDTO> updateMyProfile(@AuthenticationPrincipal User user,
                                                   @RequestBody @Valid UserProfileDTO userProfileDTO) {
        // Atualiza os dados da entidade 'user' com as informações do DTO.
        user.setDisplayName(userProfileDTO.getDisplayName());
        user.setPhone(userProfileDTO.getPhone());

        // Salva o usuário atualizado.
        User updatedUser = userService.save(user);

        return ResponseEntity.ok(modelMapper.map(updatedUser, UserDTO.class));
    }
}