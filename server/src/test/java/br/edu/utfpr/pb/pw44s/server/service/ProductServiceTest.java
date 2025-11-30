package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.ProductServiceImpl;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("Deve salvar produto com sucesso")
    void save_ShouldReturnProduct() {
        Product product = new Product();
        product.setName("Catan");
        product.setPrice(new BigDecimal("250.00"));

        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.save(product);

        assertThat(result.getName()).isEqualTo("Catan");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Deve buscar todos os produtos")
    void findAll_ShouldReturnList() {
        when(productRepository.findAll()).thenReturn(List.of(new Product()));

        List<Product> result = productService.findAll();

        assertThat(result).isNotEmpty();
    }

    @Test
    @DisplayName("Deve buscar produto por ID")
    void findById_ShouldReturnProduct() {
        Long id = 1L;
        Product product = new Product();
        product.setId(id);

        when(productRepository.findById(id)).thenReturn(Optional.of(product));

        Product result = productService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("Deve buscar produtos paginados")
    void findAllPageable_ShouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(new Product()));

        when(productRepository.findAll(pageable)).thenReturn(page);

        Page<Product> result = productService.findAll(pageable);

        assertThat(result).isNotEmpty();
    }


    @Test
    @DisplayName("Deve buscar produtos por Categoria")
    void findAllByCategoryId_ShouldReturnList() {
        Long categoryId = 1L;
        Product p1 = new Product();
        p1.setCategory(new Category());
        p1.getCategory().setId(categoryId);

        when(productRepository.findAllByCategoryId(categoryId)).thenReturn(List.of(p1));

        List<Product> result = productService.findAllByCategoryId(categoryId);

        assertThat(result).hasSize(1);
        verify(productRepository).findAllByCategoryId(categoryId);
    }

    @Test
    @DisplayName("Deve buscar produtos pelo termo de pesquisa (search)")
    void search_ShouldReturnMatches() {
        String query = "Catan";
        Product p1 = new Product();
        p1.setName("Catan");

        when(productRepository.search(query)).thenReturn(List.of(p1));

        List<Product> result = productService.search(query);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Catan");
        verify(productRepository).search(query);
    }
}