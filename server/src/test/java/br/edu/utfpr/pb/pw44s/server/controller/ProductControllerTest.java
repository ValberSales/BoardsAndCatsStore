package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private IProductService productService;

    @TestConfiguration
    static class TestConfig {
        @Bean public ModelMapper modelMapper() { return new ModelMapper(); }
    }

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Catan");
        product.setPrice(new BigDecimal("250.00"));
        product.setCategory(new Category());
        product.getCategory().setId(10L);
    }

    @Test
    @DisplayName("Deve listar todos os produtos")
    void findAll_ShouldReturnList() throws Exception {
        when(productService.findAll()).thenReturn(List.of(product));

        mockMvc.perform(get("/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Catan"));
    }

    @Test
    @DisplayName("Deve criar produto com sucesso")
    void create_ShouldReturnCreated() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Catan");
        dto.setPrice(new BigDecimal("250.00"));

        when(productService.save(any(Product.class))).thenReturn(product);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @DisplayName("Deve buscar produtos por Categoria")
    void findByCategoryId_ShouldReturnList() throws Exception {
        when(productService.findAllByCategoryId(10L)).thenReturn(List.of(product));

        mockMvc.perform(get("/products/category/{id}", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    @DisplayName("Deve buscar produtos por termo (search)")
    void search_ShouldReturnList() throws Exception {
        when(productService.search(anyString())).thenReturn(List.of(product));

        mockMvc.perform(get("/products/search")
                        .param("query", "Catan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Catan"));
    }
}