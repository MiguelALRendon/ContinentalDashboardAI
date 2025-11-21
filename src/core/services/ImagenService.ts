import { BaseApiService } from './BaseApiService';
import apiClient from '@/utils/apiClient';
import { ImagenModel } from '@/core/models';

/**
 * Respuesta del upload de imagen desde la API
 */
export interface ImagenUploadResponse {
  id: string;
  nombre: string;
  url_archivo: string;
  url_busqueda: string;
  created_at: string;
  estatus: number;
}

/**
 * Servicio para gestión de imágenes
 * Conecta con el endpoint /backend-api/imagenes de ContinentalApi
 */
export class ImagenService extends BaseApiService<ImagenModel> {
  constructor() {
    super('/imagenes');
  }

  /**
   * Sobrescribe el método create para SIEMPRE usar upload
   * El modelo de Imagen requiere archivo, así que siempre usamos el endpoint /upload
   */
  override async create(item: Partial<ImagenModel>): Promise<ImagenModel> {
    try {
      // Validar que tenemos los datos necesarios
      if (!item.nombre) {
        throw new Error('El campo "nombre" es requerido');
      }
      
      if (!item.file) {
        throw new Error('El campo "file" es requerido');
      }
      
      // Usar siempre el método upload
      const uploadResponse = await this.upload(item.file, item.nombre);
      
      // Convertir la respuesta del upload a ImagenModel
      const imageModel = Object.assign(new (ImagenModel as any)(), {
        id: uploadResponse.id,
        nombre: uploadResponse.nombre,
        url_archivo: uploadResponse.url_archivo,
        url_busqueda: uploadResponse.url_busqueda,
        created_at: uploadResponse.created_at,
        estatus: uploadResponse.estatus
      });
      
      return imageModel;
    } catch (error) {
      console.error('Error creating image:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen al servidor
   * @param file Archivo de imagen
   * @param nombre Nombre descriptivo de la imagen
   * @returns Información de la imagen subida
   */
  async upload(file: File, nombre: string): Promise<ImagenUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nombre', nombre);

      const { data } = await apiClient.post<ImagenUploadResponse>(
        `${this.endpoint}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Obtiene una imagen por su url_busqueda
   * @param urlBusqueda URL de búsqueda única
   */
  async getByUrlBusqueda(urlBusqueda: string): Promise<ImagenModel> {
    try {
      const { data } = await apiClient.get<ImagenModel>(
        `${this.endpoint}/${urlBusqueda}`
      );
      return data;
    } catch (error) {
      console.error(`Error getting image by url_busqueda ${urlBusqueda}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una imagen permanentemente
   * @param id ID de la imagen
   */
  async deleteImage(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting image ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Instancia singleton del servicio de imágenes
 */
export const imagenService = new ImagenService();
