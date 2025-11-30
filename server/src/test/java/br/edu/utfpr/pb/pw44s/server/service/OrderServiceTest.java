package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.*;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.CartRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.PaymentMethodRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;
    @Mock private AddressRepository addressRepository;
    @Mock private PaymentMethodRepository paymentMethodRepository;
    @Mock private ICartService cartService;
    @Mock private CartRepository cartRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    @DisplayName("Deve realizar checkout com sucesso (Caminho Feliz)")
    void checkoutFromCart_ShouldCreateOrder_WhenDataIsValid() {
        // 1. DADOS DE ENTRADA
        User user = new User();
        user.setId(1L);
        user.setDisplayName("Cliente Teste");

        CheckoutDTO checkoutDTO = new CheckoutDTO();
        checkoutDTO.setAddressId(10L);
        checkoutDTO.setPaymentMethodId(20L);
        checkoutDTO.setShipping(new BigDecimal("15.00"));

        // 2. MOCKS

        // Mock do Carrinho
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(100L);

        CartItemResponseDTO itemResponse = new CartItemResponseDTO();
        itemResponse.setProduct(productDTO);
        itemResponse.setQuantity(2);
        itemResponse.setPriceAtSave(new BigDecimal("50.00")); // Subtotal = 100.00

        CartResponseDTO cartDTO = new CartResponseDTO();
        cartDTO.setId(50L);
        cartDTO.setItems(List.of(itemResponse));

        when(cartService.getAndValidateCart(user)).thenReturn(cartDTO);

        // Mock do Endereço
        Address address = new Address();
        address.setId(10L);
        address.setUser(user); // Importante: deve pertencer ao usuario
        address.setStreet("Rua Teste");
        when(addressRepository.findById(10L)).thenReturn(Optional.of(address));

        // Mock do Pagamento
        PaymentMethod pm = new PaymentMethod();
        pm.setId(20L);
        pm.setUser(user);
        pm.setType("CREDIT_CARD");
        pm.setDescription("Visa");
        when(paymentMethodRepository.findById(20L)).thenReturn(Optional.of(pm));

        // Mock do Produto (Estoque)
        Product product = new Product();
        product.setId(100L);
        product.setName("Produto Teste");
        product.setStock(10); // Tem estoque suficiente (pede 2)
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));

        // Mock do Salvamento da Order
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(999L);
            return o;
        });

        // 3. EXECUÇÃO
        Order createdOrder = orderService.checkoutFromCart(checkoutDTO, user);

        // 4. VERIFICAÇÕES
        assertThat(createdOrder).isNotNull();
        assertThat(createdOrder.getItems()).hasSize(1);

        // Valida totais: 100.00 (itens) + 15.00 (frete) = 115.00
        assertThat(createdOrder.getTotal()).isEqualByComparingTo("115.00");

        // Valida baixa de estoque (era 10, comprou 2 -> deve sobrar 8)
        assertThat(product.getStock()).isEqualTo(8);
        verify(productRepository).save(product);

        // Valida limpeza do carrinho
        verify(cartRepository).deleteById(50L);
    }

    @Test
    @DisplayName("Deve falhar checkout se carrinho estiver vazio")
    void checkout_ShouldThrowException_WhenCartEmpty() {
        User user = new User();
        when(cartService.getAndValidateCart(user)).thenReturn(null);

        CheckoutDTO checkoutDTO = new CheckoutDTO();

        assertThatThrownBy(() -> orderService.checkoutFromCart(checkoutDTO, user))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("vazio");
    }

    @Test
    @DisplayName("Deve falhar se endereço não pertencer ao usuário")
    void checkout_ShouldThrowException_WhenAddressInvalid() {
        User user = new User();
        user.setId(1L);

        CartResponseDTO cartDTO = new CartResponseDTO();
        cartDTO.setItems(List.of(new CartItemResponseDTO()));
        when(cartService.getAndValidateCart(user)).thenReturn(cartDTO);

        User otherUser = new User();
        otherUser.setId(2L);
        Address address = new Address();
        address.setId(10L);
        address.setUser(otherUser); // Outro dono

        when(addressRepository.findById(10L)).thenReturn(Optional.of(address));

        CheckoutDTO checkoutDTO = new CheckoutDTO();
        checkoutDTO.setAddressId(10L);

        assertThatThrownBy(() -> orderService.checkoutFromCart(checkoutDTO, user))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Endereço inválido");
    }

    @Test
    @DisplayName("Deve cancelar pedido e estornar estoque")
    void cancel_ShouldRestoreStock() {
        // Given
        Product product = new Product();
        product.setId(100L);
        product.setStock(10);

        OrderItems item = new OrderItems();
        item.setProduct(product);
        item.setQuantity(2);

        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PENDING);
        order.setItems(List.of(item));

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // When
        Order canceledOrder = orderService.cancel(1L);

        // Then
        assertThat(canceledOrder.getStatus()).isEqualTo(OrderStatus.CANCELED);
        // Estoque deve subir: 10 + 2 = 12
        assertThat(product.getStock()).isEqualTo(12);
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("Não deve cancelar pedido já entregue")
    void cancel_ShouldThrowException_WhenDelivered() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.DELIVERED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.cancel(1L))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    @DisplayName("Deve avançar status de envio corretamente")
    void markAsShipped_ShouldUpdateStatus() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PAID); // Só pode enviar se estiver pago

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        orderService.markAsShipped(1L, "BR123456");

        assertThat(order.getStatus()).isEqualTo(OrderStatus.SHIPPED);
        assertThat(order.getTrackingCode()).isEqualTo("BR123456");
    }
}