import axios from 'axios';
import { obtenerToken, cerrarSesion } from '../utils/storage';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(function(config) {
    const token = obtenerToken();
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

api.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        if (error.response && error.response.status === 401) {
            cerrarSesion();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;