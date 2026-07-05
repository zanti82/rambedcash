package com.rambed.rambedcash.saldo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import com.rambed.rambedcash.movimiento.Movimiento;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaldoService {

    private final SaldoRepository saldoRepository;

    public Saldo obtenerSaldo() {
        return saldoRepository.findTopByOrderByIdAsc();
    }

    public void actualizarSaldo(
            Movimiento.Tipo tipo,
            Movimiento.MedioPago medioPago,
            BigDecimal valor) {

        Saldo saldo = obtenerSaldo();

        if (tipo == Movimiento.Tipo.INGRESO) {
            if (medioPago == Movimiento.MedioPago.EFECTIVO) {
                saldo.setSaldoEfectivo(saldo.getSaldoEfectivo().add(valor));
            }
            if (medioPago == Movimiento.MedioPago.BANCO) {
                saldo.setSaldoBanco(saldo.getSaldoBanco().add(valor));
            }
        }

        if (tipo == Movimiento.Tipo.EGRESO) {
            if (medioPago == Movimiento.MedioPago.EFECTIVO) {
                saldo.setSaldoEfectivo(saldo.getSaldoEfectivo().subtract(valor));
            }
            if (medioPago == Movimiento.MedioPago.BANCO) {
                saldo.setSaldoBanco(saldo.getSaldoBanco().subtract(valor));
            }
        }

        saldo.setFechaActualizacion(LocalDateTime.now());
        saldoRepository.save(saldo);
    }

    public void revertirSaldo(
            Movimiento.Tipo tipo,
            Movimiento.MedioPago medioPago,
            BigDecimal valor) {

        if (tipo == Movimiento.Tipo.INGRESO) {
            actualizarSaldo(Movimiento.Tipo.EGRESO, medioPago, valor);
        }

        if (tipo == Movimiento.Tipo.EGRESO) {
            actualizarSaldo(Movimiento.Tipo.INGRESO, medioPago, valor);
        }
    }
}