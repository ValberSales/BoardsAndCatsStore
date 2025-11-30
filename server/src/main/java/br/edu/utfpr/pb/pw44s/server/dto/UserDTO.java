package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * DTO de saída seguro para dados do Usuário (sem senha).
 * Utilizado para enviar perfil e dados de sessão para o frontend.
 */
@Data
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String displayName;
    private String phone;
    private String cpf;
    private Set<AuthorityResponseDTO> authorities;

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.phone = user.getPhone();
        this.cpf = user.getCpf();
        this.authorities = user.getAuthorities().stream()
                .map(authority -> new AuthorityResponseDTO(authority.getAuthority()))
                .collect(Collectors.toSet());
    }
}