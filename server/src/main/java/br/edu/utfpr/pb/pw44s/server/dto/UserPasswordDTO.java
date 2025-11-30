package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para alteração de senha.
 * Exige a senha atual para validação e a nova senha com regras de força.
 */
@Data
public class UserPasswordDTO {

    @NotNull
    private String currentPassword;

    @NotNull
    @Size(min = 6)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$")
    private String newPassword;
}