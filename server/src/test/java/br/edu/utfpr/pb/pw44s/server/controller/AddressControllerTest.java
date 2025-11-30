package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AddressController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class AddressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private IAddressService addressService;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public ModelMapper modelMapper() {
            return new ModelMapper();
        }
    }

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("user_teste");

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContext securityContext = org.mockito.Mockito.mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("Deve criar endereço com sucesso (201 Created)")
    void create_ShouldReturnCreated() throws Exception {
        // GIVEN
        AddressDTO dto = new AddressDTO();
        dto.setStreet("Rua das Flores");
        dto.setNumber("123");
        dto.setZip("85501000");
        dto.setCity("Pato Branco");
        dto.setState("PR");
        dto.setNeighborhood("Centro");

        Address savedAddress = new Address();
        savedAddress.setId(10L);
        savedAddress.setStreet("Rua das Flores");
        savedAddress.setCity("Pato Branco");

        // Mock do serviço: quando chamar save(), retorne o endereço com ID 10
        when(addressService.save(any(Address.class))).thenReturn(savedAddress);

        // WHEN & THEN
        mockMvc.perform(post("/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated()) // Espera 201
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.city").value("Pato Branco"));
    }

    @Test
    @DisplayName("Deve listar apenas endereços do usuário logado")
    void findAll_ShouldReturnUserAddresses() throws Exception {
        Address address = new Address();
        address.setId(10L);
        address.setStreet("Rua Teste");

        // Mock do serviço retorna lista simulada
        when(addressService.findByUserId(user.getId())).thenReturn(List.of(address));

        mockMvc.perform(get("/addresses")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L));
    }

    @Test
    @DisplayName("Deve retornar detalhes do endereço se o usuário for o dono")
    void findOne_ShouldReturnAddress_WhenOwner() throws Exception {
        Address address = new Address();
        address.setId(10L);
        address.setUser(user); // O usuário logado é o dono

        when(addressService.findById(10L)).thenReturn(address);

        mockMvc.perform(get("/addresses/{id}", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L));
    }

    @Test
    @DisplayName("Deve retornar Forbidden (403) ao tentar acessar endereço de outro usuário")
    void findOne_ShouldReturnForbidden_WhenNotOwner() throws Exception {
        User otherUser = new User();
        otherUser.setId(99L); // ID diferente do logado (1L)

        Address address = new Address();
        address.setId(10L);
        address.setUser(otherUser); // Endereço pertence a outra pessoa

        when(addressService.findById(10L)).thenReturn(address);

        mockMvc.perform(get("/addresses/{id}", 10L))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Deve retornar NotFound (404) se o endereço não existir")
    void findOne_ShouldReturnNotFound() throws Exception {
        when(addressService.findById(999L)).thenReturn(null);

        mockMvc.perform(get("/addresses/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve atualizar endereço com sucesso")
    void update_ShouldReturnUpdatedAddress() throws Exception {
        AddressDTO dto = new AddressDTO();
        dto.setStreet("Rua Nova");
        dto.setNumber("456");
        dto.setZip("85502000");
        dto.setCity("Curitiba");
        dto.setState("PR");
        dto.setNeighborhood("Batel");

        Address existingAddress = new Address();
        existingAddress.setId(10L);
        existingAddress.setUser(user);

        Address updatedAddress = new Address();
        updatedAddress.setId(10L);
        updatedAddress.setStreet("Rua Nova");

        when(addressService.findById(10L)).thenReturn(existingAddress);
        when(addressService.save(any(Address.class))).thenReturn(updatedAddress);

        mockMvc.perform(put("/addresses/{id}", 10L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.street").value("Rua Nova"));
    }

    @Test
    @DisplayName("Deve deletar endereço se for o dono")
    void delete_ShouldReturnNoContent() throws Exception {
        Address address = new Address();
        address.setId(10L);
        address.setUser(user);

        when(addressService.findById(10L)).thenReturn(address);
        doNothing().when(addressService).deleteById(10L);

        mockMvc.perform(delete("/addresses/{id}", 10L))
                .andExpect(status().isNoContent());
    }
}