package br.edu.utfpr.pb.pw44s.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTOs auxiliares para integração com a API externa do Melhor Envio (Cálculo de Frete).
 */
public class MelhorEnvioDTO {

    @Data
    @Builder
    public static class CalculationRequest {
        private From to;
        private From from;
        private Package options;
    }

    @Data
    @Builder
    public static class From {
        @JsonProperty("postal_code")
        private String postalCode;
    }

    @Data
    @Builder
    public static class Package {
        private double width;
        private double height;
        private double length;
        private double weight;
        @JsonProperty("insurance_value")
        private double insuranceValue;
        @JsonProperty("receipt")
        private boolean receipt;
        @JsonProperty("own_hand")
        private boolean ownHand;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShipmentOption {
        private int id;
        private String name;
        private BigDecimal price;
        @JsonProperty("delivery_time")
        private int deliveryTime;
        private Company company;
        private String error;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Company {
        private int id;
        private String name;
        private String picture;
    }
}