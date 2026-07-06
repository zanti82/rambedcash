package com.rambed.rambedcash.categoria;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    List<Categoria> findByActivaTrue();

    List<Categoria> findByTipoMovimiento(Categoria.TipoMovimiento tipoMovimiento);

    boolean existsByNombre(String nombre);

    Optional<Categoria> findByNombre(String nombre);
}