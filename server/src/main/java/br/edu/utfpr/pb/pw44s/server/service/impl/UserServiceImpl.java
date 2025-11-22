package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.CartRepository; // <--- Importar
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.repository.WishlistRepository; // <--- Importar
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder; // <--- Importar Contexto
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl extends CrudServiceImpl<User, Long> implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    // Injetar repositórios dependentes
    private final WishlistRepository wishlistRepository;
    private final CartRepository cartRepository;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           OrderRepository orderRepository,
                           WishlistRepository wishlistRepository, // <--- Injeção
                           CartRepository cartRepository) {       // <--- Injeção
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderRepository = orderRepository;
        this.wishlistRepository = wishlistRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    protected JpaRepository<User, Long> getRepository() {
        return this.userRepository;
    }

    @Override
    public User save(User user) {
        // Só encripta se for novo usuário (evita re-hash em updates)
        if (user.getId() == null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return super.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuário não encontrado!");
        }
        return user;
    }

    @Override
    public void changePassword(User user, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual está incorreta.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }



    @Override
    @Transactional
    public void deleteById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            // 1. Limpar Wishlist (Dependência direta que causa o erro 23503)
            wishlistRepository.deleteByUserId(user.getId());

            // 2. Limpar Carrinho (Se existir)
            cartRepository.deleteByUserId(user.getId());

            // 3. Desvincular Pedidos (Histórico deve ser mantido, mas sem o User)
            // Isso evita erro se houver FK em TB_ORDER -> TB_USER
            if (user.getOrders() != null) {
                for (Order order : user.getOrders()) {
                    order.setUser(null);
                    orderRepository.save(order);
                }
            }

            // 4. Finalmente, deletar o Usuário
            userRepository.delete(user);
        }
    }
}