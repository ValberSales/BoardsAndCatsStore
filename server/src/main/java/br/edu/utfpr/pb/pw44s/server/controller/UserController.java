package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserCreateDTO;
import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final IUserService userService;
    private final ModelMapper modelMapper;

    public UserController(IUserService userService, ModelMapper modelMapper) { // MUDANÇA: Injetando ModelMapper
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid UserCreateDTO userCreateDTO) {

        User userToSave = modelMapper.map(userCreateDTO, User.class);

        User savedUser = userService.save(userToSave);

        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedUser, UserDTO.class));
    }

}