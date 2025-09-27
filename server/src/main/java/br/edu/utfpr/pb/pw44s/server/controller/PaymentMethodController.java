package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.PaymentMethodDTO;
import br.edu.utfpr.pb.pw44s.server.model.PaymentMethod;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IPaymentMethodService;
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
@RequestMapping("payment-methods")
public class PaymentMethodController extends CrudController<PaymentMethod, PaymentMethodDTO, Long> {

    private final IPaymentMethodService paymentMethodService;
    private final ModelMapper modelMapper;

    public PaymentMethodController(IPaymentMethodService paymentMethodService, ModelMapper modelMapper) {
        super(PaymentMethod.class, PaymentMethodDTO.class);
        this.paymentMethodService = paymentMethodService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<PaymentMethod, Long> getService() {
        return this.paymentMethodService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }

    @GetMapping("my")
    public ResponseEntity<List<PaymentMethodDTO>> findMyPaymentMethods() {
        User user = getAuthenticatedUser();
        List<PaymentMethod> paymentMethods = paymentMethodService.findByUserId(user.getId());
        return ResponseEntity.ok(paymentMethods.stream()
                .map(pm -> modelMapper.map(pm, PaymentMethodDTO.class))
                .collect(Collectors.toList()));
    }

    @Override
    @PostMapping
    public ResponseEntity<PaymentMethodDTO> create(@RequestBody @Valid PaymentMethodDTO dto) {
        User user = getAuthenticatedUser();
        PaymentMethod entity = modelMapper.map(dto, PaymentMethod.class);
        entity.setUser(user);
        PaymentMethod savedEntity = paymentMethodService.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedEntity, PaymentMethodDTO.class));
    }

    @Override
    @GetMapping("{id}")
    public ResponseEntity<PaymentMethodDTO> findOne(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        PaymentMethod entity = findPaymentMethodAndCheckOwner(id, user);
        return ResponseEntity.ok(modelMapper.map(entity, PaymentMethodDTO.class));
    }

    @Override
    @PutMapping("{id}")
    public ResponseEntity<PaymentMethodDTO> update(@PathVariable Long id, @RequestBody @Valid PaymentMethodDTO dto) {
        User user = getAuthenticatedUser();
        findPaymentMethodAndCheckOwner(id, user);

        PaymentMethod entityToUpdate = modelMapper.map(dto, PaymentMethod.class);
        entityToUpdate.setId(id);
        entityToUpdate.setUser(user);

        PaymentMethod updatedEntity = paymentMethodService.save(entityToUpdate);
        return ResponseEntity.ok(modelMapper.map(updatedEntity, PaymentMethodDTO.class));
    }

    @Override
    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        findPaymentMethodAndCheckOwner(id, user);
        paymentMethodService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private PaymentMethod findPaymentMethodAndCheckOwner(Long paymentMethodId, User loggedUser) {
        PaymentMethod entity = paymentMethodService.findById(paymentMethodId);
        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Método de Pagamento não encontrado.");
        }
        if (!entity.getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }
        return entity;
    }
}