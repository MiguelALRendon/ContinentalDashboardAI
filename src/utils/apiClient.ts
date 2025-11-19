import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuración del cliente API
 */
const config: AxiosRequestConfig = {
  baseURL: '/backend-api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Instancia de Axios configurada
 */
const apiClient: AxiosInstance = axios.create(config);

/**
 * Interceptor de request - agregar token de autenticación
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response - manejo de errores global
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      switch (error.response.status) {
        case 401:
          // No autorizado - redirigir a login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acceso prohibido');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('No hay respuesta del servidor');
    } else {
      // Error en la configuración de la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
