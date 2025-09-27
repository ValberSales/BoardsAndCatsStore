package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.PaymentMethodDTO;
import br.edu.utfpr.pb.pw44s.server.model.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
public class PaymentMethodMapper {

    public PaymentMethod toEntity(PaymentMethodDTO dto) {
        PaymentMethod entity = new PaymentMethod();
        entity.setId(dto.getId());
        entity.setType(dto.getType());
        entity.setDescription(dto.getDescription());
        return entity;
    }

    public PaymentMethodDTO toDTO(PaymentMethod entity) {
        PaymentMethodDTO dto = new PaymentMethodDTO();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setDescription(entity.getDescription());
        return dto;
    }
}