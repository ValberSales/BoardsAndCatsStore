package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartSyncDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICartService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CartController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class CartControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockitoBean private ICartService cartService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }

    @Test
    @DisplayName("Deve retornar carrinho existente")
    void getCart_ShouldReturnOk() throws Exception {
        when(cartService.getAndValidateCart(any(User.class))).thenReturn(new CartResponseDTO());

        mockMvc.perform(get("/cart"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve retornar 204 No Content se carrinho vazio")
    void getCart_ShouldReturnNoContent() throws Exception {
        when(cartService.getAndValidateCart(any(User.class))).thenReturn(null);

        mockMvc.perform(get("/cart"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Deve salvar carrinho")
    void saveCart_ShouldReturnOk() throws Exception {
        CartSyncDTO syncDTO = new CartSyncDTO();
        syncDTO.setItems(Collections.emptyList());

        when(cartService.saveCart(any(User.class), any(CartSyncDTO.class)))
                .thenReturn(new CartResponseDTO());

        mockMvc.perform(put("/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(syncDTO)))
                .andExpect(status().isOk());
    }
}