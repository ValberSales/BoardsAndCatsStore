package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.service.IShippingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShippingController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class ShippingControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private IShippingService shippingService;

    @Test
    @DisplayName("Deve retornar o valor")
    void calculate_ShouldReturnValue() throws Exception {
        when(shippingService.calculateShipping(anyString(), anyDouble()))
                .thenReturn(new BigDecimal("20.50"));

        mockMvc.perform(get("/shipping/calculate")
                        .param("cep", "85500000")
                        .param("weight", "1.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(20.50));
    }
}