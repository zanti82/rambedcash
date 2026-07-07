import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import './Movimientos.css';
import { useAuth } from '../../context/AuthContext';

function Movimientos() {

    const { usuario } = useAuth();

    const [movimientos, setMovimientos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);

    const hoy = new Date().toISOString().split('T')[0];
    const [fechaInicio, setFechaInicio] = useState(hoy);
    const [fechaFin, setFechaFin] = useState(hoy);

    const [form, setForm] = useState({
        fecha: hoy,
        descripcion: '',
        valor: '',
        tipo: 'EGRESO',
        medioPago: 'EFECTIVO',
        categoriaId: '',
        usuarioId: usuario.id
    });

    useEffect(function() {
        cargarCategorias();
        cargarMovimientos();
    }, []);

    async function cargarCategorias() {
        try {
            const res = await api.get('/categorias');
            setCategorias(res.data);
        } catch (error) {
            console.error('Error cargando categorias:', error);
        }
    }

    async function cargarMovimientos() {
        try {
            setCargando(true);
            const res = await api.get('/movimientos?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin);
            setMovimientos(res.data);
        } catch (error) {
            console.error('Error cargando movimientos:', error);
        } finally {
            setCargando(false);
        }
    }

    function handleChange(e) {
        const nombre = e.target.name;
        const valor = e.target.value;
        setForm(function(anterior) {
            return { ...anterior, [nombre]: valor };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/movimientos', {
                ...form,
                valor: parseFloat(form.valor),
                categoriaId: parseInt(form.categoriaId)
            });
            setMostrarForm(false);
            setForm({
                fecha: hoy,
                descripcion: '',
                valor: '',
                tipo: 'EGRESO',
                medioPago: 'EFECTIVO',
                categoriaId: '',
                 usuarioId: usuario.id
            });
            cargarMovimientos();
        } catch (error) {
            console.error('Error creando movimiento:', error);
        }
    }

    async function handleEliminar(id) {
        if (!window.confirm('¿Seguro que deseas eliminar este movimiento?')) {
            return;
        }
        try {
            await api.delete('/movimientos/' + id);
            cargarMovimientos();
        } catch (error) {
            console.error('Error eliminando movimiento:', error);
        }
    }

    function formatearMoneda(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    }

    return (
        <Layout>
            <div className="movimientos">
                <div className="movimientos-header">
                    <h1>Movimientos</h1>
                    <button
                        className="btn-primary"
                        onClick={function() { setMostrarForm(!mostrarForm); }}>
                        {mostrarForm ? 'Cancelar' : '+ Nuevo movimiento'}
                    </button>
                </div>

                {mostrarForm && (
                    <div className="card form-card">
                        <h3>Registrar movimiento</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={form.fecha}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        placeholder="Ej: Compra tela algodón"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Valor</label>
                                    <input
                                        type="number"
                                        name="valor"
                                        value={form.valor}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tipo</label>
                                    <select name="tipo" value={form.tipo} onChange={handleChange}>
                                        <option value="INGRESO">Ingreso</option>
                                        <option value="EGRESO">Egreso</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Medio de pago</label>
                                    <select name="medioPago" value={form.medioPago} onChange={handleChange}>
                                        <option value="EFECTIVO">Efectivo</option>
                                        <option value="BANCO">Banco</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(function(cat) {
                                            return (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nombre}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">
                                Guardar movimiento
                            </button>
                        </form>
                    </div>
                )}

                <div className="card">
                    <div className="filtros">
                        <div className="form-group">
                            <label>Desde</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={function(e) { setFechaInicio(e.target.value); }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hasta</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={function(e) { setFechaFin(e.target.value); }}
                            />
                        </div>
                        <button className="btn-primary" onClick={cargarMovimientos}>
                            Buscar
                        </button>
                    </div>

                    {cargando ? (
                        <p>Cargando movimientos...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Categoría</th>
                                    <th>Tipo</th>
                                    <th>Medio</th>
                                    <th>Valor</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientos.map(function(mov) {
                                    return (
                                        <tr key={mov.id}>
                                            <td>{mov.fecha}</td>
                                            <td>{mov.descripcion}</td>
                                            <td>{mov.categoria.nombre}</td>
                                            <td>
                                                <span className={mov.tipo === 'INGRESO' ? 'badge-ingreso' : 'badge-egreso'}>
                                                    {mov.tipo}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={mov.medioPago === 'EFECTIVO' ? 'badge-efectivo' : 'badge-banco'}>
                                                    {mov.medioPago}
                                                </span>
                                            </td>
                                            <td className={mov.tipo === 'INGRESO' ? 'valor-ingreso' : 'valor-egreso'}>
                                                {formatearMoneda(mov.valor)}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-danger"
                                                    onClick={function() { handleEliminar(mov.id); }}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Movimientos;