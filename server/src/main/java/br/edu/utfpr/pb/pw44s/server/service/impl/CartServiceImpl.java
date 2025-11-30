package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.CartItemResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CartSyncDTO;
import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Cart;
import br.edu.utfpr.pb.pw44s.server.model.CartItem;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.CartRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICartService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements ICartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public CartServiceImpl(CartRepository cartRepository,
                           ProductRepository productRepository,
                           ModelMapper modelMapper) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional
    public CartResponseDTO getAndValidateCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart == null) {
            return null;
        }

        List<CartItemResponseDTO> responseItems = new ArrayList<>();
        List<CartItem> itemsToRemove = new ArrayList<>();
        boolean needsSave = false;

        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);

            // Se produto não existe ou estoque zerado, marca para remover
            if (product == null || product.getStock() == 0) {
                itemsToRemove.add(item);
                needsSave = true;
                continue;
            }

            // Valida e prepara o item para resposta
            CartItemResponseDTO itemDTO = validarEConverterItem(item, product);

            // Se houve mensagem de validação (preço mudou ou estoque baixou), precisa salvar
            if (itemDTO.getValidationMessage() != null) {
                needsSave = true;
            }

            responseItems.add(itemDTO);
        }

        // Aplica as remoções
        if (!itemsToRemove.isEmpty()) {
            cart.getItems().removeAll(itemsToRemove);
            needsSave = true;
        }

        // Salva ou deleta se ficou vazio
        if (needsSave) {
            if (cart.getItems().isEmpty()) {
                cartRepository.delete(cart);
                return null;
            }
            cartRepository.save(cart);
        }

        return montarRespostaCarrinho(cart, responseItems);
    }

    @Override
    @Transactional
    public CartResponseDTO saveCart(User user, CartSyncDTO cartSyncDTO) {
        Cart cart = cartRepository.findByUserId(user.getId()).orElse(new Cart());
        cart.setUser(user);
        cart.getItems().clear(); // Limpa itens antigos para sobrescrever

        List<CartItemResponseDTO> responseItems = new ArrayList<>();

        for (var itemDTO : cartSyncDTO.getItems()) {
            // Busca produto
            Product product = productRepository.findById(itemDTO.getProductId()).orElse(null);

            if (product == null || product.getStock() == 0) {
                continue; // Ignora produtos inválidos
            }

            // Cria novo item
            CartItem newItem = criarNovoItem(cart, product, itemDTO.getQuantity());
            cart.getItems().add(newItem);

            // Prepara resposta
            CartItemResponseDTO responseItem = new CartItemResponseDTO();
            responseItem.setProduct(modelMapper.map(product, ProductDTO.class));
            responseItem.setQuantity(newItem.getQuantity());
            responseItem.setPriceAtSave(newItem.getPriceAtSave());

            responseItems.add(responseItem);
        }

        if (cart.getItems().isEmpty()) {
            if (cart.getId() != null) cartRepository.delete(cart);
            return null;
        }

        cartRepository.save(cart);
        return montarRespostaCarrinho(cart, responseItems);
    }

    // ===================================================================================
    // MÉTODOS AUXILIARES
    // ===================================================================================

    private CartItemResponseDTO validarEConverterItem(CartItem item, Product product) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setProduct(modelMapper.map(product, ProductDTO.class));
        dto.setPriceAtSave(item.getPriceAtSave());
        dto.setQuantity(item.getQuantity());

        // Valida Preço
        if (product.getPrice().compareTo(item.getPriceAtSave()) != 0) {
            item.setPriceAtSave(product.getPrice());
            dto.setPriceAtSave(product.getPrice());
            dto.setValidationMessage("Preço atualizado.");
        }

        // Valida Estoque
        if (product.getStock() < item.getQuantity()) {
            item.setQuantity(product.getStock());
            dto.setQuantity(product.getStock());
            dto.setValidationMessage("Quantidade ajustada ao estoque.");
        }

        return dto;
    }

    private CartItem criarNovoItem(Cart cart, Product product, int quantidadeSolicitada) {
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductId(product.getId());

        // Garante que não pede mais que o estoque
        int quantidadeFinal = Math.min(quantidadeSolicitada, product.getStock());

        item.setQuantity(quantidadeFinal);
        item.setPriceAtSave(product.getPrice());
        return item;
    }

    private CartResponseDTO montarRespostaCarrinho(Cart cart, List<CartItemResponseDTO> items) {
        BigDecimal total = BigDecimal.ZERO;

        for (CartItemResponseDTO item : items) {
            BigDecimal subtotal = item.getPriceAtSave().multiply(new BigDecimal(item.getQuantity()));
            total = total.add(subtotal);
        }

        CartResponseDTO responseDTO = new CartResponseDTO();
        responseDTO.setId(cart.getId());
        responseDTO.setItems(items);
        responseDTO.setTotal(total);
        return responseDTO;
    }
}