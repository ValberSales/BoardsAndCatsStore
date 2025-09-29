package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.OrderAddressEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.OrderPaymentEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderDTO {

    private Long id;
    private LocalDate date;
    private OrderStatus status;
    private OrderPaymentEmbeddable payment;
    private BigDecimal total;
    private String trackingCode;
    private UserDTO user;
    private OrderAddressEmbeddable address;
    private List<OrderItemsDTO> items;
}