import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store para el estado global de la aplicación
 */
export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false);
  const theme = ref<'light' | 'dark'>('light');
  const loading = ref(false);
  const breadcrumbs = ref<Array<{ label: string; to?: string }>>([]);

  /**
   * Alterna el estado del sidebar
   */
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  /**
   * Cambia el tema
   */
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    
    // Aplicar clase al documento
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Establece el estado de carga global
   */
  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  /**
   * Actualiza el breadcrumb
   */
  const setBreadcrumbs = (items: Array<{ label: string; to?: string }>) => {
    breadcrumbs.value = items;
  };

  /**
   * Inicializa el store
   */
  const initialize = () => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  };

  return {
    sidebarCollapsed,
    theme,
    loading,
    breadcrumbs,
    toggleSidebar,
    setTheme,
    setLoading,
    setBreadcrumbs,
    initialize
  };
});
