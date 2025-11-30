package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO de saída que representa o carrinho de compras completo e validado.
 * Retornado após operações de leitura ou sincronização do carrinho.
 */
@Data
public class CartResponseDTO {
    private Long id;
    private List<CartItemResponseDTO> items;
    private BigDecimal total;
}