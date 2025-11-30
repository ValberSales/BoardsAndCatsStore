package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO de saída para itens do carrinho.
 * Contém o produto completo, preço validado e possíveis mensagens de ajuste (ex: estoque insuficiente).
 */
@Data
public class CartItemResponseDTO {
    private ProductDTO product;
    private Integer quantity;
    private BigDecimal priceAtSave;
    private String validationMessage;
}