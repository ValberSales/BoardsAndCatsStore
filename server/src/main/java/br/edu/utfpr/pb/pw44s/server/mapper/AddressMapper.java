package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(AddressDTO dto) {
        Address entity = new Address();
        entity.setId(dto.getId());
        entity.setStreet(dto.getStreet());
        entity.setCity(dto.getCity());
        entity.setState(dto.getState());
        entity.setZip(dto.getZip());
        entity.setComplement(dto.getComplement());
        return entity;
    }

    public AddressDTO toDTO(Address entity) {
        AddressDTO dto = new AddressDTO();
        dto.setId(entity.getId());
        dto.setStreet(entity.getStreet());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setZip(entity.getZip());
        dto.setComplement(entity.getComplement());
        return dto;
    }
}