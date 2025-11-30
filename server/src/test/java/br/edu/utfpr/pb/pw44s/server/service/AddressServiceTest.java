package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.AddressServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private AddressServiceImpl addressService;

    @Test
    @DisplayName("Deve salvar um endereço vinculado a um usuário")
    void save_ShouldReturnSavedAddress() {
        // Given
        User user = new User();
        user.setId(1L);
        user.setUsername("user_teste");

        Address address = new Address();
        address.setStreet("Rua Teste");
        address.setNumber("123");
        address.setUser(user);

        Address savedAddress = new Address();
        savedAddress.setId(10L);
        savedAddress.setStreet("Rua Teste");
        savedAddress.setUser(user);

        when(addressRepository.save(any(Address.class))).thenReturn(savedAddress);

        // When
        Address result = addressService.save(address);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getUser()).isEqualTo(user);
        verify(addressRepository).save(address);
    }

    @Test
    @DisplayName("Deve buscar endereço por ID")
    void findById_ShouldReturnAddress() {
        Long id = 1L;
        Address address = new Address();
        address.setId(id);

        when(addressRepository.findById(id)).thenReturn(Optional.of(address));

        Address result = addressService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("Deve deletar endereço")
    void delete_ShouldCallRepository() {
        Long id = 1L;
        doNothing().when(addressRepository).deleteById(id);

        addressService.deleteById(id);

        verify(addressRepository).deleteById(id);
    }

    @Test
    @DisplayName("Deve listar todos os endereços")
    void findAll_ShouldReturnList() {
        when(addressRepository.findAll()).thenReturn(List.of(new Address()));

        List<Address> result = addressService.findAll();

        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
    }
}