import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/utils/apiClient';

/**
 * Información del usuario
 */
export interface User {
  id: string;
  nombre: string;
  url_busqueda: string;
  created_at?: string;
  updated_at?: string;
  estatus?: number;
}

/**
 * Credenciales de login según API
 */
export interface LoginCredentials {
  nombre: string;
  contraseña: string;
}

/**
 * Respuesta del login según API
 */
interface LoginResponse {
  token: string;
  url_busqueda: string;
}

/**
 * Store para gestión de autenticación y usuario
 */
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Inicia sesión con la API de Continental
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('[LOGIN] Iniciando login para:', credentials.nombre);
      
      const response = await apiClient.post<LoginResponse>('/usuarios/login', {
        nombre: credentials.nombre,
        contraseña: credentials.contraseña
      });
      
      console.log('[LOGIN] Respuesta del servidor:', response.data);
      
      const { token: authToken, url_busqueda } = response.data;
      
      if (!authToken || !url_busqueda) {
        throw new Error('No se recibió token o url_busqueda del servidor');
      }
      
      // Guardar token y url_busqueda
      token.value = authToken;
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('url_busqueda', url_busqueda);
      console.log('[LOGIN] Token y url_busqueda guardados exitosamente');
      
      // Crear usuario básico con la información que tenemos
      user.value = {
        id: '',
        nombre: credentials.nombre,
        url_busqueda
      };
      localStorage.setItem('user', JSON.stringify(user.value));
      console.log('[LOGIN] Usuario guardado:', user.value);
      
      console.log('[LOGIN] Login exitoso');
      return true;
    } catch (error: any) {
      console.error('[LOGIN ERROR] Tipo:', error.constructor.name);
      console.error('[LOGIN ERROR] Mensaje:', error.message);
      console.error('[LOGIN ERROR] Response:', error.response);
      console.error('[LOGIN ERROR] Status:', error.response?.status);
      console.error('[LOGIN ERROR] Data:', error.response?.data);
      
      // Limpiar cualquier dato previo
      user.value = null;
      token.value = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('url_busqueda');
      localStorage.removeItem('user');
      
      throw error;
    }
  };

  /**
   * Cierra sesión
   */
  const logout = () => {
    console.log('[LOGOUT] Cerrando sesión');
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('url_busqueda');
    localStorage.removeItem('user');
    console.log('[LOGOUT] Sesión cerrada');
  };

  /**
   * Restaura la sesión desde localStorage
   */
  const restoreSession = () => {
    console.log('[SESSION] Restaurando sesión desde localStorage');
    const savedToken = localStorage.getItem('auth_token');
    const savedUrlBusqueda = localStorage.getItem('url_busqueda');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUrlBusqueda && savedUser) {
      token.value = savedToken;
      try {
        user.value = JSON.parse(savedUser);
        console.log('[SESSION] Sesión restaurada:', user.value);
      } catch (e) {
        console.error('[SESSION] Error parsing saved user:', e);
        logout();
      }
    } else {
      console.log('[SESSION] No hay sesión guardada');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    restoreSession
  };
});
