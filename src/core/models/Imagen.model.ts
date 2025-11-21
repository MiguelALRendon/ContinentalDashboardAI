import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo Imagen - Representa las imágenes subidas al sistema
 */
export class ImagenModel extends BaseModel {
  static override modelName = 'Imagen';
  static override endpoint = '/imagenes';
  static override displayField = 'nombre';
  static override icon = 'Picture';

  @Field({
    type: FieldType.String,
    label: 'Nombre de la Imagen',
    required: true,
    maxLength: 255,
    gridVisible: true,
    gridWidth: 250,
    gridSortable: true,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 1,
    placeholder: 'Ej: portada-obra-1',
    helpText: 'Nombre descriptivo para la imagen'
  })
  nombre!: string;

  @Field({
    type: FieldType.File,
    label: 'Archivo de Imagen',
    required: true,
    gridVisible: false,
    formGroup: 'general',
    formOrder: 2,
    editor: 'FileUpload',
    helpText: 'Sube el archivo de imagen (JPG, PNG - Máx. 5MB)'
  })
  file?: File;

  @Field({
    type: FieldType.Image,
    label: 'Vista Previa',
    required: false,
    persist: false,
    gridVisible: true,
    gridWidth: 150,
    gridRender: 'image-thumbnail',
    formVisible: true
  })
  url_archivo?: string;
}
