import { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import './Reportes.css';

function Reportes() {

    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;

    const [reporteMensual, setReporteMensual] = useState(null);
    const [reporteAnual, setReporteAnual] = useState(null);
    const [estadoResultados, setEstadoResultados] = useState(null);
    const [cargando, setCargando] = useState(false);

    const [filtroMensual, setFiltroMensual] = useState({
        anio: anioActual,
        mes: mesActual
    });

    const [filtroAnual, setFiltroAnual] = useState({
        anio: anioActual
    });

    const [filtroEstado, setFiltroEstado] = useState({
        fechaInicio: anioActual + '-01-01',
        fechaFin: anioActual + '-12-31'
    });

    async function cargarReporteMensual() {
        try {
            setCargando(true);
            const res = await api.get('/reportes/mensual?anio=' + filtroMensual.anio + '&mes=' + filtroMensual.mes);
            setReporteMensual(res.data);
        } catch (error) {
            console.error('Error cargando reporte mensual:', error);
        } finally {
            setCargando(false);
        }
    }

    async function cargarReporteAnual() {
        try {
            setCargando(true);
            const res = await api.get('/reportes/anual?anio=' + filtroAnual.anio);
            setReporteAnual(res.data);
        } catch (error) {
            console.error('Error cargando reporte anual:', error);
        } finally {
            setCargando(false);
        }
    }

    async function cargarEstadoResultados() {
        try {
            setCargando(true);
            const res = await api.get('/reportes/estado-resultados?fechaInicio=' + filtroEstado.fechaInicio + '&fechaFin=' + filtroEstado.fechaFin);
            setEstadoResultados(res.data);
        } catch (error) {
            console.error('Error cargando estado de resultados:', error);
        } finally {
            setCargando(false);
        }
    }

    function formatearMoneda(valor) {
        if (valor === null || valor === undefined) {
            return '$0';
        }
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    }

    return (
        <Layout>
            <div className="reportes">
                <h1>Reportes</h1>

                <div className="reportes-grid">

                    <div className="card">
                        <h3>Reporte mensual</h3>
                        <div className="filtro-fila">
                            <div className="form-group">
                                <label>Año</label>
                                <input
                                    type="number"
                                    value={filtroMensual.anio}
                                    onChange={function(e) {
                                        setFiltroMensual(function(ant) {
                                            return { ...ant, anio: e.target.value };
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mes</label>
                                <select
                                    value={filtroMensual.mes}
                                    onChange={function(e) {
                                        setFiltroMensual(function(ant) {
                                            return { ...ant, mes: e.target.value };
                                        });
                                    }}>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>
                            <button className="btn-primary" onClick={cargarReporteMensual}>
                                Consultar
                            </button>
                        </div>

                        {reporteMensual && (
                            <div className="reporte-resultado">
                                <div className="reporte-fila">
                                    <span>Total ingresos</span>
                                    <span className="valor-ingreso">
                                        {formatearMoneda(reporteMensual.totalIngresos)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Total egresos</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(reporteMensual.totalEgresos)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Ingresos efectivo</span>
                                    <span>{formatearMoneda(reporteMensual.ingresosEfectivo)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Ingresos banco</span>
                                    <span>{formatearMoneda(reporteMensual.ingresosBanco)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Egresos efectivo</span>
                                    <span>{formatearMoneda(reporteMensual.egresosEfectivo)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Egresos banco</span>
                                    <span>{formatearMoneda(reporteMensual.egresosBanco)}</span>
                                </div>
                                <div className="reporte-fila reporte-total">
                                    <span>Diferencia</span>
                                    <span>{formatearMoneda(reporteMensual.diferencia)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h3>Reporte anual</h3>
                        <div className="filtro-fila">
                            <div className="form-group">
                                <label>Año</label>
                                <input
                                    type="number"
                                    value={filtroAnual.anio}
                                    onChange={function(e) {
                                        setFiltroAnual({ anio: e.target.value });
                                    }}
                                />
                            </div>
                            <button className="btn-primary" onClick={cargarReporteAnual}>
                                Consultar
                            </button>
                        </div>

                        {reporteAnual && (
                            <div className="reporte-resultado">
                                <div className="reporte-fila">
                                    <span>Total ingresos</span>
                                    <span className="valor-ingreso">
                                        {formatearMoneda(reporteAnual.totalIngresos)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Total egresos</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(reporteAnual.totalEgresos)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Ingresos efectivo</span>
                                    <span>{formatearMoneda(reporteAnual.ingresosEfectivo)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Ingresos banco</span>
                                    <span>{formatearMoneda(reporteAnual.ingresosBanco)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Egresos efectivo</span>
                                    <span>{formatearMoneda(reporteAnual.egresosEfectivo)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Egresos banco</span>
                                    <span>{formatearMoneda(reporteAnual.egresosBanco)}</span>
                                </div>
                                <div className="reporte-fila reporte-total">
                                    <span>Diferencia</span>
                                    <span>{formatearMoneda(reporteAnual.diferencia)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card estado-resultados">
                    <h3>Estado de resultados</h3>
                    <div className="filtro-fila">
                        <div className="form-group">
                            <label>Desde</label>
                            <input
                                type="date"
                                value={filtroEstado.fechaInicio}
                                onChange={function(e) {
                                    setFiltroEstado(function(ant) {
                                        return { ...ant, fechaInicio: e.target.value };
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hasta</label>
                            <input
                                type="date"
                                value={filtroEstado.fechaFin}
                                onChange={function(e) {
                                    setFiltroEstado(function(ant) {
                                        return { ...ant, fechaFin: e.target.value };
                                    });
                                }}
                            />
                        </div>
                        <button className="btn-primary" onClick={cargarEstadoResultados}>
                            Generar
                        </button>
                    </div>

                    {estadoResultados && (
                        <div className="estado-grid">
                            <div className="estado-seccion">
                                <h4>Ingresos</h4>
                                <div className="reporte-fila">
                                    <span>Ingresos operacionales</span>
                                    <span className="valor-ingreso">
                                        {formatearMoneda(estadoResultados.ingresosOperacionales)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>(-) Costos de venta</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(estadoResultados.costoVenta)}
                                    </span>
                                </div>
                                <div className="reporte-fila reporte-total">
                                    <span>Utilidad bruta</span>
                                    <span>{formatearMoneda(estadoResultados.utilidadBruta)}</span>
                                </div>
                            </div>

                            <div className="estado-seccion">
                                <h4>Gastos operacionales</h4>
                                <div className="reporte-fila">
                                    <span>Gastos fijos</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(estadoResultados.gastosFijos)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Gastos administrativos</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(estadoResultados.gastosAdministrativos)}
                                    </span>
                                </div>
                                <div className="reporte-fila">
                                    <span>Gastos de ventas</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(estadoResultados.gastosVentas)}
                                    </span>
                                </div>
                                <div className="reporte-fila reporte-total">
                                    <span>Total gastos</span>
                                    <span className="valor-egreso">
                                        {formatearMoneda(estadoResultados.totalGastos)}
                                    </span>
                                </div>
                            </div>

                            <div className="estado-seccion estado-final">
                                <div className="reporte-fila reporte-total">
                                    <span>Utilidad operacional</span>
                                    <span>{formatearMoneda(estadoResultados.utilidadOperacional)}</span>
                                </div>
                                <div className="reporte-fila">
                                    <span>(+) Ingresos no operacionales</span>
                                    <span className="valor-ingreso">
                                        {formatearMoneda(estadoResultados.ingresosNoOperacionales)}
                                    </span>
                                </div>
                                <div className="reporte-fila reporte-total utilidad-neta">
                                    <span>Utilidad neta</span>
                                    <span>{formatearMoneda(estadoResultados.utilidadNeta)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Reportes;