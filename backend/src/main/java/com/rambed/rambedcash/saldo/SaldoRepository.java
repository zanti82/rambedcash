package com.rambed.rambedcash.saldo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SaldoRepository extends JpaRepository<Saldo, Integer> {

    Saldo findTopByOrderByIdAsc();
}