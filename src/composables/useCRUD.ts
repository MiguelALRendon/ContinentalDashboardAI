import { ref, reactive } from 'vue';
import { ApiServiceFactory } from '@/core/services';
import type { BaseModel } from '@/core/models/base';
import type { QueryParams, PaginatedResponse } from '@/core/services/BaseApiService';

/**
 * Estado de paginación
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
}

/**
 * Composable para operaciones CRUD genéricas
 */
export function useCRUD<T extends BaseModel>(modelClass: typeof BaseModel) {
  const service = ApiServiceFactory.getService<T>(modelClass);
  
  const items = ref<T[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const pagination = reactive<PaginationState>({
    currentPage: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    from: 0,
    to: 0
  });

  /**
   * Carga datos con paginación y filtros
   */
  const loadData = async (params?: QueryParams) => {
    loading.value = true;
    error.value = null;
    
    try {
      const queryParams = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...params
      };

      const response: PaginatedResponse<T> = await service.listPaginated(queryParams);
      
      items.value = response.data;
      pagination.total = response.total;
      pagination.totalPages = response.totalPages;
      pagination.from = (response.page - 1) * response.pageSize + 1;
      pagination.to = Math.min(response.page * response.pageSize, response.total);
    } catch (e: any) {
      error.value = e.message || 'Error al cargar datos';
      console.error('Error loading data:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Carga todos los datos activos sin paginación
   */
  const loadActive = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      items.value = await service.listActive();
    } catch (e: any) {
      error.value = e.message || 'Error al cargar datos activos';
      console.error('Error loading active data:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtiene un registro por ID
   */
  const getById = async (id: string): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      return await service.getById(id);
    } catch (e: any) {
      error.value = e.message || 'Error al obtener el registro';
      console.error('Error getting by id:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crea un nuevo registro
   */
  const create = async (item: Partial<T>): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      // Preparar datos para el backend (limpiar campos auto-gestionados)
      const preparedData = (modelClass as typeof BaseModel).prepareForBackend(item as any);
      
      const newItem = await service.create(preparedData as Partial<T>);
      items.value.push(newItem as any);
      pagination.total++;
      return newItem;
    } catch (e: any) {
      error.value = e.message || 'Error al crear el registro';
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualiza un registro existente
   */
  const update = async (id: string, item: Partial<T>): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      // Preparar datos para el backend (limpiar campos auto-gestionados)
      const preparedData = (modelClass as typeof BaseModel).prepareForBackend(item as any);
      
      const updated = await service.update(id, preparedData as Partial<T>);
      const index = items.value.findIndex(i => (i as any).id === id);
      if (index !== -1) {
        items.value[index] = updated as any;
      }
      return updated;
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar el registro';
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina un registro (soft delete)
   */
  const remove = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      await service.delete(id);
      items.value = items.value.filter(i => (i as any).id !== id);
      pagination.total--;
      return true;
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar el registro';
      console.error('Error deleting:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina múltiples registros
   */
  const batchRemove = async (ids: string[]): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      await service.batchDelete(ids);
      items.value = items.value.filter(i => !ids.includes((i as any).id));
      pagination.total -= ids.length;
      return true;
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar registros';
      console.error('Error batch deleting:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca registros por texto
   */
  const search = async (searchTerm: string, params?: QueryParams) => {
    return loadData({ ...params, search: searchTerm });
  };

  /**
   * Cambia de página
   */
  const changePage = (page: number) => {
    pagination.currentPage = page;
    loadData();
  };

  /**
   * Cambia el tamaño de página
   */
  const changePageSize = (size: number) => {
    pagination.pageSize = size;
    pagination.currentPage = 1;
    loadData();
  };

  /**
   * Refresca los datos
   */
  const refresh = () => {
    loadData();
  };

  return {
    items,
    loading,
    error,
    pagination,
    loadData,
    loadActive,
    getById,
    create,
    update,
    remove,
    batchRemove,
    search,
    changePage,
    changePageSize,
    refresh
  };
}
