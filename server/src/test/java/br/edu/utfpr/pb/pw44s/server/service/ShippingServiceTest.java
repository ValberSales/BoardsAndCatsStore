package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.MelhorEnvioDTO;
import br.edu.utfpr.pb.pw44s.server.service.impl.ShippingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShippingServiceTest {

    @Mock
    private RestTemplateBuilder restTemplateBuilder;

    @Mock
    private RestTemplate restTemplate;

    private ShippingServiceImpl shippingService;

    @BeforeEach
    void setUp() {
        when(restTemplateBuilder.requestFactory(any(Supplier.class))).thenReturn(restTemplateBuilder);
        when(restTemplateBuilder.build()).thenReturn(restTemplate);

        shippingService = new ShippingServiceImpl(restTemplateBuilder);

        // Injeta valores simulados nos campos @Value usando Reflection
        ReflectionTestUtils.setField(shippingService, "baseUrl", "http://fake-api.com");
        ReflectionTestUtils.setField(shippingService, "token", "fake-token");
        ReflectionTestUtils.setField(shippingService, "email", "teste@email.com");
        ReflectionTestUtils.setField(shippingService, "originCep", "85501000");
    }

    @Test
    @DisplayName("Deve retornar a opção de frete mais barata")
    void calculateShipping_ShouldReturnCheapestOption() {
        // Given
        String destCep = "80000000";
        Double weight = 1.0;

        // Opção 1: Mais cara
        MelhorEnvioDTO.ShipmentOption opt1 = new MelhorEnvioDTO.ShipmentOption();
        opt1.setPrice(new BigDecimal("30.00"));

        // Opção 2: Mais barata
        MelhorEnvioDTO.ShipmentOption opt2 = new MelhorEnvioDTO.ShipmentOption();
        opt2.setPrice(new BigDecimal("15.50"));

        List<MelhorEnvioDTO.ShipmentOption> options = List.of(opt1, opt2);

        // Simula resposta da API
        ResponseEntity<List<MelhorEnvioDTO.ShipmentOption>> responseEntity =
                new ResponseEntity<>(options, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("http://fake-api.com/me/shipment/calculate"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                any(ParameterizedTypeReference.class)
        )).thenReturn(responseEntity);

        // When
        BigDecimal result = shippingService.calculateShipping(destCep, weight);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualByComparingTo("15.50");
    }

    @Test
    @DisplayName("Deve retornar ZERO se a API falhar ou lançar exceção")
    void calculateShipping_ShouldReturnZero_OnApiException() {
        // Given
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                any(ParameterizedTypeReference.class)
        )).thenThrow(new RestClientException("API indisponível"));

        // When
        BigDecimal result = shippingService.calculateShipping("80000000", 1.0);

        // Then
        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Deve retornar ZERO se CEP for inválido (não chama API)")
    void calculateShipping_ShouldReturnZero_WhenCepInvalid() {
        BigDecimal result = shippingService.calculateShipping(null, 1.0);
        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);

        result = shippingService.calculateShipping("123", 1.0);
        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Deve retornar ZERO se não houver opções de frete válidas")
    void calculateShipping_ShouldReturnZero_WhenNoOptions() {
        // Given
        ResponseEntity<List<MelhorEnvioDTO.ShipmentOption>> responseEntity =
                new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.POST), any(HttpEntity.class), any(ParameterizedTypeReference.class)
        )).thenReturn(responseEntity);

        // When
        BigDecimal result = shippingService.calculateShipping("80000000", 1.0);

        // Then
        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);
    }
}