package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.CategoryDTO;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryDTO dto) {
        Category entity = new Category();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }

    public CategoryDTO toDTO(Category entity) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }
}