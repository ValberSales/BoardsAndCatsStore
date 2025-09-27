package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateDTO {

    @NotNull(message = "{utfpr.pw44s.user.username.NotNull}")
    @Size(min = 4, max = 255)
    private String username;

    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;

    @NotNull
    @Size(min = 6)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$")
    private String password;

    @NotNull
    @Size(min = 4, max = 255)
    private String phone;
}