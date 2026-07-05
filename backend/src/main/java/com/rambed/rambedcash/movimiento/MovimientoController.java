package com.rambed.rambedcash.movimiento;

import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movimientos")
@RequiredArgsConstructor
public class MovimientoController {

    private final MovimientoService movimientoService;

    @GetMapping
    public ResponseEntity<List<Movimiento>> listarPorFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(movimientoService.listarPorFechas(fechaInicio, fechaFin));
    }

    @GetMapping("/por-categoria")
    public ResponseEntity<List<Movimiento>> listarPorCategoria(
            @RequestParam Integer categoriaId) {
        return ResponseEntity.ok(movimientoService.listarPorCategoria(categoriaId));
    }

    @GetMapping("/por-tipo")
    public ResponseEntity<List<Movimiento>> listarPorTipo(
            @RequestParam Movimiento.Tipo tipo) {
        return ResponseEntity.ok(movimientoService.listarPorTipo(tipo));
    }

    @PostMapping
    public ResponseEntity<Movimiento> crear(@Valid @RequestBody MovimientoDTO dto) {
        Movimiento nuevo = movimientoService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        movimientoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}