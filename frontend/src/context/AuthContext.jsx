import { createContext, useState, useContext } from 'react';
import { guardarSesion, cerrarSesion, obtenerUsuario, haySesion } from '../utils/storage';
import api from '../api/axios';

const AuthContext = createContext(null);

function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(function() {
        return obtenerUsuario();
    });

    const [autenticado, setAutenticado] = useState(function() {
        return haySesion();
    });

    async function login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        const datos = response.data;

        guardarSesion(datos.token, {
            id: datos.id, 
            nombre: datos.nombre,
            email: datos.email,
            rol: datos.rol
        });

        setUsuario({
            id: datos.id, 
            nombre: datos.nombre,
            email: datos.email,
            rol: datos.rol
        });

        setAutenticado(true);
        return datos;
    }

    function logout() {
        cerrarSesion();
        setUsuario(null);
        setAutenticado(false);
    }

    return (
        <AuthContext.Provider value={{ usuario, autenticado, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };