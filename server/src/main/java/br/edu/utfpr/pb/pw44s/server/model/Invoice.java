package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_invoice")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate date;

    @NotNull
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @NotNull
    private BigDecimal total;

    @Column(name = "tracking_code")
    private String trackingCode;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Embedded
    private InvoiceAddressEmbeddable shippingAddress;

    @Embedded
    private InvoicePaymentEmbeddable paymentMethod;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItems> items = new ArrayList<>();
}