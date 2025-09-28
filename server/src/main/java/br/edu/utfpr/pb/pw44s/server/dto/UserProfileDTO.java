package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileDTO {

    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;

    @NotNull
    @Size(min = 4, max = 255)
    private String phone;
}