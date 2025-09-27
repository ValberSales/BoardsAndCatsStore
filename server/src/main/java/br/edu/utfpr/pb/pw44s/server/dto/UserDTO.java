package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String displayName;
    private String phone;
}