import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo VariableSistema - Representa una variable de configuración del sistema
 */
export class VariableSistemaModel extends BaseModel {
  static override modelName = 'VariableSistema';
  static override endpoint = '/variables-sistema';
  static override displayField = 'nombre';
  static override icon = 'Setting';

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
    placeholder: 'Nombre de la variable'
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
    placeholder: 'url-unica-de-la-variable',
    helpText: 'URL única para identificar esta variable. Alfanumérico, guiones permitidos.',
    pattern: /^[a-zA-Z0-9-_]+$/
  })
  url_busqueda!: string;

  @Field({
    type: FieldType.Text,
    label: 'Valor',
    required: true,
    gridVisible: true,
    gridWidth: 350,
    formGroup: 'general',
    formOrder: 3,
    editor: 'TextArea',
    placeholder: 'Valor de la variable'
  })
  valor!: string;
}
