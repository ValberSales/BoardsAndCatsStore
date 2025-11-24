package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.service.IShippingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("shipping")
public class ShippingController {

    private final IShippingService shippingService;

    public ShippingController(IShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @GetMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestParam String state) {
        BigDecimal value = shippingService.calculateShipping(state);
        return ResponseEntity.ok(Map.of("value", value));
    }
}