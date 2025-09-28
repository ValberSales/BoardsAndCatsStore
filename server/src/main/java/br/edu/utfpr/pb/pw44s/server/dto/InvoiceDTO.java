package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.InvoiceAddressEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.InvoicePaymentEmbeddable;
import br.edu.utfpr.pb.pw44s.server.model.InvoiceStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class InvoiceDTO {

    private Long id;
    private LocalDate date;
    private InvoiceStatus status;
    private InvoicePaymentEmbeddable payment;
    private BigDecimal total;
    private String trackingCode;
    private UserDTO user;
    private InvoiceAddressEmbeddable address;
    private List<InvoiceItemsDTO> items;
}