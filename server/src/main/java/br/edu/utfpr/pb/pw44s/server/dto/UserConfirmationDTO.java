package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO utilizado para confirmar ações sensíveis (ex: deletar conta), exigindo a senha atual.
 */
@Data
public class UserConfirmationDTO {
    @NotBlank(message = "A senha é obrigatória para confirmar esta ação.")
    private String password;
}