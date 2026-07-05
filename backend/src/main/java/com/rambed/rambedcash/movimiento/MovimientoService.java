package com.rambed.rambedcash.movimiento;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rambed.rambedcash.categoria.Categoria;
import com.rambed.rambedcash.categoria.CategoriaRepository;
import com.rambed.rambedcash.saldo.SaldoService;
import com.rambed.rambedcash.usuario.Usuario;
import com.rambed.rambedcash.usuario.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SaldoService saldoService;

    public List<Movimiento> listarPorFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return movimientoRepository.findByFechaBetweenOrderByFechaDesc(
                fechaInicio, fechaFin);
    }

    public List<Movimiento> listarPorCategoria(Integer categoriaId) {
        return movimientoRepository.findByCategoriaIdOrderByFechaDesc(categoriaId);
    }

    public List<Movimiento> listarPorTipo(Movimiento.Tipo tipo) {
        return movimientoRepository.findByTipoOrderByFechaDesc(tipo);
    }

    @Transactional
    public Movimiento crear(MovimientoDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Movimiento movimiento = new Movimiento();
        movimiento.setFecha(dto.getFecha());
        movimiento.setDescripcion(dto.getDescripcion());
        movimiento.setValor(dto.getValor());
        movimiento.setTipo(dto.getTipo());
        movimiento.setMedioPago(dto.getMedioPago());
        movimiento.setCategoria(categoria);
        movimiento.setUsuario(usuario);

        Movimiento guardado = movimientoRepository.save(movimiento);

        saldoService.actualizarSaldo(dto.getTipo(), dto.getMedioPago(), dto.getValor());

        return guardado;
    }

    @Transactional
    public void eliminar(Integer id) {
        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        saldoService.revertirSaldo(
                movimiento.getTipo(),
                movimiento.getMedioPago(),
                movimiento.getValor()
        );

        movimientoRepository.deleteById(id);
    }
}