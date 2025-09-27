package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_product")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1024)
    private String description;

    @NotNull
    @Positive
    @Column(nullable = false)
    private BigDecimal price;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String mechanics;

    private String players;

    private String editor;

    @NotNull
    @Column(nullable = false)
    private Boolean promo;

    @NotNull
    @Min(value = 0, message = "O estoque não pode ser negativo.")
    @Column(nullable = false)
    private Integer stock;
}