package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar uma Categoria de produtos.
 */
@Data
@NoArgsConstructor
public class CategoryDTO {

    private Long id;

    @NotNull
    @Size(min = 3, max = 255)
    private String name;
}