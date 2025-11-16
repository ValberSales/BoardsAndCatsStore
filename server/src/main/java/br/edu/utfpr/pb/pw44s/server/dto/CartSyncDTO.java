package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * DTO para *receber* o carrinho completo do frontend.
 */
@Data
public class CartSyncDTO {

    @NotNull
    @Valid // Garante que os itens dentro da lista também sejam validados
    private List<CartItemDTO> items;
}