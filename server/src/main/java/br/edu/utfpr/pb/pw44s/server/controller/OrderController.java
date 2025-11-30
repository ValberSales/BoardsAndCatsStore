package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CheckoutDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController {

    private final IOrderService orderService;
    private final ModelMapper modelMapper;

    public OrderController(IOrderService orderService, ModelMapper modelMapper) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("checkout")
    public ResponseEntity<OrderDTO> checkout(@RequestBody @Valid CheckoutDTO checkoutDTO,
                                             @AuthenticationPrincipal User user) {
        Order finalizedOrder = orderService.checkoutFromCart(checkoutDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(finalizedOrder, OrderDTO.class));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> findMyOrders(@AuthenticationPrincipal User user) {
        List<Order> orders = orderService.findFinalizedByUserId(user.getId());
        List<OrderDTO> dtos = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("{id}")
    public ResponseEntity<OrderDTO> findOne(@PathVariable Long id,
                                            @AuthenticationPrincipal User user) {
        Order order = findOrderAndCheckOwner(id, user);
        return ResponseEntity.ok(modelMapper.map(order, OrderDTO.class));
    }

    @PostMapping("{id}/cancel")
    public ResponseEntity<OrderDTO> cancel(@PathVariable Long id,
                                           @AuthenticationPrincipal User user) {
        findOrderAndCheckOwner(id, user);
        Order canceledOrder = orderService.cancel(id);
        return ResponseEntity.ok(modelMapper.map(canceledOrder, OrderDTO.class));
    }

    private Order findOrderAndCheckOwner(Long orderId, User loggedUser) {
        Order order = orderService.findById(orderId);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
        }
        if (!order.getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }
        return order;
    }
}