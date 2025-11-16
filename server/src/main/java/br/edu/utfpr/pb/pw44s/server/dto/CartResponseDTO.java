package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para *enviar* o carrinho completo (validado) de volta ao frontend.
 */
@Data
public class CartResponseDTO {

    private Long id;
    private List<CartItemResponseDTO> items;
    private BigDecimal total;
}