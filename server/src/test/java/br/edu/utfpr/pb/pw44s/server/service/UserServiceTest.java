package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.UserServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    @DisplayName("Deve salvar usuário criptografando a senha")
    void save_ShouldEncodePassword() {
        // Given
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("rawPassword");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("testuser");
        savedUser.setPassword("encodedPassword");

        when(passwordEncoder.encode("rawPassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.save(user);

        // Then
        assertThat(result.getId()).isEqualTo(1L);
        // Verifica se o encoder foi chamado
        verify(passwordEncoder).encode("rawPassword");
        // Verifica se o save foi chamado
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Deve carregar usuário pelo username (UserDetailsService)")
    void loadUserByUsername_ShouldReturnUser() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        user.setPassword("encodedPass");

        when(userRepository.findUserByUsername(username)).thenReturn(user);

        UserDetails result = userService.loadUserByUsername(username);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(username);
        verify(userRepository).findUserByUsername(username);
    }

    @Test
    @DisplayName("Deve lançar exceção quando usuário não for encontrado")
    void loadUserByUsername_ShouldThrowException_WhenNotFound() {
        String username = "nonexistent";
        when(userRepository.findUserByUsername(username)).thenReturn(null);

        assertThatThrownBy(() -> userService.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    @DisplayName("Deve alterar a senha com sucesso")
    void changePassword_ShouldUpdatePassword() {
        // Given
        User user = new User();
        user.setPassword("encodedOldPass");

        String currentPassword = "oldPass";
        String newPassword = "newPass";

        // Mock das validações
        when(passwordEncoder.matches(currentPassword, "encodedOldPass")).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPass");
        when(userRepository.save(user)).thenReturn(user);

        // When
        userService.changePassword(user, currentPassword, newPassword);

        // Then
        verify(userRepository).save(user);
        verify(passwordEncoder).encode(newPassword);
    }

    @Test
    @DisplayName("Deve falhar ao alterar senha se a senha atual estiver incorreta")
    void changePassword_ShouldThrowException_WhenOldPasswordInvalid() {
        User user = new User();
        user.setPassword("encodedOldPass");

        String wrongCurrentPassword = "wrongPass";
        String newPassword = "newPass";

        when(passwordEncoder.matches(wrongCurrentPassword, "encodedOldPass")).thenReturn(false);

        assertThatThrownBy(() -> userService.changePassword(user, wrongCurrentPassword, newPassword))
                .isInstanceOf(RuntimeException.class);

        verify(userRepository, never()).save(any());
    }
}