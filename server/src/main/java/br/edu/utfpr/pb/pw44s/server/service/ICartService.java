package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartSyncDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;

public interface ICartService {

    /**
     * Busca o carrinho salvo do usuário e o valida contra o estoque/preço atual.
     * @param user O usuário autenticado.
     * @return Um DTO com o carrinho validado, ou null se não houver carrinho.
     */
    CartResponseDTO getAndValidateCart(User user);

    /**
     * Salva (sobrescreve) o carrinho inteiro do usuário.
     * @param user O usuário autenticado.
     * @param cartSyncDTO O DTO contendo a lista de itens do frontend.
     * @return Um DTO com o carrinho salvo e validado.
     */
    CartResponseDTO saveCart(User user, CartSyncDTO cartSyncDTO);
}