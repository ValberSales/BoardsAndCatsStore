package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.PaymentMethod;
import java.util.List;

public interface IPaymentMethodService extends ICrudService<PaymentMethod, Long> {

    List<PaymentMethod> findByUserId(Long userId);
}