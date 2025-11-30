package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO principal para exibição de detalhes do Produto no catálogo.
 */
@Data
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Boolean promo;
    private Integer stock;
    private String mechanics;
    private String players;
    private String editor;
    private CategoryDTO category;
    private String imageUrl;
    private List<String> otherImages;
    private String duracao;
    private String idadeRecomendada;
}