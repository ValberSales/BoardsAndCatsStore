package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController extends CrudController<Address, AddressDTO, Long> {

    private final IAddressService addressService;
    private final ModelMapper modelMapper;

    public AddressController(IAddressService addressService, ModelMapper modelMapper) {
        super(Address.class, AddressDTO.class);
        this.addressService = addressService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Address, Long> getService() {
        return this.addressService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }


    @GetMapping("my")
    public ResponseEntity<List<AddressDTO>> findMyAddresses() {
        User user = getAuthenticatedUser();
        List<Address> addresses = addressService.findByUserId(user.getId());
        return ResponseEntity.ok(addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList()));
    }

    @Override
    @PostMapping
    public ResponseEntity<AddressDTO> create(@RequestBody @Valid AddressDTO dto) {
        User user = getAuthenticatedUser();
        Address address = modelMapper.map(dto, Address.class);
        address.setUser(user);
        Address savedAddress = addressService.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedAddress, AddressDTO.class));
    }

    @Override
    @GetMapping("{id}")
    public ResponseEntity<AddressDTO> findOne(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Address address = findAddressAndCheckOwner(id, user);
        return ResponseEntity.ok(modelMapper.map(address, AddressDTO.class));
    }

    @Override
    @PutMapping("{id}")
    public ResponseEntity<AddressDTO> update(@PathVariable Long id, @RequestBody @Valid AddressDTO dto) {
        User user = getAuthenticatedUser();
        findAddressAndCheckOwner(id, user);

        Address addressToUpdate = modelMapper.map(dto, Address.class);
        addressToUpdate.setId(id);
        addressToUpdate.setUser(user);

        Address updatedAddress = addressService.save(addressToUpdate);
        return ResponseEntity.ok(modelMapper.map(updatedAddress, AddressDTO.class));
    }

    @Override
    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        findAddressAndCheckOwner(id, user);
        addressService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private Address findAddressAndCheckOwner(Long addressId, User loggedUser) {
        Address address = addressService.findById(addressId);
        if (address == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Endereço não encontrado.");
        }
        if (!address.getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }
        return address;
    }
}