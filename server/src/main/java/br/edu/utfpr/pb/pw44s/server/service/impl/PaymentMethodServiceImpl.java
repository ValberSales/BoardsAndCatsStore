package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.PaymentMethod;
import br.edu.utfpr.pb.pw44s.server.repository.PaymentMethodRepository;
import br.edu.utfpr.pb.pw44s.server.service.IPaymentMethodService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodServiceImpl extends CrudServiceImpl<PaymentMethod, Long> implements IPaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodServiceImpl(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    protected JpaRepository<PaymentMethod, Long> getRepository() {
        return paymentMethodRepository;
    }

    @Override
    public List<PaymentMethod> findByUserId(Long userId) {
        return paymentMethodRepository.findByUserId(userId);
    }
}