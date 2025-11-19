import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo Obra - Representa una obra literaria
 */
export class ObraModel extends BaseModel {
  static override modelName = 'Obra';
  static override endpoint = '/obras';
  static override displayField = 'nombre';
  static override icon = 'Reading';

  @Field({
    type: FieldType.String,
    label: 'Nombre de la Obra',
    required: true,
    maxLength: 100,
    gridVisible: true,
    gridWidth: 250,
    gridSortable: true,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 1,
    placeholder: 'Ingrese el nombre de la obra'
  })
  nombre!: string;

  @Field({
    type: FieldType.Text,
    label: 'Descripción',
    required: false,
    gridVisible: true,
    gridWidth: 350,
    formGroup: 'general',
    formOrder: 2,
    editor: 'TextArea',
    placeholder: 'Descripción de la obra'
  })
  descripcion?: string;

  @Field({
    type: FieldType.Image,
    label: 'Portada',
    gridVisible: true,
    gridWidth: 100,
    gridRender: 'image-thumbnail',
    formGroup: 'media',
    formOrder: 1,
    helpText: 'Imagen de portada de la obra'
  })
  url_portada?: string;

  @Field({
    type: FieldType.Number,
    label: 'Orden',
    gridVisible: true,
    gridWidth: 80,
    gridSortable: true,
    formGroup: 'general',
    formOrder: 3,
    min: 0,
    helpText: 'Orden de visualización'
  })
  orden?: number;

}
