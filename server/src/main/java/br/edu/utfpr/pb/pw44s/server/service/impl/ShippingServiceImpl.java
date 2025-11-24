package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.MelhorEnvioDTO;
import br.edu.utfpr.pb.pw44s.server.service.IShippingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class ShippingServiceImpl implements IShippingService {

    private final RestTemplate restTemplate;

    @Value("${melhorenvio.sandbox.url}")
    private String baseUrl;

    @Value("${melhorenvio.token}")
    private String token;

    @Value("${melhorenvio.email}")
    private String email;

    @Value("${shipping.origin.cep}")
    private String originCep;

    public ShippingServiceImpl(RestTemplateBuilder restTemplateBuilder) {

        this.restTemplate = restTemplateBuilder
                .requestFactory(() -> {
                    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
                    factory.setConnectTimeout(5000);
                    factory.setReadTimeout(5000);
                    return factory;
                })
                .build();
    }

    @Override
    public BigDecimal calculateShipping(String destCep, Double weight) {
        if (destCep == null || destCep.length() < 8) {
            return BigDecimal.ZERO;
        }

        // Garante peso mínimo de 300g (0.3kg)
        double finalWeight = (weight == null || weight < 0.3) ? 0.3 : weight;

        try {
            MelhorEnvioDTO.CalculationRequest requestBody = buildRequest(destCep, finalWeight);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.setBearerAuth(token);
            headers.set("User-Agent", email);

            HttpEntity<MelhorEnvioDTO.CalculationRequest> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<List<MelhorEnvioDTO.ShipmentOption>> response = restTemplate.exchange(
                    baseUrl + "/me/shipment/calculate",
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<List<MelhorEnvioDTO.ShipmentOption>>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return findCheapestOption(response.getBody());
            }

        } catch (Exception e) {
            System.err.println("Erro na API de Frete: " + e.getMessage());

            return BigDecimal.ZERO;
        }

        return BigDecimal.ZERO;
    }

    private BigDecimal findCheapestOption(List<MelhorEnvioDTO.ShipmentOption> options) {
        return options.stream()

                .filter(opt -> opt.getPrice() != null && opt.getError() == null)

                .min(Comparator.comparing(MelhorEnvioDTO.ShipmentOption::getPrice))
                .map(MelhorEnvioDTO.ShipmentOption::getPrice)
                .orElse(BigDecimal.ZERO);
    }

    private MelhorEnvioDTO.CalculationRequest buildRequest(String destCep, double weight) {
        return MelhorEnvioDTO.CalculationRequest.builder()
                .from(MelhorEnvioDTO.From.builder().postalCode(originCep).build())
                .to(MelhorEnvioDTO.From.builder().postalCode(destCep).build())
                .options(MelhorEnvioDTO.Package.builder()
                        .weight(weight)
                        .width(20)
                        .height(20)
                        .length(20)
                        .insuranceValue(50.00)
                        .receipt(false)
                        .ownHand(false)
                        .build())
                .build();
    }
}