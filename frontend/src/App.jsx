import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Movimientos from './pages/movimientos/Movimientos';
import Categorias from './pages/categorias/Categorias';
import Prestamos from './pages/prestamos/Prestamos';
import Reportes from './pages/reportes/Reportes';

function RutaProtegida({ children }) {
    const { autenticado } = useAuth();
    if (!autenticado) {
        return <Navigate to="/login" />;
    }
    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <RutaProtegida>
                            <Dashboard />
                        </RutaProtegida>
                    } />
                    <Route path="/movimientos" element={
                        <RutaProtegida>
                            <Movimientos />
                        </RutaProtegida>
                    } />
                    <Route path="/categorias" element={
                        <RutaProtegida>
                            <Categorias />
                        </RutaProtegida>
                    } />
                    <Route path="/prestamos" element={
                        <RutaProtegida>
                            <Prestamos />
                        </RutaProtegida>
                    } />
                    <Route path="/reportes" element={
                        <RutaProtegida>
                            <Reportes />
                        </RutaProtegida>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;