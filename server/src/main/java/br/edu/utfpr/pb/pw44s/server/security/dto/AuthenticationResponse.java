package br.edu.utfpr.pb.pw44s.server.security.dto;

import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private String token;
    private UserDTO user;
}