package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO para *enviar* um item do carrinho (validado) de volta ao frontend.
 * Inclui os dados completos do produto e mensagens de validação.
 */
@Data
public class CartItemResponseDTO {

    private ProductDTO product; // O DTO do produto completo
    private Integer quantity;
    private BigDecimal priceAtSave; // O preço que foi salvo/validado
    private String validationMessage; // Ex: "Preço atualizado" ou "Estoque insuficiente"
}