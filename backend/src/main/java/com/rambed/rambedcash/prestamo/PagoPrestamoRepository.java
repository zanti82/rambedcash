package com.rambed.rambedcash.prestamo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoPrestamoRepository extends JpaRepository<PagoPrestamo, Integer> {

    List<PagoPrestamo> findByPrestamoIdOrderByFechaPagoDesc(Integer prestamoId);
}