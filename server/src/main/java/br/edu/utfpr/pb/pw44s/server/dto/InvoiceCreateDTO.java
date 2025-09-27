package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class InvoiceCreateDTO {

    @NotNull
    private Long addressId;

    @NotNull
    private Long paymentMethodId;

    @NotEmpty
    @Valid
    private List<InvoiceCreateItemDTO> items;
}