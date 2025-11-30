package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import java.util.List;

public interface IWishlistService {

    /**
     * @return true se adicionou, false se removeu.
     */
    boolean toggleProduct(User user, Long productId);

    boolean isProductInWishlist(User user, Long productId);

    List<Product> getWishlist(User user);
}