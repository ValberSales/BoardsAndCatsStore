package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO de entrada para itens do carrinho.
 * Representa um item simples (ID e quantidade) enviado pelo frontend para sincronização.
 */
@Data
public class CartItemDTO {
    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}