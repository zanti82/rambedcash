const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

function guardarSesion(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function obtenerUsuario() {
    const usuario = localStorage.getItem(USUARIO_KEY);
    if (usuario) {
        return JSON.parse(usuario);
    }
    return null;
}

function cerrarSesion() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
}

function haySesion() {
    return localStorage.getItem(TOKEN_KEY) !== null;
}

export { guardarSesion, obtenerToken, obtenerUsuario, cerrarSesion, haySesion };