package com.rambed.rambedcash.prestamo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestamoRepository extends JpaRepository<Prestamo, Integer> {

    List<Prestamo> findByActivoTrue();

    List<Prestamo> findByActivoFalse();
}