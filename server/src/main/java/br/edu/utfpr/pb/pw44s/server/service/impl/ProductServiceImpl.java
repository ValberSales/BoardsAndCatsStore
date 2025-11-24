package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação da lógica de negócios para a entidade Produto.
 * Estende CrudServiceImpl para herdar operações padrão de CRUD e implementa IProductService
 * para fornecer funcionalidades específicas relacionadas a produtos.
 */
@Service
public class ProductServiceImpl extends CrudServiceImpl<Product, Long> implements IProductService {

    private final ProductRepository productRepository;

    /**
     * Construtor da classe que injeta o repositório de produtos.
     *
     * @param productRepository Repositório JPA para acesso aos dados de produtos.
     */
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Fornece a instância do repositório específico para a classe pai (CrudServiceImpl).
     * Isso permite que a classe genérica execute as operações de banco de dados na entidade Product.
     *
     * @return O repositório de produtos (ProductRepository).
     */
    @Override
    protected JpaRepository<Product, Long> getRepository() {
        return productRepository;
    }

    /**
     * Busca todos os produtos pertencentes a uma categoria específica.
     *
     * @param categoryId O identificador único (ID) da categoria.
     * @return Uma lista de entidades Product associadas à categoria fornecida.
     */
    @Override
    public List<Product> findAllByCategoryId(Long categoryId) {
        return this.productRepository.findAllByCategoryId(categoryId);
    }

    /**
     * Realiza uma busca textual por produtos com base em um termo.
     * O critério de busca é definido na query personalizada do repositório (geralmente nome ou descrição).
     *
     * @param term O termo ou frase a ser pesquisado.
     * @return Uma lista de entidades Product que correspondem ao termo de busca.
     */
    @Override
    public List<Product> search(String term) {
        return this.productRepository.search(term);
    }
}