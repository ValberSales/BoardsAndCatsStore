package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; // Import necessário para o Optional

public interface OrderRepository extends JpaRepository<Order, Long> {


    List<Order> findByUserId(Long userId);


    List<Order> findByStatus(OrderStatus status);


    Optional<Order> findTopByUserIdAndStatus(Long userId, OrderStatus status);


    List<Order> findByUserIdAndStatusNot(Long userId, OrderStatus status);
}