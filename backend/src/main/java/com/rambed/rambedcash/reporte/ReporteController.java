package com.rambed.rambedcash.reporte;

import java.time.LocalDate;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/diario") //GET /api/reportes/diario?fecha=2024-01-15
    public ResponseEntity<Map<String, Object>> reporteDiario(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(reporteService.reporteDiario(fecha));
    }

    @GetMapping("/mensual") // GET /api/reportes/mensual?anio=2024&mes=1
    public ResponseEntity<Map<String, Object>> reporteMensual(
            @RequestParam Integer anio,
            @RequestParam Integer mes) {
        LocalDate fechaInicio = LocalDate.of(anio, mes, 1);
        LocalDate fechaFin = fechaInicio.withDayOfMonth(fechaInicio.lengthOfMonth());
        return ResponseEntity.ok(reporteService.reportePorPeriodo(fechaInicio, fechaFin));
    }

    @GetMapping("/anual") //GET /api/reportes/anual?anio=2024
    public ResponseEntity<Map<String, Object>> reporteAnual(
            @RequestParam Integer anio) {
        LocalDate fechaInicio = LocalDate.of(anio, 1, 1);
        LocalDate fechaFin = LocalDate.of(anio, 12, 31);
        return ResponseEntity.ok(reporteService.reportePorPeriodo(fechaInicio, fechaFin));
    }
 
    @GetMapping("/estado-resultados") // GET /api/reportes/estado-resultados?fechaInicio=2024-01-01&fechaFin=2024-12-31
    public ResponseEntity<Map<String, Object>> estadoResultados(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.estadoResultados(fechaInicio, fechaFin));
    }
}