package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.InvoiceDTO;
import br.edu.utfpr.pb.pw44s.server.model.Invoice;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class InvoiceMapper {

    private final UserMapper userMapper;
    private final AddressMapper addressMapper;
    private final InvoiceItemsMapper invoiceItemsMapper;

    public InvoiceMapper(UserMapper userMapper, AddressMapper addressMapper, InvoiceItemsMapper invoiceItemsMapper) {
        this.userMapper = userMapper;
        this.addressMapper = addressMapper;
        this.invoiceItemsMapper = invoiceItemsMapper;
    }

    public InvoiceDTO toDTO(Invoice entity) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setStatus(entity.getStatus());
        dto.setTotal(entity.getTotal());
        dto.setTrackingCode(entity.getTrackingCode());

        if (entity.getUser() != null) {
            dto.setUser(userMapper.toDTO(entity.getUser()));
        }
        if (entity.getAddress() != null) {
            dto.setAddress(addressMapper.toDTO(entity.getAddress()));
        }
        if (entity.getItems() != null) {
            dto.setItems(
                    entity.getItems().stream()
                            .map(invoiceItemsMapper::toDTO)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}