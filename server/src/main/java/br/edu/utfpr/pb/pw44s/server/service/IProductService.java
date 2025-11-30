package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import java.util.List;

public interface IProductService extends ICrudService<Product, Long> {

    List<Product> findAllByCategoryId(Long categoryId);

    List<Product> search(String term);
}