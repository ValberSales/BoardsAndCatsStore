package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserConfirmationDTO {
    @NotBlank(message = "A senha é obrigatória para confirmar esta ação.")
    private String password;
}