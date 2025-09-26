package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.repository.CategoryRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICategoryService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;


@Service
public class CategoryServiceImpl extends CrudServiceImpl<Category, Long> 
        implements ICategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    protected JpaRepository<Category, Long> getRepository() {
        return categoryRepository;
    }
}
/*public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;
    
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return this.categoryRepository.findAll();
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return this.categoryRepository.findAll(pageable);
    }

    @Override
    public Category save(Category category) {
        return this.categoryRepository.save(category);
    }

    @Override
    public Category findById(Long id) {
        return this.categoryRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        this.categoryRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return this.categoryRepository.existsById(id);
    }

    @Override
    public long count() {
        return this.categoryRepository.count();
    }
}*/
