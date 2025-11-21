import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo Arco - Representa un arco narrativo o subarco
 */
export class ArcoModel extends BaseModel {
  static override modelName = 'Arco';
  static override endpoint = '/arcos';
  static override displayField = 'nombre';
  static override icon = 'List';

  @Field({
    type: FieldType.String,
    label: 'Nombre del Arco',
    required: true,
    maxLength: 100,
    gridVisible: true,
    gridWidth: 250,
    gridSortable: true,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 1,
    placeholder: 'Nombre del arco narrativo'
  })
  nombre!: string;

  @Field({
    type: FieldType.String,
    label: 'URL de Búsqueda',
    required: true,
    maxLength: 255,
    gridVisible: true,
    gridWidth: 200,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 2,
    placeholder: 'url-unica-del-arco',
    helpText: 'URL única para identificar este arco. Alfanumérico, guiones permitidos.',
    pattern: '^[a-zA-Z0-9-_]+$'
  })
  url_busqueda!: string;

  @Field({
    type: FieldType.Boolean,
    label: 'Es Subarco',
    gridVisible: true,
    gridWidth: 100,
    gridRender: 'boolean',
    formGroup: 'general',
    formOrder: 3,
    helpText: 'Indica si es un subarco dentro de un arco principal'
  })
  es_subarco?: boolean;
}
