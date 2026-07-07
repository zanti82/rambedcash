import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import './Categorias.css';

function Categorias() {

    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        nombre: '',
        tipoMovimiento: 'EGRESO',
        clasificacion: 'GASTO_FIJO'
    });

    useEffect(function() {
        cargarCategorias();
    }, []);

    async function cargarCategorias() {
        try {
            setCargando(true);
            const res = await api.get('/categorias');
            setCategorias(res.data);
        } catch (error) {
            console.error('Error cargando categorias:', error);
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
        setError('');
        try {
            await api.post('/categorias', form);
            setMostrarForm(false);
            setForm({
                nombre: '',
                tipoMovimiento: 'EGRESO',
                clasificacion: 'GASTO_FIJO'
            });
            cargarCategorias();
        } catch (err) {
            setError('Error al crear la categoría. Verifique que el nombre no exista.');
        }
    }

    async function handleDesactivar(id) {
        if (!window.confirm('¿Seguro que deseas desactivar esta categoría?')) {
            return;
        }
        try {
            await api.delete('/categorias/' + id);
            cargarCategorias();
        } catch (error) {
            console.error('Error desactivando categoria:', error);
        }
    }

    function formatearClasificacion(clasificacion) {
        const nombres = {
            INGRESO_OPERACIONAL: 'Ingreso operacional',
            INGRESO_NO_OPERACIONAL: 'Ingreso no operacional',
            COSTO_VENTA: 'Costo de venta',
            GASTO_FIJO: 'Gasto fijo',
            GASTO_ADMINISTRATIVO: 'Gasto administrativo',
            GASTO_VENTAS: 'Gasto de ventas',
            PAGO_DEUDA_ANTERIOR: 'Pago deuda anterior',
            RETIRO_INVERSIONISTA: 'Retiro inversionista'
        };
        return nombres[clasificacion] || clasificacion;
    }

    return (
        <Layout>
            <div className="categorias">
                <div className="categorias-header">
                    <h1>Categorías</h1>
                    <button
                        className="btn-primary"
                        onClick={function() { setMostrarForm(!mostrarForm); }}>
                        {mostrarForm ? 'Cancelar' : '+ Nueva categoría'}
                    </button>
                </div>

                {mostrarForm && (
                    <div className="card form-card">
                        <h3>Nueva categoría</h3>

                        {error && <p className="error">{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Publicidad"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tipo</label>
                                    <select
                                        name="tipoMovimiento"
                                        value={form.tipoMovimiento}
                                        onChange={handleChange}>
                                        <option value="INGRESO">Ingreso</option>
                                        <option value="EGRESO">Egreso</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Clasificación</label>
                                    <select
                                        name="clasificacion"
                                        value={form.clasificacion}
                                        onChange={handleChange}>
                                        <option value="INGRESO_OPERACIONAL">Ingreso operacional</option>
                                        <option value="INGRESO_NO_OPERACIONAL">Ingreso no operacional</option>
                                        <option value="COSTO_VENTA">Costo de venta</option>
                                        <option value="GASTO_FIJO">Gasto fijo</option>
                                        <option value="GASTO_ADMINISTRATIVO">Gasto administrativo</option>
                                        <option value="GASTO_VENTAS">Gasto de ventas</option>
                                        <option value="PAGO_DEUDA_ANTERIOR">Pago deuda anterior</option>
                                        <option value="RETIRO_INVERSIONISTA">Retiro inversionista</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">
                                Guardar categoría
                            </button>
                        </form>
                    </div>
                )}

                <div className="card">
                    {cargando ? (
                        <p>Cargando categorías...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Clasificación</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(function(cat) {
                                    return (
                                        <tr key={cat.id}>
                                            <td>{cat.id}</td>
                                            <td>{cat.nombre}</td>
                                            <td>
                                                <span className={cat.tipoMovimiento === 'INGRESO' ? 'badge-ingreso' : 'badge-egreso'}>
                                                    {cat.tipoMovimiento}
                                                </span>
                                            </td>
                                            <td>{formatearClasificacion(cat.clasificacion)}</td>
                                            <td>
                                                <span className={cat.activa ? 'badge-ingreso' : 'badge-egreso'}>
                                                    {cat.activa ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td>
                                                {cat.activa && (
                                                    <button
                                                        className="btn-danger"
                                                        onClick={function() { handleDesactivar(cat.id); }}>
                                                        Desactivar
                                                    </button>
                                                )}
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

export default Categorias;