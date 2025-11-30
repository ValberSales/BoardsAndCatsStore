package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO de entrada para finalizar um pedido (Checkout).
 * Contém os IDs necessários para vincular endereço e pagamento, além de valores calculados no front.
 */
@Data
public class CheckoutDTO {
    @NotNull
    private Long addressId;

    @NotNull
    private Long paymentMethodId;

    private BigDecimal shipping;
    private BigDecimal discount;
}