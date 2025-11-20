package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class OrderUserEmbeddable {
    private String name;
    private String cpf;
    private String phone;
    private String email;
}