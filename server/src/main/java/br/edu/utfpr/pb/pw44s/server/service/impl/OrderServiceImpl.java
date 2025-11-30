package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.CartItemResponseDTO;
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
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {

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
        return orderRepository;
    }

    @Override
    @Transactional
    public Order checkoutFromCart(CheckoutDTO checkoutDTO, User user) {
        // 1. Busca e Valida Carrinho
        CartResponseDTO cartDTO = buscarCarrinhoValidado(user);

        // 2. Busca e Valida Endereço e Pagamento
        Address address = buscarEndereco(checkoutDTO.getAddressId(), user);
        PaymentMethod paymentMethod = buscarMetodoPagamento(checkoutDTO.getPaymentMethodId(), user);

        // 3. Inicializa o Pedido Básico
        Order order = criarPedidoBasico(user);

        // 4. Cria Snapshots (Cópias estáticas dos dados)
        preencherSnapshots(order, user, address, paymentMethod);

        // 5. Processa Itens (Baixa Estoque + Cria OrderItems)
        BigDecimal totalItens = processarItensDoPedido(order, cartDTO.getItems());

        // 6. Calcula Totais Finais (Frete e Desconto)
        calcularTotalFinal(order, totalItens, checkoutDTO);

        // 7. Salva o pedido e limpa o carrinho
        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteById(cartDTO.getId());

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findFinalizedByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public Order cancel(Long invoiceId) {
        Order order = findByIdOrThrow(invoiceId);

        if (!order.getStatus().equals(OrderStatus.PENDING) && !order.getStatus().equals(OrderStatus.PAID)) {
            throw new RuntimeException("Não é possível cancelar um pedido com status " + order.getStatus());
        }

        // Devolve itens ao estoque
        restaurarEstoque(order.getItems());

        order.setStatus(OrderStatus.CANCELED);
        return super.save(order);
    }

    @Override
    @Transactional
    public Order confirmPayment(Long invoiceId) {
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
        Order order = findByIdOrThrow(invoiceId);
        if (!order.getStatus().equals(OrderStatus.SHIPPED)) {
            throw new RuntimeException("Apenas pedidos com status SHIPPED podem ser marcados como entregues.");
        }
        order.setStatus(OrderStatus.DELIVERED);
        return super.save(order);
    }

    // ===================================================================================
    // MÉTODOS AUXILIARES
    // ===================================================================================

    private CartResponseDTO buscarCarrinhoValidado(User user) {
        CartResponseDTO cartDTO = cartService.getAndValidateCart(user);
        if (cartDTO == null || cartDTO.getItems().isEmpty()) {
            throw new RuntimeException("Carrinho está vazio.");
        }
        return cartDTO;
    }

    private Address buscarEndereco(Long addressId, User user) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado!"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Endereço inválido para este usuário.");
        }
        return address;
    }

    private PaymentMethod buscarMetodoPagamento(Long paymentId, User user) {
        PaymentMethod payment = paymentMethodRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Método de Pagamento não encontrado!"));

        if (!payment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Método de Pagamento inválido para este usuário.");
        }
        return payment;
    }

    private Order criarPedidoBasico(User user) {
        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);
        order.setItems(new ArrayList<>());
        return order;
    }

    private void preencherSnapshots(Order order, User user, Address address, PaymentMethod payment) {
        // Snapshot Cliente
        OrderUserEmbeddable client = new OrderUserEmbeddable();
        client.setName(user.getDisplayName());
        client.setCpf(user.getCpf());
        client.setPhone(user.getPhone());
        client.setEmail(user.getUsername());
        order.setClientDetails(client);

        // Snapshot Endereço
        OrderAddressEmbeddable addrEmbed = new OrderAddressEmbeddable();
        addrEmbed.setStreet(address.getStreet());
        addrEmbed.setNumber(address.getNumber());
        addrEmbed.setNeighborhood(address.getNeighborhood());
        addrEmbed.setCity(address.getCity());
        addrEmbed.setState(address.getState());
        addrEmbed.setZip(address.getZip());
        order.setShippingAddress(addrEmbed);

        // Snapshot Pagamento
        OrderPaymentEmbeddable payEmbed = new OrderPaymentEmbeddable();
        payEmbed.setDescription(String.format("%s - %s", payment.getType(), payment.getDescription()));
        order.setPaymentMethod(payEmbed);
    }

    private BigDecimal processarItensDoPedido(Order order, List<CartItemResponseDTO> cartItems) {
        BigDecimal total = BigDecimal.ZERO;

        for (var cartItemDTO : cartItems) {
            Product product = productRepository.findById(cartItemDTO.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado ID: " + cartItemDTO.getProduct().getId()));

            // Baixa de Estoque
            if (product.getStock() < cartItemDTO.getQuantity()) {
                throw new RuntimeException("Estoque insuficiente para: " + product.getName());
            }
            product.setStock(product.getStock() - cartItemDTO.getQuantity());
            productRepository.save(product);

            // Criação do Item do Pedido
            OrderItems orderItem = new OrderItems();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItemDTO.getQuantity());
            orderItem.setUnitPrice(cartItemDTO.getPriceAtSave());
            orderItem.setSubtotal(cartItemDTO.getPriceAtSave().multiply(new BigDecimal(cartItemDTO.getQuantity())));

            order.getItems().add(orderItem);
            total = total.add(orderItem.getSubtotal());
        }
        return total;
    }

    private void calcularTotalFinal(Order order, BigDecimal totalItens, CheckoutDTO checkoutDTO) {
        BigDecimal shipping = checkoutDTO.getShipping() != null ? checkoutDTO.getShipping() : BigDecimal.ZERO;
        BigDecimal discount = checkoutDTO.getDiscount() != null ? checkoutDTO.getDiscount() : BigDecimal.ZERO;

        order.setShipping(shipping);
        order.setDiscount(discount);

        BigDecimal finalTotal = totalItens.add(shipping).subtract(discount);
        // Garante que não fique negativo
        order.setTotal(finalTotal.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : finalTotal);
    }

    private void restaurarEstoque(List<OrderItems> items) {
        for (var item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
    }

    private Order findByIdOrThrow(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));
    }
}