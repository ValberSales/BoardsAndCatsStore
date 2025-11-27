package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserCreateDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserPasswordDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserProfileDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserConfirmationDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.security.SecurityConstants;
import br.edu.utfpr.pb.pw44s.server.security.TokenService;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
public class UserController {

    private final IUserService userService;
    private final ModelMapper modelMapper;
    private final TokenService tokenService; // Injeção do serviço de token

    public UserController(IUserService userService,
                          ModelMapper modelMapper,
                          TokenService tokenService) {
        this.userService = userService;
        this.modelMapper = modelMapper;
        this.tokenService = tokenService;
    }

    @PostMapping("register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid UserCreateDTO userCreateDTO) {
        User userToSave = modelMapper.map(userCreateDTO, User.class);
        User savedUser = userService.save(userToSave);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedUser, UserDTO.class));
    }

    @GetMapping("me")
    public ResponseEntity<UserDTO> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(modelMapper.map(user, UserDTO.class));
    }

    @PutMapping("me")
    public ResponseEntity<UserDTO> updateMyProfile(@AuthenticationPrincipal User user,
                                                   @RequestBody @Valid UserProfileDTO userProfileDTO) {
        // Atualiza os dados do objeto User
        user.setDisplayName(userProfileDTO.getDisplayName());
        user.setPhone(userProfileDTO.getPhone());
        user.setUsername(userProfileDTO.getUsername());

        // Salva no banco
        User updatedUser = userService.save(user);

        // Gera um novo token (necessário caso o email/username tenha mudado)
        String newToken = tokenService.generateToken(updatedUser);

        // Cria o cabeçalho com o novo token
        HttpHeaders headers = new HttpHeaders();
        headers.add(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + newToken);

        // Retorna o usuário atualizado E o header Authorization
        return ResponseEntity.ok()
                .headers(headers)
                .body(modelMapper.map(updatedUser, UserDTO.class));
    }

    @PatchMapping("me/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal User user,
                                               @RequestBody @Valid UserPasswordDTO passwordDTO) {
        // Altera a senha
        userService.changePassword(user, passwordDTO.getCurrentPassword(), passwordDTO.getNewPassword());

        // Gera novo token (boa prática de segurança ao mudar senha)
        String newToken = tokenService.generateToken(user);

        HttpHeaders headers = new HttpHeaders();
        headers.add(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + newToken);

        return ResponseEntity.noContent()
                .headers(headers)
                .build();
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMe(@RequestBody @Valid UserConfirmationDTO confirmationDTO) {
        // Passa a senha recebida para o serviço
        userService.deleteMe(confirmationDTO.getPassword());
    }
}