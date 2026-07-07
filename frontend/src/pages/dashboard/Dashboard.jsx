import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import './Dashboard.css';

function Dashboard() {

    const [saldo, setSaldo] = useState(null);
    const [reporteHoy, setReporteHoy] = useState(null);
    const [reporteMes, setReporteMes] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(function() {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        try {
            const hoy = new Date().toISOString().split('T')[0];
            const anio = new Date().getFullYear();
            const mes = new Date().getMonth() + 1;

            const [resSaldo, resHoy, resMes] = await Promise.all([
                api.get('/saldo'),
                api.get('/reportes/diario?fecha=' + hoy),
                api.get('/reportes/mensual?anio=' + anio + '&mes=' + mes)
            ]);

            setSaldo(resSaldo.data);
            setReporteHoy(resHoy.data);
            setReporteMes(resMes.data);
        } catch (error) {
            console.error('Error cargando datos:', error);
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

    if (cargando) {
        return (
            <Layout>
                <p>Cargando...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard">
                <h1 className="dashboard-titulo">Dashboard</h1>
                <p className="dashboard-fecha">
                    {new Date().toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>

                <div className="tarjetas-saldo">
                    <div className="tarjeta tarjeta-efectivo">
                        <p className="tarjeta-label">Saldo Efectivo</p>
                        <p className="tarjeta-valor">
                            {saldo && formatearMoneda(saldo.saldoEfectivo)}
                        </p>
                    </div>

                    <div className="tarjeta tarjeta-banco">
                        <p className="tarjeta-label">Saldo Banco</p>
                        <p className="tarjeta-valor">
                            {saldo && formatearMoneda(saldo.saldoBanco)}
                        </p>
                    </div>

                    <div className="tarjeta tarjeta-total">
                        <p className="tarjeta-label">Total Disponible</p>
                        <p className="tarjeta-valor">
                            {saldo && formatearMoneda(
                                parseFloat(saldo.saldoEfectivo) +
                                parseFloat(saldo.saldoBanco)
                            )}
                        </p>
                    </div>
                </div>

                <div className="reportes-grid">
                    <div className="card">
                        <h3>Resumen de hoy</h3>
                        <div className="reporte-fila">
                            <span>Ingresos</span>
                            <span className="valor-ingreso">
                                {reporteHoy && formatearMoneda(reporteHoy.totalIngresos)}
                            </span>
                        </div>
                        <div className="reporte-fila">
                            <span>Egresos</span>
                            <span className="valor-egreso">
                                {reporteHoy && formatearMoneda(reporteHoy.totalEgresos)}
                            </span>
                        </div>
                        <div className="reporte-fila reporte-total">
                            <span>Diferencia</span>
                            <span>
                                {reporteHoy && formatearMoneda(reporteHoy.diferencia)}
                            </span>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Resumen del mes</h3>
                        <div className="reporte-fila">
                            <span>Ingresos</span>
                            <span className="valor-ingreso">
                                {reporteMes && formatearMoneda(reporteMes.totalIngresos)}
                            </span>
                        </div>
                        <div className="reporte-fila">
                            <span>Egresos</span>
                            <span className="valor-egreso">
                                {reporteMes && formatearMoneda(reporteMes.totalEgresos)}
                            </span>
                        </div>
                        <div className="reporte-fila reporte-total">
                            <span>Diferencia</span>
                            <span>
                                {reporteMes && formatearMoneda(reporteMes.diferencia)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;