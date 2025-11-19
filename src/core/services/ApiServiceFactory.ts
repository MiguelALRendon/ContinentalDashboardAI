import { BaseApiService } from './BaseApiService';
import type { BaseModel } from '@/core/models/base';

/**
 * Factory para crear servicios API dinámicamente
 */
export class ApiServiceFactory {
  private static services = new Map<string, BaseApiService<any>>();

  /**
   * Obtiene o crea un servicio para un modelo específico
   */
  static getService<T extends BaseModel>(
    modelClass: typeof BaseModel
  ): BaseApiService<T> {
    const serviceName = modelClass.modelName;
    
    if (!this.services.has(serviceName)) {
      this.services.set(
        serviceName,
        new BaseApiService<T>(modelClass.endpoint)
      );
    }
    
    return this.services.get(serviceName)!;
  }

  /**
   * Crea un servicio personalizado con endpoint específico
   */
  static createCustomService<T extends BaseModel>(
    endpoint: string
  ): BaseApiService<T> {
    return new BaseApiService<T>(endpoint);
  }

  /**
   * Limpia el cache de servicios
   */
  static clearCache(): void {
    this.services.clear();
  }

  /**
   * Obtiene todos los servicios registrados
   */
  static getAllServices(): Map<string, BaseApiService<any>> {
    return new Map(this.services);
  }
}
