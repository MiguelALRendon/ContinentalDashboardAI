import { Field, SeoBaseModel } from './base';
import { FieldType } from '@/core/types';

/**
 * Modelo Noticia - Representa una noticia con SEO
 */
export class NoticiaModel extends SeoBaseModel {
  static override modelName = 'Noticia';
  static override endpoint = '/noticias';
  static override displayField = 'titulo';
  static override icon = 'Notification';
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
    placeholder: 'Título de la noticia'
  })
  titulo!: string;

  @Field({
    type: FieldType.Text,
    label: 'Descripción Larga',
    gridVisible: false,
    formGroup: 'general',
    formOrder: 2,
    editor: 'TextArea',
    placeholder: 'Descripción detallada de la noticia'
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
    placeholder: 'Resumen breve de la noticia'
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
    helpText: 'Imagen de portada de la noticia'
  })
  url_portada?: string;

  @Field({
    type: FieldType.Text,
    label: 'Texto de la Noticia',
    required: true,
    formGroup: 'contenido',
    formOrder: 1,
    editor: 'RichText',
    helpText: 'Contenido completo de la noticia'
  })
  texto_noticia!: string;

  @Field({
    type: FieldType.ForeignKey,
    label: 'Autor',
    relatedModel: 'Usuario',
    relatedField: 'nombre',
    required: true,
    gridVisible: true,
    gridWidth: 150,
    gridFilterable: true,
    formGroup: 'general',
    formOrder: 4,
    helpText: 'Autor de la noticia'
  })
  autor_id!: string;
}
