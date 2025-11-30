package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartSyncDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;

public interface ICartService {

    /**
     * Busca o carrinho salvo, valida estoque/preço e atualiza se necessário.
     */
    CartResponseDTO getAndValidateCart(User user);

    /**
     * Sobrescreve o carrinho do usuário com os itens fornecidos.
     */
    CartResponseDTO saveCart(User user, CartSyncDTO cartSyncDTO);
}