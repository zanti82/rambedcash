package com.rambed.rambedcash.prestamo;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prestamos")
@RequiredArgsConstructor
public class PrestamoController {

    private final PrestamoService prestamoService;

    @GetMapping
    public ResponseEntity<List<Prestamo>> listarActivos() {
        return ResponseEntity.ok(prestamoService.listarActivos());
    }

    @GetMapping("/inactivos")
    public ResponseEntity<List<Prestamo>> listarInactivos() {
        return ResponseEntity.ok(prestamoService.listarInactivos());
    }

    @GetMapping("/{id}/pagos")
    public ResponseEntity<List<PagoPrestamo>> listarPagos(
            @PathVariable Integer id) {
        return ResponseEntity.ok(prestamoService.listarPagosPorPrestamo(id));
    }

    @PostMapping
    public ResponseEntity<Prestamo> crear(@Valid @RequestBody PrestamoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prestamoService.crear(dto));
    }

    @PostMapping("/pagos")
    public ResponseEntity<PagoPrestamo> registrarPago(
            @Valid @RequestBody PagoPrestamoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(prestamoService.registrarPago(dto));
    }
}