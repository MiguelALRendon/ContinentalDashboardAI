import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Información del usuario
 */
export interface User {
  id: string;
  nombre: string;
  email?: string;
  role?: string;
}

/**
 * Store para gestión de autenticación y usuario
 */
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Inicia sesión
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      // TODO: Implementar llamada al API de login
      // const response = await apiClient.post('/auth/login', credentials);
      
      // Simulación temporal
      token.value = 'fake-token';
      user.value = {
        id: '1',
        nombre: 'Admin',
        email: credentials.email,
        role: 'admin'
      };
      
      localStorage.setItem('auth_token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Cierra sesión
   */
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  /**
   * Restaura la sesión desde localStorage
   */
  const restoreSession = () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      token.value = savedToken;
      try {
        user.value = JSON.parse(savedUser);
      } catch (e) {
        console.error('Error parsing saved user:', e);
        logout();
      }
    }
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (role: string): boolean => {
    return user.value?.role === role;
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    restoreSession,
    hasRole
  };
});
