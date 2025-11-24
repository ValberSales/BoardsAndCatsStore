package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.service.IShippingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class ShippingServiceImpl implements IShippingService {

    @Override
    public BigDecimal calculateShipping(String state) {
        if (state == null || state.trim().isEmpty()) {
            return BigDecimal.ZERO;
        }

        String uf = state.toUpperCase().trim();

        // Paraná
        if (uf.equals("PR")) {
            return new BigDecimal("15.90");
        }

        // Sul (Exceto PR)
        List<String> south = Arrays.asList("RS", "SC");
        if (south.contains(uf)) {
            return new BigDecimal("20.90");
        }

        // Sudeste
        List<String> southeast = Arrays.asList("SP", "RJ", "MG", "ES");
        if (southeast.contains(uf)) {
            return new BigDecimal("25.90");
        }

        // Resto do Brasil (Norte, Nordeste, Centro-Oeste)
        return new BigDecimal("30.90");
    }
}