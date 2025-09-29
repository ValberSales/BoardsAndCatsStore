package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemDTO {
    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}