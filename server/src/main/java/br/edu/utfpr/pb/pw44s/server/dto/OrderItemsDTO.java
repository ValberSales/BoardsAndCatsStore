package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class OrderItemsDTO {

    private ProductDTO product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

}