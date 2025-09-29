package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.CartItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CheckoutDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.PaymentMethodRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long>
        implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            AddressRepository addressRepository,
                            PaymentMethodRepository paymentMethodRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return this.orderRepository;
    }

    //Lógica do Carrinho
    @Override
    @Transactional(readOnly = true)
    public Order getCart(User user) {
        return orderRepository.findTopByUserIdAndStatus(user.getId(), OrderStatus.CART).orElse(null);
    }

    @Override
    @Transactional
    public Order addItemToCart(CartItemDTO cartItemDTO, User user) {
        Order cart = getCart(user);
        if (cart == null) {
            cart = new Order();
            cart.setStatus(OrderStatus.CART);
            cart.setUser(user);
            cart.setDate(LocalDate.now());
        }

        Product product = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        Optional<OrderItems> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartItemDTO.getProductId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            OrderItems existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDTO.getQuantity());
            existingItem.setSubtotal(existingItem.getUnitPrice().multiply(new BigDecimal(existingItem.getQuantity())));
        } else {
            OrderItems newItem = new OrderItems();
            newItem.setProduct(product);
            newItem.setQuantity(cartItemDTO.getQuantity());
            newItem.setUnitPrice(product.getPrice());
            newItem.setSubtotal(product.getPrice().multiply(new BigDecimal(cartItemDTO.getQuantity())));
            newItem.setOrder(cart);
            cart.getItems().add(newItem);
        }

        recalculateCartTotal(cart);
        return orderRepository.save(cart);
    }

    @Override
    @Transactional
    public Order updateItemQuantity(Long productId, CartItemDTO cartItemDTO, User user) {
        Order cart = getCartOrThrow(user);

        OrderItems item = findItemInCartByProductIdOrThrow(cart, productId);

        item.setQuantity(cartItemDTO.getQuantity());
        item.setSubtotal(item.getUnitPrice().multiply(new BigDecimal(cartItemDTO.getQuantity())));

        recalculateCartTotal(cart);
        return orderRepository.save(cart);
    }

    @Override
    @Transactional
    public Order removeItemFromCart(Long productId, User user) {
        Order cart = getCartOrThrow(user);

        OrderItems itemToRemove = findItemInCartByProductIdOrThrow(cart, productId);

        cart.getItems().remove(itemToRemove);

        recalculateCartTotal(cart);
        return orderRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(User user) {
        Order cart = getCart(user);
        if (cart != null) {
            orderRepository.delete(cart);
        }
    }

    @Override
    @Transactional
    public Order checkout(CheckoutDTO checkoutDTO, User user) {
        Order cart = getCartOrThrow(user);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Carrinho está vazio.");
        }

        Address address = addressRepository.findById(checkoutDTO.getAddressId()).orElseThrow(() -> new RuntimeException("Endereço não encontrado!"));
        PaymentMethod paymentMethod = paymentMethodRepository.findById(checkoutDTO.getPaymentMethodId()).orElseThrow(() -> new RuntimeException("Método de Pagamento não encontrado!"));
        if (!address.getUser().getId().equals(user.getId()) || !paymentMethod.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Endereço ou Método de Pagamento inválido.");
        }

        OrderAddressEmbeddable embeddableAddress = new OrderAddressEmbeddable();
        embeddableAddress.setStreet(address.getStreet());
        embeddableAddress.setCity(address.getCity());
        embeddableAddress.setState(address.getState());
        embeddableAddress.setZip(address.getZip());
        cart.setShippingAddress(embeddableAddress);

        OrderPaymentEmbeddable embeddablePayment = new OrderPaymentEmbeddable();
        embeddablePayment.setDescription(String.format("%s - %s", paymentMethod.getType(), paymentMethod.getDescription()));
        cart.setPaymentMethod(embeddablePayment);

        cart.setStatus(OrderStatus.PENDING);
        cart.setDate(LocalDate.now());

        for (var item : cart.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName());
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        return orderRepository.save(cart);
    }

    //Lógica de Pedidos Finalizados
    @Override
    @Transactional(readOnly = true)
    public List<Order> findFinalizedByUserId(Long userId) {
        return orderRepository.findByUserIdAndStatusNot(userId, OrderStatus.CART);
    }

    @Override
    @Transactional
    public Order cancel(Long invoiceId) {
        Order order = findByIdOrThrow(invoiceId);
        if (!order.getStatus().equals(OrderStatus.PENDING) && !order.getStatus().equals(OrderStatus.PAID)) {
            throw new RuntimeException("Não é possível cancelar um pedido com status " + order.getStatus());
        }
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


    //Métodos de Apoio
    private void recalculateCartTotal(Order cart) {
        BigDecimal total = cart.getItems().stream()
                .map(OrderItems::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotal(total);
    }

    private Order getCartOrThrow(User user) {
        return orderRepository.findTopByUserIdAndStatus(user.getId(), OrderStatus.CART)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado."));
    }

    private OrderItems findItemInCartByProductIdOrThrow(Order cart, Long productId) {
        return cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Produto não encontrado no carrinho."));
    }

    private Order findByIdOrThrow(Long invoiceId) {
        return orderRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public Order save(Order order) {
        return super.save(order);
    }

}