package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentMethodDTO {

    private Long id;

    @NotNull
    @Size(min = 3, max = 255)
    private String type;

    @NotNull
    @Size(min = 4, max = 255)
    private String description;
}