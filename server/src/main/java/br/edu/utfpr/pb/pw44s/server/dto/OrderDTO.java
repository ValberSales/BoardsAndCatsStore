package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.OrderAddressEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.OrderPaymentEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.OrderUserEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO de saída para visualização de um Pedido completo.
 * Inclui snapshots de endereço, usuário e pagamento para histórico.
 */
@Data
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private LocalDate date;
    private OrderStatus status;
    private OrderPaymentEmbeddable payment;
    private BigDecimal total;
    private BigDecimal shipping;
    private BigDecimal discount;
    private String trackingCode;
    private UserDTO user;
    private OrderAddressEmbeddable address;
    private OrderUserEmbeddable clientDetails;
    private List<OrderItemsDTO> items;
}