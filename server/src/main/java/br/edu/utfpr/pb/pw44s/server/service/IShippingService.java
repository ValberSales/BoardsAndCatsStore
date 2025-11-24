package br.edu.utfpr.pb.pw44s.server.service;

import java.math.BigDecimal;

public interface IShippingService {

    BigDecimal calculateShipping(String destCep, Double weight);
}