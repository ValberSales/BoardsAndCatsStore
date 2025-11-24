package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutDTO {
    @NotNull
    private Long addressId;

    @NotNull
    private Long paymentMethodId;

    private BigDecimal shipping;

    private BigDecimal discount;
}