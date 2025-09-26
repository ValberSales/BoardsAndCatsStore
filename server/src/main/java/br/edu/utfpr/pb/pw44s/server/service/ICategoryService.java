package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Category;

public interface ICategoryService extends ICrudService<Category, Long> {
}

/*public interface ICategoryService {
    List<Category> findAll();
    Page<Category> findAll(Pageable pageable);
    Category save(Category category);
    Category findById(Long id);
    void deleteById(Long id);
    boolean existsById(Long id);
    long count();
}*/
