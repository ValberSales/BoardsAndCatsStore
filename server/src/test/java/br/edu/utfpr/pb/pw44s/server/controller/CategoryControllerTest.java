package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CategoryDTO;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.service.ICategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private ICategoryService categoryService;

    @TestConfiguration
    static class TestConfig {
        @Bean public ModelMapper modelMapper() { return new ModelMapper(); }
    }

    @Test
    @DisplayName("Deve listar todas as categorias")
    void findAll_ShouldReturnList() throws Exception {
        Category category = new Category();
        category.setId(1L);
        category.setName("Jogos de Tabuleiro");

        when(categoryService.findAll()).thenReturn(List.of(category));

        mockMvc.perform(get("/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Jogos de Tabuleiro"));
    }

    @Test
    @DisplayName("Deve criar uma nova categoria")
    void create_ShouldReturnCreated() throws Exception {
        CategoryDTO dto = new CategoryDTO();
        dto.setName("Card Games");

        Category savedCategory = new Category();
        savedCategory.setId(1L);
        savedCategory.setName("Card Games");

        when(categoryService.save(any(Category.class))).thenReturn(savedCategory);

        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @DisplayName("Deve buscar categoria por ID")
    void findOne_ShouldReturnCategory() throws Exception {
        Category category = new Category();
        category.setId(1L);
        category.setName("RPG");

        when(categoryService.findById(1L)).thenReturn(category);

        mockMvc.perform(get("/categories/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("RPG"));
    }

    @Test
    @DisplayName("Deve deletar categoria")
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(categoryService).deleteById(1L);

        mockMvc.perform(delete("/categories/{id}", 1L))
                .andExpect(status().isNoContent());
    }
}