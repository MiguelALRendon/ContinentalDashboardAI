import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo Usuario - Representa un usuario del sistema
 */
export class UsuarioModel extends BaseModel {
  static override modelName = 'Usuario';
  static override endpoint = '/usuarios';
  static override displayField = 'nombre';
  static override icon = 'UserFilled';

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
    placeholder: 'Nombre del usuario'
  })
  nombre!: string;

  @Field({
    type: FieldType.String,
    label: 'Dirección MAC PC',
    maxLength: 17,
    gridVisible: true,
    gridWidth: 150,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 2,
    placeholder: 'XX:XX:XX:XX:XX:XX',
    helpText: 'Dirección MAC del dispositivo PC'
  })
  direccion_mac_pc?: string;

  @Field({
    type: FieldType.String,
    label: 'Dirección MAC Mobile',
    maxLength: 17,
    gridVisible: true,
    gridWidth: 150,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 3,
    placeholder: 'XX:XX:XX:XX:XX:XX',
    helpText: 'Dirección MAC del dispositivo móvil'
  })
  direccion_mac_mobile?: string;
}
