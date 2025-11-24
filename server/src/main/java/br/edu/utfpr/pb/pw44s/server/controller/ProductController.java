package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST responsável por gerenciar as operações relacionadas a Produtos.
 * Estende CrudController para fornecer funcionalidades básicas de CRUD (Create, Read, Update, Delete)
 * e adiciona endpoints específicos para busca e filtragem de produtos.
 */
@RestController
@RequestMapping("products")
public class ProductController extends CrudController<Product, ProductDTO, Long> {
    private final IProductService productService;
    private final ModelMapper modelMapper;

    /**
     * Construtor da classe que injeta as dependências necessárias.
     *
     * @param productService Serviço contendo a lógica de negócios para produtos.
     * @param modelMapper    Utilitário para mapeamento entre Entidades e DTOs.
     */
    public ProductController(IProductService productService, ModelMapper modelMapper) {
        super(Product.class, ProductDTO.class);
        this.productService = productService;
        this.modelMapper = modelMapper;
    }

    /**
     * Fornece a instância do serviço de produtos para a classe pai (CrudController).
     *
     * @return A instância de IProductService.
     */
    @Override
    protected ICrudService<Product, Long> getService() {
        return productService;
    }

    /**
     * Fornece a instância do ModelMapper para a classe pai (CrudController).
     *
     * @return A instância de ModelMapper.
     */
    @Override
    protected ModelMapper getModelMapper() {
        return modelMapper;
    }

    /**
     * Busca todos os produtos associados a uma categoria específica.
     *
     * @param id O identificador único (ID) da categoria.
     * @return Uma resposta HTTP contendo a lista de produtos (ProductDTO) daquela categoria.
     */
    @GetMapping("category/{id}")
    public ResponseEntity<List<ProductDTO>> findByCategoryId(@PathVariable Long id) {
        List<Product> products = productService.findAllByCategoryId(id);
        List<ProductDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(productDTOs);
    }

    /**
     * Realiza uma busca de produtos com base em um termo de pesquisa (query).
     * O termo é geralmente comparado com o nome ou descrição do produto.
     *
     * @param query O termo de pesquisa fornecido pelo usuário.
     * @return Uma resposta HTTP contendo a lista de produtos (ProductDTO) que correspondem à pesquisa.
     */
    @GetMapping("search")
    public ResponseEntity<List<ProductDTO>> search(@RequestParam("query") String query) {
        List<Product> products = productService.search(query);

        List<ProductDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(productDTOs);
    }
}