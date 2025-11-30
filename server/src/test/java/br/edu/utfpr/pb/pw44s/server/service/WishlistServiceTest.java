package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.model.Wishlist;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.repository.WishlistRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.WishlistServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private WishlistServiceImpl wishlistService;

    @Test
    @DisplayName("Deve adicionar à wishlist se não existir (Toggle ON)")
    void toggleProduct_ShouldAdd_WhenNotExists() {
        User user = new User();
        Product product = new Product();
        product.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(wishlistRepository.findByUserAndProduct(user, product)).thenReturn(Optional.empty());

        boolean result = wishlistService.toggleProduct(user, 1L);

        assertThat(result).isTrue(); // True significa que adicionou
        verify(wishlistRepository).save(any(Wishlist.class));
    }

    @Test
    @DisplayName("Deve remover da wishlist se já existir (Toggle OFF)")
    void toggleProduct_ShouldRemove_WhenExists() {
        User user = new User();
        Product product = new Product();
        product.setId(1L);
        Wishlist wishlistEntry = new Wishlist(user, product);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(wishlistRepository.findByUserAndProduct(user, product)).thenReturn(Optional.of(wishlistEntry));

        boolean result = wishlistService.toggleProduct(user, 1L);

        assertThat(result).isFalse(); // False significa que removeu
        verify(wishlistRepository).delete(wishlistEntry);
    }

    @Test
    @DisplayName("Deve retornar true se produto estiver na wishlist")
    void isProductInWishlist_ShouldReturnTrue() {
        User user = new User();
        Long productId = 1L;

        when(wishlistRepository.findByUserAndProduct(any(User.class), any(Product.class)))
                .thenReturn(Optional.of(new Wishlist()));

        boolean result = wishlistService.isProductInWishlist(user, productId);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Deve listar produtos da wishlist do usuário")
    void getWishlist_ShouldReturnProductList() {
        User user = new User();
        when(wishlistRepository.findAllProductsByUser(user)).thenReturn(List.of(new Product()));

        List<Product> result = wishlistService.getWishlist(user);

        assertThat(result).isNotEmpty();
    }
}