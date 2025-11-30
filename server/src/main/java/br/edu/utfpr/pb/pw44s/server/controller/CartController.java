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

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal User user) {
        CartResponseDTO cartDTO = cartService.getAndValidateCart(user);
        if (cartDTO == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cartDTO);
    }

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