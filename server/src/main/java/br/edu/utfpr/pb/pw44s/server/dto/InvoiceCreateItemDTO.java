package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InvoiceCreateItemDTO {

    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}