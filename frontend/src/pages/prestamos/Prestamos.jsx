import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Prestamos.css';

function Prestamos() {

    const { usuario } = useAuth();

    const [prestamos, setPrestamos] = useState([]);
    const [pagosPrestamo, setPagosPrestamo] = useState([]);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [mostrarFormPrestamo, setMostrarFormPrestamo] = useState(false);
    const [mostrarFormPago, setMostrarFormPago] = useState(false);

    const hoy = new Date().toISOString().split('T')[0];

    const [formPrestamo, setFormPrestamo] = useState({
        descripcion: '',
        entidad: '',
        valorOriginal: '',
        tasaInteres: '',
        fechaInicio: hoy,
        fechaVencimiento: ''
    });

    const [formPago, setFormPago] = useState({
        prestamoId: '',
        valorCapital: '',
        fechaPago: hoy,
        medioPago: 'BANCO',
        usuarioId: usuario.id
    });

    useEffect(function() {
        cargarPrestamos();
    }, []);

    async function cargarPrestamos() {
        try {
            setCargando(true);
            const res = await api.get('/prestamos');
            setPrestamos(res.data);
        } catch (error) {
            console.error('Error cargando prestamos:', error);
        } finally {
            setCargando(false);
        }
    }

    async function cargarPagos(prestamoId) {
        try {
            const res = await api.get('/prestamos/' + prestamoId + '/pagos');
            setPagosPrestamo(res.data);
            setPrestamoSeleccionado(prestamoId);
        } catch (error) {
            console.error('Error cargando pagos:', error);
        }
    }

    function handleChangePrestamo(e) {
        const nombre = e.target.name;
        const valor = e.target.value;
        setFormPrestamo(function(anterior) {
            return { ...anterior, [nombre]: valor };
        });
    }

    function handleChangePago(e) {
        const nombre = e.target.name;
        const valor = e.target.value;
        setFormPago(function(anterior) {
            return { ...anterior, [nombre]: valor };
        });
    }

    async function handleSubmitPrestamo(e) {
        e.preventDefault();
        try {
            await api.post('/prestamos', {
                ...formPrestamo,
                valorOriginal: parseFloat(formPrestamo.valorOriginal),
                tasaInteres: parseFloat(formPrestamo.tasaInteres)
            });
            setMostrarFormPrestamo(false);
            setFormPrestamo({
                descripcion: '',
                entidad: '',
                valorOriginal: '',
                tasaInteres: '',
                fechaInicio: hoy,
                fechaVencimiento: ''
            });
            cargarPrestamos();
        } catch (error) {
            console.error('Error creando prestamo:', error);
        }
    }

    async function handleSubmitPago(e) {
        e.preventDefault();
        try {
            await api.post('/prestamos/pagos', {
                ...formPago,
                valorCapital: parseFloat(formPago.valorCapital),
                prestamoId: parseInt(formPago.prestamoId)
            });
            setMostrarFormPago(false);
            setFormPago({
                prestamoId: '',
                valorCapital: '',
                fechaPago: hoy,
                medioPago: 'BANCO',
                usuarioId: usuario.id
            });
            cargarPrestamos();
            if (prestamoSeleccionado) {
                cargarPagos(prestamoSeleccionado);
            }
        } catch (error) {
            console.error('Error registrando pago:', error);
        }
    }

    function formatearMoneda(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    }

    function abrirFormPago(prestamoId) {
        setFormPago(function(anterior) {
            return { ...anterior, prestamoId: prestamoId };
        });
        setMostrarFormPago(true);
    }

    return (
        <Layout>
            <div className="prestamos">
                <div className="prestamos-header">
                    <h1>Préstamos</h1>
                    <button
                        className="btn-primary"
                        onClick={function() { setMostrarFormPrestamo(!mostrarFormPrestamo); }}>
                        {mostrarFormPrestamo ? 'Cancelar' : '+ Nuevo préstamo'}
                    </button>
                </div>

                {mostrarFormPrestamo && (
                    <div className="card form-card">
                        <h3>Registrar préstamo</h3>
                        <form onSubmit={handleSubmitPrestamo}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        value={formPrestamo.descripcion}
                                        onChange={handleChangePrestamo}
                                        placeholder="Ej: Préstamo Bancolombia"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Entidad</label>
                                    <input
                                        type="text"
                                        name="entidad"
                                        value={formPrestamo.entidad}
                                        onChange={handleChangePrestamo}
                                        placeholder="Ej: Bancolombia"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Valor original</label>
                                    <input
                                        type="number"
                                        name="valorOriginal"
                                        value={formPrestamo.valorOriginal}
                                        onChange={handleChangePrestamo}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tasa de interés mensual (%)</label>
                                    <input
                                        type="number"
                                        name="tasaInteres"
                                        value={formPrestamo.tasaInteres}
                                        onChange={handleChangePrestamo}
                                        placeholder="Ej: 1.5"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha inicio</label>
                                    <input
                                        type="date"
                                        name="fechaInicio"
                                        value={formPrestamo.fechaInicio}
                                        onChange={handleChangePrestamo}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha vencimiento</label>
                                    <input
                                        type="date"
                                        name="fechaVencimiento"
                                        value={formPrestamo.fechaVencimiento}
                                        onChange={handleChangePrestamo}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">
                                Guardar préstamo
                            </button>
                        </form>
                    </div>
                )}

                {mostrarFormPago && (
                    <div className="card form-card">
                        <h3>Registrar pago</h3>
                        <form onSubmit={handleSubmitPago}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Préstamo</label>
                                    <select
                                        name="prestamoId"
                                        value={formPago.prestamoId}
                                        onChange={handleChangePago}>
                                        <option value="">Selecciona un préstamo</option>
                                        {prestamos.map(function(p) {
                                            return (
                                                <option key={p.id} value={p.id}>
                                                    {p.descripcion}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Abono capital</label>
                                    <input
                                        type="number"
                                        name="valorCapital"
                                        value={formPago.valorCapital}
                                        onChange={handleChangePago}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha de pago</label>
                                    <input
                                        type="date"
                                        name="fechaPago"
                                        value={formPago.fechaPago}
                                        onChange={handleChangePago}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Medio de pago</label>
                                    <select
                                        name="medioPago"
                                        value={formPago.medioPago}
                                        onChange={handleChangePago}>
                                        <option value="EFECTIVO">Efectivo</option>
                                        <option value="BANCO">Banco</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">
                                Registrar pago
                            </button>
                        </form>
                    </div>
                )}

                <div className="card">
                    {cargando ? (
                        <p>Cargando préstamos...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Entidad</th>
                                    <th>Valor original</th>
                                    <th>Saldo pendiente</th>
                                    <th>Tasa</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamos.map(function(p) {
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.descripcion}</td>
                                            <td>{p.entidad}</td>
                                            <td>{formatearMoneda(p.valorOriginal)}</td>
                                            <td className="valor-egreso">
                                                {formatearMoneda(p.saldoPendiente)}
                                            </td>
                                            <td>{p.tasaInteres}%</td>
                                            <td className="acciones">
                                                <button
                                                    className="btn-success"
                                                    onClick={function() { abrirFormPago(p.id); }}>
                                                    Pagar
                                                </button>
                                                <button
                                                    className="btn-primary"
                                                    onClick={function() { cargarPagos(p.id); }}>
                                                    Ver pagos
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {prestamoSeleccionado && (
                    <div className="card">
                        <h3>Historial de pagos</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Capital</th>
                                    <th>Interés</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagosPrestamo.map(function(pago) {
                                    return (
                                        <tr key={pago.id}>
                                            <td>{pago.fechaPago}</td>
                                            <td>{formatearMoneda(pago.valorCapital)}</td>
                                            <td>{formatearMoneda(pago.valorInteres)}</td>
                                            <td className="valor-egreso">
                                                {formatearMoneda(
                                                    parseFloat(pago.valorCapital) +
                                                    parseFloat(pago.valorInteres)
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Prestamos;