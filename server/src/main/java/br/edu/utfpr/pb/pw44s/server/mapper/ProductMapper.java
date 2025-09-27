package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    private final CategoryMapper categoryMapper;

    public ProductMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public Product toEntity(ProductDTO dto) {
        Product entity = new Product();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setPromo(dto.getPromo());
        entity.setStock(dto.getStock());
        entity.setMechanics(dto.getMechanics());
        entity.setPlayers(dto.getPlayers());
        entity.setEditor(dto.getEditor());

        if (dto.getCategory() != null) {
            entity.setCategory(categoryMapper.toEntity(dto.getCategory()));
        }

        return entity;
    }

    public ProductDTO toDTO(Product entity) {
        ProductDTO dto = new ProductDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setPromo(entity.getPromo());
        dto.setStock(entity.getStock());
        dto.setMechanics(entity.getMechanics());
        dto.setPlayers(entity.getPlayers());
        dto.setEditor(entity.getEditor());

        if (entity.getCategory() != null) {
            dto.setCategory(categoryMapper.toDTO(entity.getCategory()));
        }

        return dto;
    }
}