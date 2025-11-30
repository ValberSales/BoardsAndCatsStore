package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CartItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartSyncDTO;
import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Cart;
import br.edu.utfpr.pb.pw44s.server.model.CartItem;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.CartRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.CartServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private CartServiceImpl cartService;

    @Test
    @DisplayName("Deve retornar null se o carrinho não existir")
    void getAndValidateCart_ShouldReturnNull_WhenCartNotFound() {
        User user = new User();
        user.setId(1L);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());

        CartResponseDTO result = cartService.getAndValidateCart(user);

        assertThat(result).isNull();
    }

    @Test
    @DisplayName("Deve validar carrinho e detectar mudança de preço")
    void getAndValidateCart_ShouldDetectPriceChange() {
        // Given
        User user = new User();
        user.setId(1L);

        Product product = new Product();
        product.setId(10L);
        product.setPrice(new BigDecimal("200.00")); // Preço Novo
        product.setStock(10);

        CartItem item = new CartItem();
        item.setProductId(10L);
        item.setQuantity(1);
        item.setPriceAtSave(new BigDecimal("150.00")); // Preço Antigo

        Cart cart = new Cart();
        cart.setId(1L);
        cart.setUser(user);
        cart.setItems(new ArrayList<>(List.of(item)));

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(modelMapper.map(any(), eq(ProductDTO.class))).thenReturn(new ProductDTO());

        // When
        CartResponseDTO result = cartService.getAndValidateCart(user);

        // Then
        assertThat(result).isNotNull();
        // Verifica se houve mensagem de validação
        assertThat(result.getItems().get(0).getValidationMessage()).contains("Preço atualizado");
        // Verifica se o repositório foi chamado para salvar a correção
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("Deve remover item se estoque for zero")
    void getAndValidateCart_ShouldRemoveItem_WhenNoStock() {
        User user = new User();
        user.setId(1L);

        Product product = new Product();
        product.setId(10L);
        product.setStock(0); // Sem estoque

        CartItem item = new CartItem();
        item.setProductId(10L);

        Cart cart = new Cart();
        cart.setItems(new ArrayList<>(List.of(item)));

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        CartResponseDTO result = cartService.getAndValidateCart(user);

        // Carrinho deve ficar vazio e ser deletado
        verify(cartRepository).delete(cart);
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("Deve salvar/sincronizar carrinho enviado pelo front")
    void saveCart_ShouldSyncItems() {
        // Given
        User user = new User();
        user.setId(1L);

        CartSyncDTO syncDTO = new CartSyncDTO();
        CartItemDTO itemDTO = new CartItemDTO();
        itemDTO.setProductId(10L);
        itemDTO.setQuantity(2);
        syncDTO.setItems(List.of(itemDTO));

        Product product = new Product();
        product.setId(10L);
        product.setPrice(BigDecimal.TEN);
        product.setStock(5);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(new Cart()));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(modelMapper.map(any(), eq(ProductDTO.class))).thenReturn(new ProductDTO());

        // When
        CartResponseDTO result = cartService.saveCart(user, syncDTO);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getItems()).hasSize(1);
        verify(cartRepository).save(any(Cart.class));
    }
}