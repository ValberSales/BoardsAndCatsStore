package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("products")
public class ProductController extends CrudController<Product, ProductDTO, Long> {
    private final IProductService productService;
    private final ModelMapper modelMapper;

    public ProductController(IProductService productService, ModelMapper modelMapper) {
        super(Product.class, ProductDTO.class);
        this.productService = productService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Product, Long> getService() {
        return productService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return modelMapper;
    }

    @GetMapping("category/{id}")
    public ResponseEntity<List<ProductDTO>> findByCategoryId(@PathVariable Long id) {
        List<Product> products = productService.findAllByCategoryId(id);
        List<ProductDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(productDTOs);
    }
}