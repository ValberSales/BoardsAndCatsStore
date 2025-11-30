package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IWishlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WishlistController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class WishlistControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private IWishlistService wishlistService;

    @TestConfiguration
    static class TestConfig {
        @Bean public ModelMapper modelMapper() { return new ModelMapper(); }
    }

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
    }

    @Test
    void toggleWishlist_ShouldReturnTrue_WhenAdded() throws Exception {
        when(wishlistService.toggleProduct(any(User.class), eq(10L))).thenReturn(true);

        mockMvc.perform(post("/wishlist/{id}", 10L))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void getMyWishlist_ShouldReturnList() throws Exception {
        when(wishlistService.getWishlist(any(User.class))).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/wishlist"))
                .andExpect(status().isOk());
    }
}