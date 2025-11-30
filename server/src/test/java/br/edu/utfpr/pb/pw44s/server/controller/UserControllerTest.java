package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.*;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.security.TokenService;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private IUserService userService;
    @MockitoBean private TokenService tokenService;

    @TestConfiguration
    static class TestConfig {
        @Bean public ModelMapper modelMapper() { return new ModelMapper(); }
    }

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("test@email.com");
        user.setDisplayName("Test User");
        user.setPassword("EncodedPass");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }

    @Test
    @DisplayName("Registrar - Deve criar usuário e retornar 201 Created")
    void register_ShouldReturnCreated() throws Exception {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("new@email.com");
        createDTO.setPassword("Pass123!");
        createDTO.setDisplayName("New User");
        createDTO.setPhone("46999999999");
        createDTO.setCpf("12345678900");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("new@email.com");

        when(userService.save(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("new@email.com"));
    }

    @Test
    @DisplayName("Meu Perfil - Deve retornar dados do usuário logado")
    void getMyProfile_ShouldReturnUserDTO() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("test@email.com"));
    }

    @Test
    @DisplayName("Atualizar Perfil - Deve atualizar e retornar novo token")
    void updateMyProfile_ShouldReturnOkAndToken() throws Exception {
        UserProfileDTO profileDTO = new UserProfileDTO();
        profileDTO.setDisplayName("Updated Name");
        profileDTO.setPhone("46888888888");
        profileDTO.setUsername("test@email.com");

        when(userService.save(any(User.class))).thenReturn(user);
        when(tokenService.generateToken(any(User.class))).thenReturn("new-jwt-token");

        mockMvc.perform(put("/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileDTO)))
                .andExpect(status().isOk())
                .andExpect(header().exists("Authorization"))
                // CORREÇÃO: Agora esperamos o nome ATUALIZADO, não o antigo
                .andExpect(jsonPath("$.displayName").value("Updated Name"));
    }

    @Test
    @DisplayName("Trocar Senha - Deve chamar serviço e retornar 204 No Content")
    void changePassword_ShouldReturnNoContent() throws Exception {
        UserPasswordDTO passwordDTO = new UserPasswordDTO();
        passwordDTO.setCurrentPassword("OldPass123!");
        passwordDTO.setNewPassword("NewPass123!");

        doNothing().when(userService).changePassword(any(User.class), anyString(), anyString());
        when(tokenService.generateToken(any(User.class))).thenReturn("new-jwt-token");

        mockMvc.perform(patch("/users/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(passwordDTO)))
                .andExpect(status().isNoContent())
                .andExpect(header().exists("Authorization"));
    }

    @Test
    @DisplayName("Excluir Conta - Deve chamar serviço e retornar 204 No Content")
    void deleteMe_ShouldReturnNoContent() throws Exception {
        UserConfirmationDTO confirmationDTO = new UserConfirmationDTO();
        confirmationDTO.setPassword("Pass123!");

        doNothing().when(userService).deleteMe(anyString());

        mockMvc.perform(delete("/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(confirmationDTO)))
                .andExpect(status().isNoContent());
    }
}