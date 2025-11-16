package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CheckoutDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.CartRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.PaymentMethodRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICartService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long>
        implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final ICartService cartService;
    private final CartRepository cartRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            AddressRepository addressRepository,
                            PaymentMethodRepository paymentMethodRepository,
                            ICartService cartService,
                            CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.cartService = cartService;
        this.cartRepository = cartRepository;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return this.orderRepository;
    }

    /**
     * NOVO MÉTODO DE CHECKOUT
     * 1. Pega o carrinho validado do CartService.
     * 2. Valida endereço e pagamento.
     * 3. Converte o Carrinho (Cart) em Pedido (Order).
     * 4. Valida e decrementa o estoque.
     * 5. Salva o novo Pedido.
     * 6. Exclui o Carrinho.
     */
    @Override
    @Transactional
    public Order checkoutFromCart(CheckoutDTO checkoutDTO, User user) {
        // 1. Pega o carrinho validado (com preços e estoques já checados)
        CartResponseDTO cartDTO = cartService.getAndValidateCart(user);
        if (cartDTO == null || cartDTO.getItems().isEmpty()) {
            throw new RuntimeException("Carrinho está vazio.");
        }

        // 2. Valida Endereço e Pagamento
        Address address = addressRepository.findById(checkoutDTO.getAddressId()).orElseThrow(() -> new RuntimeException("Endereço não encontrado!"));
        PaymentMethod paymentMethod = paymentMethodRepository.findById(checkoutDTO.getPaymentMethodId()).orElseThrow(() -> new RuntimeException("Método de Pagamento não encontrado!"));
        if (!address.getUser().getId().equals(user.getId()) || !paymentMethod.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Endereço ou Método de Pagamento inválido.");
        }

        // 3. Cria a nova entidade Order
        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);

        // Copia o endereço para o "embedded"
        OrderAddressEmbeddable embeddableAddress = new OrderAddressEmbeddable();
        embeddableAddress.setStreet(address.getStreet());
        embeddableAddress.setCity(address.getCity());
        embeddableAddress.setState(address.getState());
        embeddableAddress.setZip(address.getZip());
        order.setShippingAddress(embeddableAddress);

        // Copia o pagamento para o "embedded"
        OrderPaymentEmbeddable embeddablePayment = new OrderPaymentEmbeddable();
        embeddablePayment.setDescription(String.format("%s - %s", paymentMethod.getType(), paymentMethod.getDescription()));
        order.setPaymentMethod(embeddablePayment);

        // 4. Converte os Itens e Valida Estoque (Validação final "contratual")
        BigDecimal total = BigDecimal.ZERO;
        for (var cartItemDTO : cartDTO.getItems()) {
            // Busca o produto real DENTRO da transação para garantir
            Product product = productRepository.findById(cartItemDTO.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + cartItemDTO.getProduct().getName()));

            // Checagem final de estoque
            if (product.getStock() < cartItemDTO.getQuantity()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName());
            }

            // Decrementa o estoque
            product.setStock(product.getStock() - cartItemDTO.getQuantity());
            productRepository.save(product); // Salva o estoque atualizado

            // Cria o OrderItem
            OrderItems orderItem = new OrderItems();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItemDTO.getQuantity());
            orderItem.setUnitPrice(cartItemDTO.getPriceAtSave()); // Usa o preço validado!
            orderItem.setSubtotal(cartItemDTO.getPriceAtSave().multiply(new BigDecimal(cartItemDTO.getQuantity())));

            order.getItems().add(orderItem);
            total = total.add(orderItem.getSubtotal());
        }

        order.setTotal(total);

        // 5. Salva o novo Pedido
        Order savedOrder = orderRepository.save(order);

        // 6. Exclui o carrinho
        cartRepository.deleteById(cartDTO.getId());

        return savedOrder;
    }


    // #############################################
    // LÓGICA DE PEDIDOS FINALIZADOS
    // #############################################

    @Override
    @Transactional(readOnly = true)
    public List<Order> findFinalizedByUserId(Long userId) {
        // Modificado para usar o método de repositório mais limpo
        return orderRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public Order cancel(Long invoiceId) {
        Order order = findByIdOrThrow(invoiceId);
        // Validação mantida
        if (!order.getStatus().equals(OrderStatus.PENDING) && !order.getStatus().equals(OrderStatus.PAID)) {
            throw new RuntimeException("Não é possível cancelar um pedido com status " + order.getStatus());
        }
        // Restaura o estoque
        for (var item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        order.setStatus(OrderStatus.CANCELED);
        return super.save(order);
    }

    @Override
    @Transactional
    public Order confirmPayment(Long invoiceId) {
        // ... (lógica mantida)
        Order order = findByIdOrThrow(invoiceId);
        if (!order.getStatus().equals(OrderStatus.PENDING)) {
            throw new RuntimeException("Apenas pedidos com status PENDING podem ser pagos.");
        }
        order.setStatus(OrderStatus.PAID);
        return super.save(order);
    }

    @Override
    @Transactional
    public Order markAsShipped(Long invoiceId, String trackingCode) {
        // ... (lógica mantida)
        Order order = findByIdOrThrow(invoiceId);
        if (!order.getStatus().equals(OrderStatus.PAID)) {
            throw new RuntimeException("Apenas pedidos com status PAID podem ser enviados.");
        }
        order.setStatus(OrderStatus.SHIPPED);
        order.setTrackingCode(trackingCode);
        return super.save(order);
    }

    @Override
    @Transactional
    public Order markAsDelivered(Long invoiceId) {
        // ... (lógica mantida)
        Order order = findByIdOrThrow(invoiceId);
        if (!order.getStatus().equals(OrderStatus.SHIPPED)) {
            throw new RuntimeException("Apenas pedidos com status SHIPPED podem ser marcados como entregues.");
        }
        order.setStatus(OrderStatus.DELIVERED);
        return super.save(order);
    }


    // #############################################
    // MÉTODOS DE APOIO
    // #############################################

    private Order findByIdOrThrow(Long invoiceId) {
        return orderRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

}