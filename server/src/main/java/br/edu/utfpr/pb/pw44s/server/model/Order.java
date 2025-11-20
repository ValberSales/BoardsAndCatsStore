package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_order")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate date;

    @NotNull
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @NotNull
    private BigDecimal total;

    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "tracking_code")
    private String trackingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // nullable = true
    private User user;

    @Embedded
    private OrderAddressEmbeddable shippingAddress;

    @Embedded
    private OrderPaymentEmbeddable paymentMethod;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "client_name")),
            @AttributeOverride(name = "cpf", column = @Column(name = "client_cpf")),
            @AttributeOverride(name = "phone", column = @Column(name = "client_phone")),
            @AttributeOverride(name = "email", column = @Column(name = "client_email"))
    })
    private OrderUserEmbeddable clientDetails;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItems> items = new ArrayList<>();
}