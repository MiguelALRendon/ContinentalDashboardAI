import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo PersonajeFicticio - Representa un personaje ficticio
 */
export class PersonajeFicticioModel extends BaseModel {
  static override modelName = 'PersonajeFicticio';
  static override endpoint = '/personajes-ficticios';
  static override displayField = 'nombre';
  static override icon = 'User';

  @Field({
    type: FieldType.String,
    label: 'Nombre',
    required: true,
    maxLength: 100,
    gridVisible: true,
    gridWidth: 250,
    gridSortable: true,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 1,
    placeholder: 'Nombre del personaje'
  })
  nombre!: string;

  @Field({
    type: FieldType.Image,
    label: 'Foto de Perfil',
    gridVisible: true,
    gridWidth: 100,
    gridRender: 'image-thumbnail',
    formGroup: 'media',
    formOrder: 1,
    helpText: 'Imagen de perfil del personaje'
  })
  url_foto_perfil?: string;

  @Field({
    type: FieldType.Text,
    label: 'Descripción',
    gridVisible: true,
    gridWidth: 350,
    formGroup: 'general',
    formOrder: 2,
    editor: 'TextArea',
    placeholder: 'Descripción del personaje'
  })
  descripcion?: string;
}
