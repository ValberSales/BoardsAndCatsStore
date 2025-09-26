package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {

//    //Select * from tb_category Where name LIKE '%te%'
//    List<Category> findByNameContaining(String name);
//
//    //Select * from tb_category Where name LIKE 'te%'
//    List<Category> findByNameStartingWith(String name);
//
//    @Query(value = "select * from tb_category where name LIKE :name",
//            nativeQuery = true)
//    List<Category> findByMeuFind(String name);
}
