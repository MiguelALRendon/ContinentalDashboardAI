import { Field, SeoBaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo Capitulo - Representa un capítulo de una obra con SEO
 */
export class CapituloModel extends SeoBaseModel {
  static override modelName = 'Capitulo';
  static override endpoint = '/capitulos';
  static override displayField = 'titulo';
  static override icon = 'Document';
  static override hasSeo = true;

  @Field({
    type: FieldType.String,
    label: 'Título',
    required: true,
    maxLength: 200,
    gridVisible: true,
    gridWidth: 250,
    gridSortable: true,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 1,
    placeholder: 'Título del capítulo'
  })
  titulo!: string;

  @Field({
    type: FieldType.Text,
    label: 'Descripción Larga',
    gridVisible: false,
    formGroup: 'general',
    formOrder: 2,
    editor: 'TextArea',
    placeholder: 'Descripción detallada del capítulo'
  })
  descripcion_larga?: string;

  @Field({
    type: FieldType.String,
    label: 'Descripción Corta',
    maxLength: 255,
    gridVisible: true,
    gridWidth: 300,
    formGroup: 'general',
    formOrder: 3,
    placeholder: 'Resumen breve del capítulo'
  })
  descripcion_corta?: string;

  @Field({
    type: FieldType.Image,
    label: 'Portada',
    gridVisible: true,
    gridWidth: 100,
    gridRender: 'image-thumbnail',
    formGroup: 'media',
    formOrder: 1,
    helpText: 'Imagen de portada del capítulo'
  })
  url_portada?: string;

  @Field({
    type: FieldType.Text,
    label: 'Texto del Capítulo',
    required: true,
    formGroup: 'contenido',
    formOrder: 1,
    editor: 'RichText',
    helpText: 'Contenido completo del capítulo'
  })
  texto_capitulo!: string;

  @Field({
    type: FieldType.Text,
    label: 'Comentario del Creador',
    formGroup: 'contenido',
    formOrder: 2,
    editor: 'TextArea',
    placeholder: 'Notas o comentarios del autor'
  })
  comentario_creador?: string;

  @Field({
    type: FieldType.Number,
    label: 'Número de Capítulo',
    required: true,
    min: 1,
    gridVisible: true,
    gridWidth: 120,
    gridSortable: true,
    formGroup: 'general',
    formOrder: 4,
    helpText: 'Número secuencial del capítulo'
  })
  numero_capitulo!: number;

  @Field({
    type: FieldType.ForeignKey,
    label: 'Obra',
    relatedModel: 'Obra',
    relatedField: 'nombre',
    required: true,
    gridVisible: true,
    gridWidth: 200,
    gridFilterable: true,
    formGroup: 'relaciones',
    formOrder: 1,
    helpText: 'Obra a la que pertenece este capítulo'
  })
  obra_id!: string;

  @Field({
    type: FieldType.ForeignKey,
    label: 'Subarco',
    relatedModel: 'Arco',
    relatedField: 'nombre',
    gridVisible: true,
    gridWidth: 200,
    gridFilterable: true,
    formGroup: 'relaciones',
    formOrder: 2,
    helpText: 'Subarco al que pertenece este capítulo (opcional)'
  })
  subarco_id?: string;
}
