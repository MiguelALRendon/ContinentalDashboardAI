import { ref, reactive, computed } from 'vue';
import { debounce } from '@/utils/helpers';

/**
 * Estado de ordenamiento
 */
export interface SortState {
  field: string | null;
  order: 'asc' | 'desc';
}

/**
 * Composable para gestionar el estado de tablas (paginación, filtros, ordenamiento)
 */
export function useTableState() {
  const currentPage = ref(1);
  const pageSize = ref(20);
  const sortField = ref<string | null>(null);
  const sortOrder = ref<'asc' | 'desc'>('asc');
  const filters = reactive<Record<string, any>>({});
  const globalSearch = ref('');

  const sortState = computed<SortState>(() => ({
    field: sortField.value,
    order: sortOrder.value
  }));

  /**
   * Cambia el ordenamiento
   */
  const toggleSort = (field: string) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortField.value = field;
      sortOrder.value = 'asc';
    }
  };

  /**
   * Establece un filtro
   */
  const setFilter = (field: string, value: any) => {
    if (value === null || value === undefined || value === '') {
      delete filters[field];
    } else {
      filters[field] = value;
    }
    currentPage.value = 1; // Reset a primera página al filtrar
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    Object.keys(filters).forEach(key => delete filters[key]);
    globalSearch.value = '';
    currentPage.value = 1;
  };

  /**
   * Limpia un filtro específico
   */
  const clearFilter = (field: string) => {
    delete filters[field];
  };

  /**
   * Establece búsqueda global (con debounce)
   */
  const setGlobalSearch = debounce((value: string) => {
    globalSearch.value = value;
    currentPage.value = 1;
  }, 500);

  /**
   * Obtiene los parámetros de consulta actuales
   */
  const getQueryParams = () => {
    return {
      page: currentPage.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
      ...filters,
      search: globalSearch.value || undefined
    };
  };

  /**
   * Resetea el estado completo
   */
  const reset = () => {
    currentPage.value = 1;
    pageSize.value = 20;
    sortField.value = null;
    sortOrder.value = 'asc';
    clearFilters();
  };

  return {
    currentPage,
    pageSize,
    sortField,
    sortOrder,
    sortState,
    filters,
    globalSearch,
    toggleSort,
    setFilter,
    clearFilter,
    clearFilters,
    setGlobalSearch,
    getQueryParams,
    reset
  };
}
