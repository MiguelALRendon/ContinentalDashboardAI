import { Field, BaseModel } from './base';
import { FieldType, ViewType } from '@/core/types';

/**
 * Modelo ImagenGallery - Galería de imágenes con vista de tarjetas
 */
export class ImagenGalleryModel extends BaseModel {
  static override modelName = 'Galería de Imágenes';
  static override endpoint = '/imagenes';
  static override displayField = 'nombre';
  static override icon = 'Picture';
  static override viewType = ViewType.CardGrid;

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
    helpText: 'Nombre descriptivo para la imagen',
    isDefault: true
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
