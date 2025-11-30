package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO que representa um item dentro de um pedido (produto, quantidade e valores).
 */
@Data
@NoArgsConstructor
public class OrderItemsDTO {
    private ProductDTO product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}