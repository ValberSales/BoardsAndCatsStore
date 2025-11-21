package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IWishlistService; // Import da Interface
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("wishlist")
public class WishlistController {

    private final IWishlistService wishlistService; // Usando a Interface
    private final ModelMapper modelMapper;

    public WishlistController(IWishlistService wishlistService, ModelMapper modelMapper) {
        this.wishlistService = wishlistService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Boolean> toggleWishlist(@AuthenticationPrincipal User user,
                                                  @PathVariable Long productId) {
        boolean added = wishlistService.toggleProduct(user, productId);
        return ResponseEntity.ok(added);
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> checkWishlist(@AuthenticationPrincipal User user,
                                                 @PathVariable Long productId) {
        boolean exists = wishlistService.isProductInWishlist(user, productId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getMyWishlist(@AuthenticationPrincipal User user) {
        List<Product> products = wishlistService.getWishlist(user);
        List<ProductDTO> dtos = products.stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}