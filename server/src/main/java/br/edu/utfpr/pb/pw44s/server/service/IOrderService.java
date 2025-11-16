package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CheckoutDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {

    // #### MÉTODOS DE GESTÃO DE PEDIDOS (ANTIGOS E NOVOS) ####
    List<Order> findFinalizedByUserId(Long userId);
    List<Order> findByStatus(OrderStatus status);
    Order cancel(Long invoiceId);
    Order confirmPayment(Long invoiceId);
    Order markAsShipped(Long invoiceId, String trackingCode);
    Order markAsDelivered(Long invoiceId);

    /**
     * NOVO MÉTODO: Cria um Pedido (Order) com base no Carrinho (Cart)
     * salvo do usuário.
     * @param checkoutDTO DTO com ID do endereço e pagamento.
     * @param user O usuário autenticado.
     * @return O Pedido finalizado e salvo.
     */
    Order checkoutFromCart(CheckoutDTO checkoutDTO, User user);

}