/// <reference types="vite/client" />
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// URL base de tu backend en Django
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
    'Content-Type': 'application/json',
    },
});

// Interceptor para inyectar el token en cada petición
apiClient.interceptors.request.use(
    (config) => {
    // Aquí asumo que guardas un token, pero puedes adaptarlo a cómo tu compañero maneje la sesión (JWT, Session ID, etc.)
    const token = localStorage.getItem('access_token'); 
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
);