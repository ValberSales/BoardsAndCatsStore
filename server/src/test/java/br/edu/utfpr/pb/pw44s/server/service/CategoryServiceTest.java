package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.repository.CategoryRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    @DisplayName("Deve salvar uma categoria com sucesso")
    void save_ShouldReturnSavedCategory() {
        Category category = new Category();
        category.setName("Board Games");

        Category savedCategory = new Category();
        savedCategory.setId(1L);
        savedCategory.setName("Board Games");

        when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);

        Category result = categoryService.save(category);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Board Games");
    }

    @Test
    @DisplayName("Deve listar todas as categorias")
    void findAll_ShouldReturnList() {
        Category c1 = new Category();
        c1.setId(1L);
        when(categoryRepository.findAll()).thenReturn(List.of(c1));

        List<Category> result = categoryService.findAll();

        assertThat(result).hasSize(1);
        verify(categoryRepository).findAll();
    }

    @Test
    @DisplayName("Deve listar categorias paginadas")
    void findAllPageable_ShouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> page = new PageImpl<>(List.of(new Category()));

        when(categoryRepository.findAll(pageable)).thenReturn(page);

        Page<Category> result = categoryService.findAll(pageable);

        assertThat(result).isNotEmpty();
        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve encontrar categoria por ID existente")
    void findById_ShouldReturnCategory() {
        Long id = 1L;
        Category category = new Category();
        category.setId(id);

        when(categoryRepository.findById(id)).thenReturn(Optional.of(category));

        Category result = categoryService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("Deve retornar null ao buscar ID inexistente")
    void findById_ShouldReturnNull_WhenNotFound() {
        Long id = 99L;
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        Category result = categoryService.findById(id);

        assertThat(result).isNull();
    }

    @Test
    @DisplayName("Deve deletar categoria por ID")
    void deleteById_ShouldCallRepository() {
        Long id = 1L;
        doNothing().when(categoryRepository).deleteById(id);

        categoryService.deleteById(id);

        verify(categoryRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Deve verificar se categoria existe")
    void exists_ShouldReturnTrue() {
        Long id = 1L;
        when(categoryRepository.existsById(id)).thenReturn(true);

        boolean exists = categoryService.exists(id);

        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Deve contar o total de categorias")
    void count_ShouldReturnTotal() {
        when(categoryRepository.count()).thenReturn(10L);

        long count = categoryService.count();

        assertThat(count).isEqualTo(10L);
    }
}