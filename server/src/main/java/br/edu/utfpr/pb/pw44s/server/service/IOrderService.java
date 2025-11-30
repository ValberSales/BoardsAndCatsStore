package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CheckoutDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {

    List<Order> findFinalizedByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);

    Order cancel(Long invoiceId);

    Order confirmPayment(Long invoiceId);

    Order markAsShipped(Long invoiceId, String trackingCode);

    Order markAsDelivered(Long invoiceId);

    /**
     * Cria um Pedido (Order) processando o Carrinho (Cart) atual do usuário.
     */
    Order checkoutFromCart(CheckoutDTO checkoutDTO, User user);
}