package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutDTO {
    @NotNull
    private Long addressId;

    @NotNull
    private Long paymentMethodId;
}