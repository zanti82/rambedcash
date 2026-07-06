package com.rambed.rambedcash.reporte;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

import com.rambed.rambedcash.categoria.Categoria;
import com.rambed.rambedcash.movimiento.Movimiento;
import com.rambed.rambedcash.movimiento.MovimientoRepository;
import com.rambed.rambedcash.saldo.Saldo;
import com.rambed.rambedcash.saldo.SaldoService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final MovimientoRepository movimientoRepository;
    private final SaldoService saldoService;

    public Map<String, Object> reporteDiario(LocalDate fecha) {
        BigDecimal totalIngresos = movimientoRepository.sumarPorTipo(
                Movimiento.Tipo.INGRESO, fecha, fecha);

        BigDecimal totalEgresos = movimientoRepository.sumarPorTipo(
                Movimiento.Tipo.EGRESO, fecha, fecha);

        totalIngresos = totalIngresos != null ? totalIngresos : BigDecimal.ZERO;
        totalEgresos = totalEgresos != null ? totalEgresos : BigDecimal.ZERO;

        Saldo saldo = saldoService.obtenerSaldo();

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("fecha", fecha);
        reporte.put("totalIngresos", totalIngresos);
        reporte.put("totalEgresos", totalEgresos);
        reporte.put("diferencia", totalIngresos.subtract(totalEgresos));
        reporte.put("saldoEfectivo", saldo.getSaldoEfectivo());
        reporte.put("saldoBanco", saldo.getSaldoBanco());

        return reporte;
    }

    public Map<String, Object> reportePorPeriodo(LocalDate fechaInicio, LocalDate fechaFin) {
        BigDecimal totalIngresos = movimientoRepository.sumarPorTipo(
                Movimiento.Tipo.INGRESO, fechaInicio, fechaFin);

        BigDecimal totalEgresos = movimientoRepository.sumarPorTipo(
                Movimiento.Tipo.EGRESO, fechaInicio, fechaFin);

        BigDecimal totalIngresosEfectivo = movimientoRepository.sumarPorTipoYMedioPago(
                Movimiento.Tipo.INGRESO, Movimiento.MedioPago.EFECTIVO, fechaInicio, fechaFin);

        BigDecimal totalIngresosBanco = movimientoRepository.sumarPorTipoYMedioPago(
                Movimiento.Tipo.INGRESO, Movimiento.MedioPago.BANCO, fechaInicio, fechaFin);

        BigDecimal totalEgresosEfectivo = movimientoRepository.sumarPorTipoYMedioPago(
                Movimiento.Tipo.EGRESO, Movimiento.MedioPago.EFECTIVO, fechaInicio, fechaFin);

        BigDecimal totalEgresosBanco = movimientoRepository.sumarPorTipoYMedioPago(
                Movimiento.Tipo.EGRESO, Movimiento.MedioPago.BANCO, fechaInicio, fechaFin);

        totalIngresos = totalIngresos != null ? totalIngresos : BigDecimal.ZERO;
        totalEgresos = totalEgresos != null ? totalEgresos : BigDecimal.ZERO;
        totalIngresosEfectivo = totalIngresosEfectivo != null ? totalIngresosEfectivo : BigDecimal.ZERO;
        totalIngresosBanco = totalIngresosBanco != null ? totalIngresosBanco : BigDecimal.ZERO;
        totalEgresosEfectivo = totalEgresosEfectivo != null ? totalEgresosEfectivo : BigDecimal.ZERO;
        totalEgresosBanco = totalEgresosBanco != null ? totalEgresosBanco : BigDecimal.ZERO;

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("totalIngresos", totalIngresos);
        reporte.put("totalEgresos", totalEgresos);
        reporte.put("diferencia", totalIngresos.subtract(totalEgresos));
        reporte.put("ingresosEfectivo", totalIngresosEfectivo);
        reporte.put("ingresosBanco", totalIngresosBanco);
        reporte.put("egresosEfectivo", totalEgresosEfectivo);
        reporte.put("egresosBanco", totalEgresosBanco);

        return reporte;
    }

    public Map<String, Object> estadoResultados(LocalDate fechaInicio, LocalDate fechaFin) {
       BigDecimal ingresosOperacionales = movimientoRepository
        .sumarPorClasificacion(Categoria.Clasificacion.INGRESO_OPERACIONAL, fechaInicio, fechaFin);

        BigDecimal ingresosNoOperacionales = movimientoRepository
                .sumarPorClasificacion(Categoria.Clasificacion.INGRESO_NO_OPERACIONAL, fechaInicio, fechaFin);

        BigDecimal costoVenta = movimientoRepository
                .sumarPorClasificacion(Categoria.Clasificacion.COSTO_VENTA, fechaInicio, fechaFin);

        BigDecimal gastosFijos = movimientoRepository
                .sumarPorClasificacion(Categoria.Clasificacion.GASTO_FIJO, fechaInicio, fechaFin);

        BigDecimal gastosAdministrativos = movimientoRepository
                .sumarPorClasificacion(Categoria.Clasificacion.GASTO_ADMINISTRATIVO, fechaInicio, fechaFin);

        BigDecimal gastosVentas = movimientoRepository
                .sumarPorClasificacion(Categoria.Clasificacion.GASTO_VENTAS, fechaInicio, fechaFin);

        ingresosOperacionales = ingresosOperacionales != null ? ingresosOperacionales : BigDecimal.ZERO;
        ingresosNoOperacionales = ingresosNoOperacionales != null ? ingresosNoOperacionales : BigDecimal.ZERO;
        costoVenta = costoVenta != null ? costoVenta : BigDecimal.ZERO;
        gastosFijos = gastosFijos != null ? gastosFijos : BigDecimal.ZERO;
        gastosAdministrativos = gastosAdministrativos != null ? gastosAdministrativos : BigDecimal.ZERO;
        gastosVentas = gastosVentas != null ? gastosVentas : BigDecimal.ZERO;

        BigDecimal utilidadBruta = ingresosOperacionales.subtract(costoVenta);
        BigDecimal totalGastos = gastosFijos.add(gastosAdministrativos).add(gastosVentas);
        BigDecimal utilidadOperacional = utilidadBruta.subtract(totalGastos);
        BigDecimal utilidadNeta = utilidadOperacional.add(ingresosNoOperacionales);

        Map<String, Object> estado = new HashMap<>();
        estado.put("fechaInicio", fechaInicio);
        estado.put("fechaFin", fechaFin);
        estado.put("ingresosOperacionales", ingresosOperacionales);
        estado.put("ingresosNoOperacionales", ingresosNoOperacionales);
        estado.put("costoVenta", costoVenta);
        estado.put("utilidadBruta", utilidadBruta);
        estado.put("gastosFijos", gastosFijos);
        estado.put("gastosAdministrativos", gastosAdministrativos);
        estado.put("gastosVentas", gastosVentas);
        estado.put("totalGastos", totalGastos);
        estado.put("utilidadOperacional", utilidadOperacional);
        estado.put("utilidadNeta", utilidadNeta);

        return estado;
    }
}