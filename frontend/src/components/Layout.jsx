import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout({ children }) {

    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="layout">
            <aside className={`sidebar ${menuAbierto ? 'abierto' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-logo">RambedCash</h2>
                    <p className="sidebar-empresa">Rambed</p>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end className={function({ isActive }) {
                        return isActive ? 'nav-item activo' : 'nav-item';
                    }}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/movimientos" className={function({ isActive }) {
                        return isActive ? 'nav-item activo' : 'nav-item';
                    }}>
                        Movimientos
                    </NavLink>

                    <NavLink to="/categorias" className={function({ isActive }) {
                        return isActive ? 'nav-item activo' : 'nav-item';
                    }}>
                        Categorías
                    </NavLink>

                    <NavLink to="/prestamos" className={function({ isActive }) {
                        return isActive ? 'nav-item activo' : 'nav-item';
                    }}>
                        Préstamos
                    </NavLink>

                    <NavLink to="/reportes" className={function({ isActive }) {
                        return isActive ? 'nav-item activo' : 'nav-item';
                    }}>
                        Reportes
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <p className="sidebar-usuario">{usuario && usuario.nombre}</p>
                    <button className="btn-danger" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="contenido">
                <button
                    className="menu-toggle"
                    onClick={function() { setMenuAbierto(!menuAbierto); }}>
                    ☰
                </button>
                {children}
            </main>
        </div>
    );
}

export default Layout;