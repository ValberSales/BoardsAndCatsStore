package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class InvoicePaymentEmbeddable {
    private String description; // Ex: "Cartão de Crédito - Visa final 4242"
}