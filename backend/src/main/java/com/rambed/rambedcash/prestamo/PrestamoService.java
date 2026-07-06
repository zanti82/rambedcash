package com.rambed.rambedcash.prestamo;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rambed.rambedcash.categoria.Categoria;
import com.rambed.rambedcash.categoria.CategoriaRepository;
import com.rambed.rambedcash.movimiento.Movimiento;
import com.rambed.rambedcash.movimiento.MovimientoRepository;
import com.rambed.rambedcash.saldo.SaldoService;
import com.rambed.rambedcash.usuario.Usuario;
import com.rambed.rambedcash.usuario.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final PagoPrestamoRepository pagoPrestamoRepository;
    private final MovimientoRepository movimientoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SaldoService saldoService;

    public List<Prestamo> listarActivos() {
        return prestamoRepository.findByActivoTrue();
    }

    public List<Prestamo> listarInactivos() {
        return prestamoRepository.findByActivoFalse();
    }

    public List<PagoPrestamo> listarPagosPorPrestamo(Integer prestamoId) {
        return pagoPrestamoRepository.findByPrestamoIdOrderByFechaPagoDesc(prestamoId);
    }

    public Prestamo crear(PrestamoDTO dto) {
        Prestamo prestamo = new Prestamo();
        prestamo.setDescripcion(dto.getDescripcion());
        prestamo.setEntidad(dto.getEntidad());
        prestamo.setValorOriginal(dto.getValorOriginal());
        prestamo.setSaldoPendiente(dto.getValorOriginal());
        prestamo.setTasaInteres(dto.getTasaInteres());
        prestamo.setFechaInicio(dto.getFechaInicio());
        prestamo.setFechaVencimiento(dto.getFechaVencimiento());

        return prestamoRepository.save(prestamo);
    }

    @Transactional
    public PagoPrestamo registrarPago(PagoPrestamoDTO dto) {
        Prestamo prestamo = prestamoRepository.findById(dto.getPrestamoId())
                .orElseThrow(() -> new RuntimeException("Prestamo no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Categoria categoria = categoriaRepository.findByNombre("Intereses")
                .orElseThrow(() -> new RuntimeException("Categoria Intereses no encontrada"));
        
        BigDecimal valorInteres = prestamo.getSaldoPendiente()
                .multiply(prestamo.getTasaInteres())
                .divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);

        BigDecimal valorTotal = dto.getValorCapital().add(valorInteres);

        Movimiento movimiento = new Movimiento();
        movimiento.setFecha(dto.getFechaPago());
        movimiento.setDescripcion("Pago prestamo: " + prestamo.getDescripcion());
        movimiento.setValor(valorTotal);
        movimiento.setTipo(Movimiento.Tipo.EGRESO);
        movimiento.setMedioPago(Movimiento.MedioPago.valueOf(dto.getMedioPago()));
        movimiento.setCategoria(categoria);
        movimiento.setUsuario(usuario);

        Movimiento movimientoGuardado = movimientoRepository.save(movimiento);

        PagoPrestamo pago = new PagoPrestamo();
        pago.setPrestamo(prestamo);
        pago.setMovimiento(movimientoGuardado);
        pago.setValorCapital(dto.getValorCapital());
        pago.setValorInteres(valorInteres);
        pago.setFechaPago(dto.getFechaPago());

        prestamo.setSaldoPendiente(
                prestamo.getSaldoPendiente().subtract(dto.getValorCapital())
        );

        if (prestamo.getSaldoPendiente().compareTo(BigDecimal.ZERO) <= 0) {
            prestamo.setActivo(false);
        }

        prestamoRepository.save(prestamo);

        saldoService.actualizarSaldo(
                Movimiento.Tipo.EGRESO,
                Movimiento.MedioPago.valueOf(dto.getMedioPago()),
                valorTotal
        );

        return pagoPrestamoRepository.save(pago);
    }
}