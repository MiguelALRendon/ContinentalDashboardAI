import apiClient from '@/utils/apiClient';
import type { BaseModel } from '@/core/models/base';

/**
 * Parámetros para consultas con paginación y filtros
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  [key: string]: any;
}

/**
 * Respuesta de una consulta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Servicio API base genérico para operaciones CRUD
 */
export class BaseApiService<T extends BaseModel> {
  constructor(protected endpoint: string) {}

  /**
   * Lista todos los registros con soporte para paginación y filtros
   */
  async list(params?: QueryParams): Promise<T[]> {
    try {
      const { data } = await apiClient.get<T[]>(this.endpoint, { params });
      return data;
    } catch (error) {
      console.error(`Error listing ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Lista registros con paginación
   */
  async listPaginated(params?: QueryParams): Promise<PaginatedResponse<T>> {
    try {
      // El backend Flask devuelve la lista directamente en el endpoint principal
      // con parámetros ?page=1&pageSize=20
      const { data } = await apiClient.get<T[]>(this.endpoint, { params });
      
      // Simular respuesta paginada del lado del cliente
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      
      return {
        data: data,
        total: data.length,
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize)
      };
    } catch (error) {
      console.error(`Error listing paginated ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un registro por su ID
   */
  async getById(id: string): Promise<T> {
    try {
      const { data } = await apiClient.get<T>(`${this.endpoint}/${id}`);
      return data;
    } catch (error) {
      console.error(`Error getting ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo registro
   */
  async create(item: Partial<T>): Promise<T> {
    try {
      const { data } = await apiClient.post<T>(this.endpoint, item);
      return data;
    } catch (error) {
      console.error(`Error creating ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza un registro existente
   */
  async update(id: string, item: Partial<T>): Promise<T> {
    try {
      const { data } = await apiClient.put<T>(`${this.endpoint}/${id}`, item);
      return data;
    } catch (error) {
      console.error(`Error updating ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un registro (soft delete - desactivar)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Lista solo registros activos (estatus = 1)
   */
  async listActive(params?: QueryParams): Promise<T[]> {
    return this.list({ ...params, estatus: 1 });
  }

  /**
   * Búsqueda por texto en múltiples campos
   */
  async search(searchTerm: string, params?: QueryParams): Promise<T[]> {
    return this.list({ ...params, search: searchTerm });
  }

  /**
   * Exporta datos a formato específico
   */
  async export(format: 'excel' | 'pdf' | 'csv', params?: QueryParams): Promise<Blob> {
    try {
      const { data } = await apiClient.get(`${this.endpoint}/export/${format}`, {
        params,
        responseType: 'blob'
      });
      return data;
    } catch (error) {
      console.error(`Error exporting ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Batch delete - eliminar múltiples registros
   */
  async batchDelete(ids: string[]): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/batch-delete`, { ids });
    } catch (error) {
      console.error(`Error batch deleting ${this.endpoint}:`, error);
      throw error;
    }
  }
}
