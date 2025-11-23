package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(p.editor) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(p.mechanics) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Product> search(@Param("term") String term);
}