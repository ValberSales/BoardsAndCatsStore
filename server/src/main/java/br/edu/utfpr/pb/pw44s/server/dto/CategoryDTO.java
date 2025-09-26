package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryDTO {

    private Long id;
    
    @NotNull
    private String name;
    
}
