package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class InvoiceAddressEmbeddable {
    private String street;
    private String city;
    private String state;
    private String zip;
}