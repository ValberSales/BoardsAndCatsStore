package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.PaymentMethod;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.PaymentMethodRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.PaymentMethodServiceImpl;
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
class PaymentMethodServiceTest {

    @Mock
    private PaymentMethodRepository paymentMethodRepository;

    @InjectMocks
    private PaymentMethodServiceImpl paymentMethodService;

    @Test
    @DisplayName("Deve salvar um método de pagamento com sucesso")
    void save_ShouldReturnSavedPaymentMethod() {
        // Given
        User user = new User();
        user.setId(1L);

        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setDescription("Cartão Visa");
        paymentMethod.setType("CREDIT_CARD");
        paymentMethod.setUser(user);

        PaymentMethod savedPaymentMethod = new PaymentMethod();
        savedPaymentMethod.setId(1L);
        savedPaymentMethod.setDescription("Cartão Visa");
        savedPaymentMethod.setType("CREDIT_CARD");
        savedPaymentMethod.setUser(user);

        when(paymentMethodRepository.save(any(PaymentMethod.class))).thenReturn(savedPaymentMethod);

        // When
        PaymentMethod result = paymentMethodService.save(paymentMethod);

        // Then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getDescription()).isEqualTo("Cartão Visa");
        verify(paymentMethodRepository).save(any(PaymentMethod.class));
    }

    @Test
    @DisplayName("Deve buscar métodos de pagamento por ID do usuário")
    void findByUserId_ShouldReturnList() {
        Long userId = 1L;
        PaymentMethod pm1 = new PaymentMethod();
        pm1.setId(1L);
        pm1.setDescription("Pix");

        when(paymentMethodRepository.findByUserId(userId)).thenReturn(List.of(pm1));

        List<PaymentMethod> result = paymentMethodService.findByUserId(userId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDescription()).isEqualTo("Pix");
        verify(paymentMethodRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("Deve buscar método de pagamento por ID")
    void findById_ShouldReturnPaymentMethod() {
        Long id = 1L;
        PaymentMethod pm = new PaymentMethod();
        pm.setId(id);

        when(paymentMethodRepository.findById(id)).thenReturn(Optional.of(pm));

        PaymentMethod result = paymentMethodService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("Deve deletar método de pagamento")
    void delete_ShouldCallRepository() {
        Long id = 1L;
        doNothing().when(paymentMethodRepository).deleteById(id);

        paymentMethodService.deleteById(id);

        verify(paymentMethodRepository).deleteById(id);
    }

    @Test
    @DisplayName("Deve listar todos os métodos de pagamento (Admin)")
    void findAll_ShouldReturnList() {
        when(paymentMethodRepository.findAll()).thenReturn(List.of(new PaymentMethod()));

        List<PaymentMethod> result = paymentMethodService.findAll();

        assertThat(result).isNotEmpty();
    }
}