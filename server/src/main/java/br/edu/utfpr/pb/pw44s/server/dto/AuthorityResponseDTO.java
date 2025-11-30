package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para expor as permissões (roles) do usuário na resposta de autenticação.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorityResponseDTO {
    private String authority;
}