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
    private final TokenService tokenService;

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
        user.setDisplayName(userProfileDTO.getDisplayName());
        user.setPhone(userProfileDTO.getPhone());
        user.setUsername(userProfileDTO.getUsername());

        User updatedUser = userService.save(user);
        String newToken = tokenService.generateToken(updatedUser);

        HttpHeaders headers = new HttpHeaders();
        headers.add(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + newToken);

        return ResponseEntity.ok()
                .headers(headers)
                .body(modelMapper.map(updatedUser, UserDTO.class));
    }

    @PatchMapping("me/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal User user,
                                               @RequestBody @Valid UserPasswordDTO passwordDTO) {
        userService.changePassword(user, passwordDTO.getCurrentPassword(), passwordDTO.getNewPassword());
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
        userService.deleteMe(confirmationDTO.getPassword());
    }
}