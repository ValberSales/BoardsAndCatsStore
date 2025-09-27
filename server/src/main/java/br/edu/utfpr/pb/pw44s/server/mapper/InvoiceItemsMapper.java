package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.InvoiceItemsDTO;
import br.edu.utfpr.pb.pw44s.server.model.InvoiceItems;
import org.springframework.stereotype.Component;

@Component
public class InvoiceItemsMapper {

    private final ProductMapper productMapper;

    public InvoiceItemsMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }


    public InvoiceItemsDTO toDTO(InvoiceItems entity) {
        InvoiceItemsDTO dto = new InvoiceItemsDTO();
        dto.setQuantity(entity.getQuantity());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setSubtotal(entity.getSubtotal());

        if (entity.getProduct() != null) {
            dto.setProduct(productMapper.toDTO(entity.getProduct()));
        }

        return dto;
    }
}