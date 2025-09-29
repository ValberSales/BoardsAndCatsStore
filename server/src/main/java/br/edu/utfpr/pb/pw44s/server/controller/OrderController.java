package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.*;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
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
@RequestMapping("orders")
public class OrderController {

    private final IOrderService orderService;
    private final ModelMapper modelMapper;

    public OrderController(IOrderService orderService, ModelMapper modelMapper) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
    }

    //Endpoints do Carrinho (CART)
    @GetMapping("cart")
    public ResponseEntity<OrderDTO> getCart() {
        User user = getAuthenticatedUser();
        Order cart = orderService.getCart(user);
        if (cart == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(modelMapper.map(cart, OrderDTO.class));
    }

    @PostMapping("cart/items")
    public ResponseEntity<OrderDTO> addItemToCart(@RequestBody @Valid CartItemDTO cartItemDTO) {
        User user = getAuthenticatedUser();
        Order updatedCart = orderService.addItemToCart(cartItemDTO, user);
        return ResponseEntity.ok(modelMapper.map(updatedCart, OrderDTO.class));
    }

    @PutMapping("cart/items/{productId}")
    public ResponseEntity<OrderDTO> updateItemQuantity(@PathVariable Long productId,
                                                       @RequestBody @Valid CartItemDTO cartItemDTO) {
        User user = getAuthenticatedUser();
        Order updatedCart = orderService.updateItemQuantity(productId, cartItemDTO, user);
        return ResponseEntity.ok(modelMapper.map(updatedCart, OrderDTO.class));
    }

    @DeleteMapping("cart/items/{productId}")
    public ResponseEntity<OrderDTO> removeItemFromCart(@PathVariable Long productId) {
        User user = getAuthenticatedUser();
        Order updatedCart = orderService.removeItemFromCart(productId, user);
        return ResponseEntity.ok(modelMapper.map(updatedCart, OrderDTO.class));
    }

    @DeleteMapping("cart")
    public ResponseEntity<Void> clearCart() {
        User user = getAuthenticatedUser();
        orderService.clearCart(user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("cart/checkout")
    public ResponseEntity<OrderDTO> checkout(@RequestBody @Valid CheckoutDTO checkoutDTO) {
        User user = getAuthenticatedUser();
        Order finalizedOrder = orderService.checkout(checkoutDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(finalizedOrder, OrderDTO.class));
    }

    //Endpoints de Pedidos Finalizados (ORDER)
    @GetMapping
    public ResponseEntity<List<OrderDTO>> findMyOrders() {
        User user = getAuthenticatedUser();
        List<Order> orders = orderService.findFinalizedByUserId(user.getId());
        List<OrderDTO> dtos = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("{id}")
    public ResponseEntity<OrderDTO> findOne(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Order order = findOrderAndCheckOwner(id, user);
        return ResponseEntity.ok(modelMapper.map(order, OrderDTO.class));
    }

    @PostMapping("{id}/cancel")
    public ResponseEntity<OrderDTO> cancel(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        findOrderAndCheckOwner(id, user);
        Order canceledOrder = orderService.cancel(id);
        return ResponseEntity.ok(modelMapper.map(canceledOrder, OrderDTO.class));
    }

    //Métodos de Apoio
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private Order findOrderAndCheckOwner(Long orderId, User loggedUser) {
        Order order = orderService.findById(orderId);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
        }
        if (!order.getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }
        if (order.getStatus().equals(OrderStatus.CART)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operação não permitida em um carrinho.");
        }
        return order;
    }

}