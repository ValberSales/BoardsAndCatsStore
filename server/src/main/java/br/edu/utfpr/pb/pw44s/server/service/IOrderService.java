package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CartItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CheckoutDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {

    // Métodos de Pedidos Finalizados
    List<Order> findFinalizedByUserId(Long userId);
    List<Order> findByStatus(OrderStatus status);
    Order cancel(Long invoiceId);
    Order confirmPayment(Long invoiceId);
    Order markAsShipped(Long invoiceId, String trackingCode);
    Order markAsDelivered(Long invoiceId);

    // Métodos do Carrinho de Compras
    Order getCart(User user);
    Order addItemToCart(CartItemDTO cartItemDTO, User user);
    Order checkout(CheckoutDTO checkoutDTO, User user);
    Order updateItemQuantity(Long productId, CartItemDTO cartItemDTO, User user);
    Order removeItemFromCart(Long productId, User user);
    void clearCart(User user);
}