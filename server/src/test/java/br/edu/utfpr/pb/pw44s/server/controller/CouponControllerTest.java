package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.model.Coupon;
import br.edu.utfpr.pb.pw44s.server.repository.CouponRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CouponController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class CouponControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CouponRepository couponRepository;

    @Test
    @DisplayName("Deve validar cupom com sucesso")
    void validateCoupon_ShouldReturnOk() throws Exception {
        String code = "PROMO2025";
        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setActive(true);
        coupon.setValidUntil(LocalDate.now().plusDays(10)); // Válido
        coupon.setDiscountValue(new BigDecimal("15.00"));

        when(couponRepository.findByCode(code)).thenReturn(Optional.of(coupon));

        mockMvc.perform(get("/coupons/validate/{code}", code)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(code))
                .andExpect(jsonPath("$.percentage").value(15.00));
    }

    @Test
    @DisplayName("Deve retornar Bad Request se cupom não existir")
    void validateCoupon_ShouldReturnError_WhenNotFound() throws Exception {
        String code = "INVALIDO";
        when(couponRepository.findByCode(code)).thenReturn(Optional.empty());

        mockMvc.perform(get("/coupons/validate/{code}", code))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cupom inválido."));
    }

    @Test
    @DisplayName("Deve retornar Bad Request se cupom estiver inativo")
    void validateCoupon_ShouldReturnError_WhenInactive() throws Exception {
        String code = "INATIVO";
        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setActive(false); // Inativo

        when(couponRepository.findByCode(code)).thenReturn(Optional.of(coupon));

        mockMvc.perform(get("/coupons/validate/{code}", code))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cupom inválido."));
    }

    @Test
    @DisplayName("Deve retornar Bad Request se cupom estiver expirado")
    void validateCoupon_ShouldReturnError_WhenExpired() throws Exception {
        String code = "EXPIRADO";
        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setActive(true);
        coupon.setValidUntil(LocalDate.now().minusDays(1)); // Expirou ontem

        when(couponRepository.findByCode(code)).thenReturn(Optional.of(coupon));

        mockMvc.perform(get("/coupons/validate/{code}", code))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cupom expirado."));
    }
}