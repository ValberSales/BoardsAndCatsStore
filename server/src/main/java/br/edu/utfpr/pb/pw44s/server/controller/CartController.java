package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartSyncDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cart")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Endpoint para buscar o carrinho salvo e validado do usuário.
     * @param user O usuário autenticado injetado pelo Spring Security.
     * @return 200 OK com o carrinho validado, ou 204 No Content se não houver carrinho.
     */
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal User user) {
        CartResponseDTO cartDTO = cartService.getAndValidateCart(user);
        if (cartDTO == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cartDTO);
    }

    /**
     * Endpoint para salvar (sobrescrever) o carrinho inteiro do usuário.
     * @param user O usuário autenticado.
     * @param cartSyncDTO O DTO com a lista de itens vinda do frontend.
     * @return 200 OK com o carrinho salvo e validado.
     */
    @PutMapping
    public ResponseEntity<CartResponseDTO> saveCart(@AuthenticationPrincipal User user,
                                                    @RequestBody @Valid CartSyncDTO cartSyncDTO) {
        CartResponseDTO savedCartDTO = cartService.saveCart(user, cartSyncDTO);
        if (savedCartDTO == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(savedCartDTO);
    }
}