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
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um Produto no sistema.
 * Mapeada para a tabela 'tb_product' no banco de dados.
 * Contém todas as informações descritivas, de precificação, estoque e imagens dos itens vendidos.
 */
@Entity
@Table(name = "tb_product")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    /**
     * Identificador único do produto.
     * Gerado automaticamente pelo banco de dados (estratégia IDENTITY).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome do produto.
     * Deve ser único no sistema e é obrigatório.
     */
    @NotNull
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Descrição detalhada do produto.
     * Armazena até 1024 caracteres.
     */
    @Column(length = 1024)
    private String description;

    /**
     * Preço unitário de venda.
     * Deve ser um valor positivo e obrigatório.
     */
    @NotNull
    @Positive
    @Column(nullable = false)
    private BigDecimal price;

    /**
     * Categoria à qual o produto pertence.
     * Relacionamento Muitos-para-Um (vários produtos podem ter a mesma categoria).
     * Carregamento LAZY para otimização de performance.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /**
     * Descrição das mecânicas de jogo (ex: "Rolagem de dados", "Gestão de mão").
     */
    private String mechanics;

    /**
     * Quantidade de jogadores recomendada (ex: "2-5").
     * Corresponde ao campo "quantidade_jogadores" em integrações externas.
     */
    private String players;

    /**
     * Nome da editora responsável pelo jogo.
     */
    private String editor;

    /**
     * Indicador se o produto é promocional.
     */
    @NotNull
    @Column(nullable = false)
    private Boolean promo;

    /**
     * Quantidade atual em estoque.
     * Validado para não permitir valores negativos.
     */
    @NotNull
    @Min(value = 0, message = "O estoque não pode ser negativo.")
    @Column(nullable = false)
    private Integer stock;

    /**
     * URL da imagem principal do produto.
     * Corresponde ao campo "imagem_principal" em integrações externas.
     */
    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Lista de URLs de imagens secundárias do produto.
     * Armazenada em tabela auxiliar 'tb_product_images'.
     * Corresponde ao campo "outras_imagens" em integrações externas.
     */
    @ElementCollection
    @CollectionTable(name = "tb_product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> otherImages = new ArrayList<>();

    /**
     * Duração estimada da partida (ex: "30-60 min").
     */
    @Column(name = "duracao")
    private String duracao;

    /**
     * Faixa etária recomendada (ex: "14+").
     */
    @Column(name = "idade_recomendada")
    private String idadeRecomendada;
}