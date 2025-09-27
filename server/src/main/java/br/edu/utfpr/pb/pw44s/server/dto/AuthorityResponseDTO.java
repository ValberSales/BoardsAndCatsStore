package br.edu.utfpr.pb.pw44s.server.dto; // Movido para o pacote principal de DTOs

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorityResponseDTO {
    private String authority;
}