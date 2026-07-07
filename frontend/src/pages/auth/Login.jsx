import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Email o contraseña incorrectos');
        } finally {
            setCargando(false);
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '32px' }}>
            <h1>RambedCash</h1>
            <h2>Iniciar sesión</h2>

            {error && (
                <p style={{ color: 'red' }}>{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={function(e) { setEmail(e.target.value); }}
                        placeholder="admin@rambed.com"
                    />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={function(e) { setPassword(e.target.value); }}
                        placeholder="tu contraseña"
                    />
                </div>

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

export default Login;