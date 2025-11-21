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
    console.log('[API CLIENT] Request:', config.method?.toUpperCase(), config.url);
    
    // TODAS las rutas MENOS /login necesitan los headers de autenticación
    const isLoginRoute = config.url?.includes('/login');
    
    if (!isLoginRoute && config.headers) {
      const token = localStorage.getItem('auth_token');
      const urlBusqueda = localStorage.getItem('url_busqueda');
      
      console.log('[API CLIENT] Token presente:', !!token);
      console.log('[API CLIENT] URL Busqueda presente:', !!urlBusqueda);
      
      if (token && urlBusqueda) {
        config.headers['token'] = token;
        config.headers['url-busqueda'] = urlBusqueda;
        console.log('[API CLIENT] Headers de autenticación agregados');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('[API CLIENT] Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response - manejo de errores global
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[API CLIENT] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API CLIENT] Response error:', error);
    
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('[API CLIENT] Error status:', error.response.status);
      console.error('[API CLIENT] Error data:', error.response.data);
      
      // NO redirigir automáticamente en 401 si estamos en la ruta de login
      // El componente de login manejará el error
      if (error.response.status === 401 && !error.config.url?.includes('/login')) {
        console.log('[API CLIENT] 401 en ruta protegida, limpiando sesión');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Solo redirigir si no estamos ya en login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      switch (error.response.status) {
        case 403:
          console.error('[API CLIENT] Acceso prohibido');
          break;
        case 404:
          console.error('[API CLIENT] Recurso no encontrado');
          break;
        case 500:
          console.error('[API CLIENT] Error interno del servidor');
          break;
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('[API CLIENT] No hay respuesta del servidor');
      console.error('[API CLIENT] Request:', error.request);
    } else {
      // Error en la configuración de la petición
      console.error('[API CLIENT] Error de configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
