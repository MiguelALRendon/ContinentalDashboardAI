import type { FieldOptions, FieldMetadata } from '@/core/types';
import { ViewType } from '@/core/types';

/**
 * Almacena los metadatos de los campos de cada modelo
 */
const modelFieldsMetadata = new WeakMap<any, Map<string, FieldMetadata>>();

/**
 * Decorador para definir campos en los modelos
 * @param options Opciones de configuración del campo
 */
export function Field(options: FieldOptions) {
  return function (target: any, propertyKey: string) {
    // Almacenar metadatos directamente en el prototype
    if (!modelFieldsMetadata.has(target)) {
      modelFieldsMetadata.set(target, new Map());
    }
    
    const fields = modelFieldsMetadata.get(target)!;
    fields.set(propertyKey, {
      ...options,
      name: propertyKey
    });
  };
}

/**
 * Obtiene los metadatos de campos de un modelo
 */
export function getFieldsMetadata(target: any): Map<string, FieldMetadata> {
  return modelFieldsMetadata.get(target) || new Map();
}

/**
 * Clase base para todos los modelos
 */
export abstract class BaseModel {
  // Campos heredados de BaseObject del backend
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  estatus?: number; // 1 = ACTIVO, -1 = INACTIVO
  url_busqueda?: string;

  // Configuración estática del modelo (debe ser sobrescrita)
  static modelName = 'BaseModel';
  static endpoint = '/base';
  static displayField = 'id';
  static icon = 'Document';
  static hasSeo = false;
  static viewType: ViewType = ViewType.Table;

  /**
   * Obtiene todos los campos definidos en el modelo
   */
  static getFields(): Map<string, FieldMetadata> {
    const allFields = new Map<string, FieldMetadata>();
    
    // Recorrer toda la cadena de prototipos para obtener todos los campos
    let currentProto = this.prototype;
    while (currentProto && currentProto !== Object.prototype) {
      const fields = getFieldsMetadata(currentProto);
      // Agregar campos que no existen ya (los campos de clases hijas tienen prioridad)
      for (const [name, metadata] of fields) {
        if (!allFields.has(name)) {
          allFields.set(name, metadata);
        }
      }
      currentProto = Object.getPrototypeOf(currentProto);
    }
    
    return allFields;
  }

  /**
   * Convierte el modelo a un objeto plano
   */
  toJSON(): Record<string, any> {
    const json: Record<string, any> = {};
    const constructor = this.constructor as typeof BaseModel;
    const fields = constructor.getFields();
    
    for (const [fieldName] of fields) {
      if ((this as any)[fieldName] !== undefined) {
        json[fieldName] = (this as any)[fieldName];
      }
    }
    
    return json;
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromJSON<T extends BaseModel>(this: new () => T, data: Record<string, any>): T {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }

  /**
   * Prepara los datos para enviar al backend
   * Excluye campos auto-gestionados, no persistentes y mantiene ForeignKeys tal cual
   */
  static prepareForBackend(data: Record<string, any>): Record<string, any> {
    const prepared: Record<string, any> = {};
    
    // Campos que no deben enviarse al backend
    const excludedFields = ['id', 'created_at', 'updated_at', 'url_busqueda'];
    
    // Obtener metadatos de campos para verificar persist
    const fields = this.getFields();
    
    for (const [key, value] of Object.entries(data)) {
      // Excluir campos auto-gestionados
      if (excludedFields.includes(key)) {
        continue;
      }
      
      // Excluir campos no persistentes (persist: false)
      const fieldMetadata = fields.get(key);
      if (fieldMetadata && fieldMetadata.persist === false) {
        continue;
      }
      
      // Excluir valores undefined o null en campos opcionales
      if (value === undefined) {
        continue;
      }
      
      // Incluir el campo (el SelectInput ya asignó el UUID correcto)
      prepared[key] = value;
    }
    
    return prepared;
  }
}

/**
 * Mixin para modelos con campos SEO
 */
export class SeoMixin {
  titulo_seo?: string;
  descripcion_seo?: string;
  slug?: string;
  keywords?: string;
  canonical_url?: string;
  no_index?: boolean;
  no_follow?: boolean;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_url?: string;
  alt_text_image?: string;
  schema_type?: string;
  tags?: string;
  social_sharing_enabled?: boolean;
  seo_score?: number;
}
