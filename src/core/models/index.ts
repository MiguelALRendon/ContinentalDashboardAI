import { BaseModel } from './base';
import type { ModelConfig } from '@/core/types';
import { ObraModel } from './Obra.model';
import { CapituloModel } from './Capitulo.model';
import { ArcoModel } from './Arco.model';
import { NoticiaModel } from './Noticia.model';
import { PersonajeFicticioModel } from './PersonajeFicticio.model';
import { UsuarioModel } from './Usuario.model';
import { VariableSistemaModel } from './VariableSistema.model';
import { ImagenModel } from './Imagen.model';
import { ImagenGalleryModel } from './ImagenGallery.model';

/**
 * Registro central de todos los modelos del sistema
 */
export const modelRegistry = new Map<string, typeof BaseModel>([
  ['Obra', ObraModel],
  ['Capitulo', CapituloModel],
  ['Arco', ArcoModel],
  ['Noticia', NoticiaModel],
  ['PersonajeFicticio', PersonajeFicticioModel],
  ['Usuario', UsuarioModel],
  ['VariableSistema', VariableSistemaModel],
  ['Imagen', ImagenModel],
  ['Galería de Imágenes', ImagenGalleryModel]
]);

/**
 * Obtiene un modelo por su nombre
 */
export function getModel(modelName: string): typeof BaseModel | undefined {
  return modelRegistry.get(modelName);
}

/**
 * Registra un nuevo modelo en el sistema
 */
export function registerModel(modelClass: typeof BaseModel): void {
  modelRegistry.set(modelClass.modelName, modelClass);
}

/**
 * Obtiene todos los modelos registrados
 */
export function getAllModels(): Array<typeof BaseModel> {
  return Array.from(modelRegistry.values());
}

/**
 * Obtiene la configuración de un modelo
 */
export function getModelConfig(modelClass: typeof BaseModel): ModelConfig {
  return {
    modelName: modelClass.modelName,
    endpoint: modelClass.endpoint,
    displayField: modelClass.displayField,
    icon: modelClass.icon,
    hasSeo: modelClass.hasSeo,
    fields: modelClass.getFields()
  };
}

// Exportar modelos
export { ObraModel, CapituloModel, ArcoModel, NoticiaModel, PersonajeFicticioModel, UsuarioModel, VariableSistemaModel, ImagenModel, ImagenGalleryModel };
export * from './base';
