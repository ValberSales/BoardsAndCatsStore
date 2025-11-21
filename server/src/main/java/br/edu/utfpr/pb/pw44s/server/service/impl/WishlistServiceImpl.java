package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.model.Wishlist;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.repository.WishlistRepository;
import br.edu.utfpr.pb.pw44s.server.service.IWishlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistServiceImpl implements IWishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public boolean toggleProduct(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Optional<Wishlist> existingEntry = wishlistRepository.findByUserAndProduct(user, product);

        if (existingEntry.isPresent()) {
            wishlistRepository.delete(existingEntry.get());
            return false; // Removeu
        } else {
            wishlistRepository.save(new Wishlist(user, product));
            return true; // Adicionou
        }
    }

    @Override
    public boolean isProductInWishlist(User user, Long productId) {
        // Cria um objeto produto apenas com ID para evitar consulta desnecessária ao banco
        // se o JPA/Hibernate estiver configurado para aceitar referência por ID.
        // Caso contrário, podemos usar productRepository.findById(productId) se necessário.
        Product product = new Product();
        product.setId(productId);

        return wishlistRepository.findByUserAndProduct(user, product).isPresent();
    }

    @Override
    public List<Product> getWishlist(User user) {
        return wishlistRepository.findAllProductsByUser(user);
    }
}