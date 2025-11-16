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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    /**
     * Lógica para o GET /cart
     * Busca o carrinho, valida cada item contra o banco, atualiza preços/estoque
     * e retorna o carrinho limpo para o usuário.
     */
    @Override
    @Transactional
    public CartResponseDTO getAndValidateCart(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(user.getId());
        if (cartOpt.isEmpty()) {
            return null; // Nenhum carrinho salvo
        }

        Cart cart = cartOpt.get();
        boolean needsSave = false; // Flag para salvar se houverem mudanças
        List<CartItemResponseDTO> responseItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        // Lista para guardar itens a serem removidos (ex: estoque esgotado)
        List<CartItem> itemsToRemove = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            Optional<Product> productOpt = productRepository.findById(item.getProductId());
            CartItemResponseDTO itemDTO = new CartItemResponseDTO();

            if (productOpt.isEmpty()) {
                // Produto não existe mais, marcar para remoção
                itemsToRemove.add(item);
                needsSave = true;
                continue;
            }

            Product product = productOpt.get();
            itemDTO.setProduct(modelMapper.map(product, ProductDTO.class));

            // 1. Validação de Preço
            if (product.getPrice().compareTo(item.getPriceAtSave()) != 0) {
                item.setPriceAtSave(product.getPrice());
                itemDTO.setValidationMessage("Preço atualizado.");
                needsSave = true;
            }
            itemDTO.setPriceAtSave(item.getPriceAtSave());

            // 2. Validação de Estoque
            if (product.getStock() == 0) {
                itemsToRemove.add(item); // Remove se estoque é 0
                needsSave = true;
                continue; // Não adiciona ao DTO de resposta
            } else if (product.getStock() < item.getQuantity()) {
                item.setQuantity(product.getStock());
                itemDTO.setValidationMessage("Quantidade ajustada ao estoque.");
                needsSave = true;
            }
            itemDTO.setQuantity(item.getQuantity());

            // Calcular subtotal e adicionar ao total
            BigDecimal subtotal = item.getPriceAtSave().multiply(new BigDecimal(item.getQuantity()));
            total = total.add(subtotal);
            responseItems.add(itemDTO);
        }

        // Efetivar remoções e salvar mudanças
        if (!itemsToRemove.isEmpty()) {
            cart.getItems().removeAll(itemsToRemove);
        }
        if (needsSave) {
            cartRepository.save(cart);
        }

        // Se o carrinho ficou vazio após a limpeza, remove ele do banco
        if (responseItems.isEmpty()) {
            cartRepository.delete(cart);
            return null;
        }

        // Montar DTO de Resposta
        CartResponseDTO responseDTO = new CartResponseDTO();
        responseDTO.setId(cart.getId());
        responseDTO.setItems(responseItems);
        responseDTO.setTotal(total);

        return responseDTO;
    }

    /**
     * Lógica para o PUT /cart
     * Recebe o carrinho do front, busca os produtos, valida estoque,
     * e sobrescreve o carrinho salvo no banco.
     */
    @Override
    @Transactional
    public CartResponseDTO saveCart(User user, CartSyncDTO cartSyncDTO) {
        // 1. Busca produtos reais para validar e pegar preços
        List<Long> productIds = cartSyncDTO.getItems().stream()
                .map(item -> item.getProductId())
                .collect(Collectors.toList());

        // Busca todos os produtos de uma vez para melhor performance
        Map<Long, Product> productMap = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, product -> product));

        // 2. Encontra o carrinho existente ou cria um novo
        Cart cart = cartRepository.findByUserId(user.getId()).orElse(new Cart());
        cart.setUser(user);

        // 3. Limpa os itens antigos (lógica de sobrescrever)
        cart.getItems().clear();

        BigDecimal total = BigDecimal.ZERO;
        List<CartItemResponseDTO> responseItems = new ArrayList<>();

        // 4. Mapeia os DTOs de entrada para Entidades CartItem
        for (var itemDTO : cartSyncDTO.getItems()) {
            Product product = productMap.get(itemDTO.getProductId());

            // Se o produto não for encontrado (ID inválido) ou não tiver estoque, ignora
            if (product == null || product.getStock() == 0) {
                continue;
            }

            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductId(product.getId());

            // Valida estoque
            int quantity = itemDTO.getQuantity();
            if (product.getStock() < quantity) {
                quantity = product.getStock(); // Limita ao estoque disponível
            }
            newItem.setQuantity(quantity);
            newItem.setPriceAtSave(product.getPrice()); // Pega o preço atual do banco

            cart.getItems().add(newItem);

            // Prepara o DTO de resposta para o front
            CartItemResponseDTO itemResponse = new CartItemResponseDTO();
            itemResponse.setProduct(modelMapper.map(product, ProductDTO.class));
            itemResponse.setQuantity(quantity);
            itemResponse.setPriceAtSave(product.getPrice());
            responseItems.add(itemResponse);

            // Calcula o total
            total = total.add(product.getPrice().multiply(new BigDecimal(quantity)));
        }

        // 5. Salvar ou Excluir
        // Se o carrinho ficou vazio (ex: todos os produtos eram inválidos)
        if (cart.getItems().isEmpty()) {
            if (cart.getId() != null) {
                cartRepository.delete(cart); // Deleta carrinho existente se ficou vazio
            }
            return null; // Retorna nulo, pois não há carrinho
        }

        Cart savedCart = cartRepository.save(cart);

        // 6. Montar DTO de Resposta
        CartResponseDTO responseDTO = new CartResponseDTO();
        responseDTO.setId(savedCart.getId());
        responseDTO.setItems(responseItems);
        responseDTO.setTotal(total);

        return responseDTO;
    }
}