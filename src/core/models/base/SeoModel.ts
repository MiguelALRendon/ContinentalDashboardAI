import { Field, BaseModel } from './BaseModel';
import { FieldType } from '@/core/types';

/**
 * Modelo base con campos SEO predefinidos
 * Los modelos que necesiten SEO deben extender esta clase
 */
export abstract class SeoBaseModel extends BaseModel {
  static override hasSeo = true;

  @Field({
    type: FieldType.String,
    label: 'Título SEO',
    maxLength: 60,
    formGroup: 'seo',
    formOrder: 1,
    helpText: 'Título optimizado para motores de búsqueda (máx. 60 caracteres)'
  })
  titulo_seo?: string;

  @Field({
    type: FieldType.Text,
    label: 'Descripción SEO',
    maxLength: 160,
    formGroup: 'seo',
    formOrder: 2,
    helpText: 'Descripción optimizada para motores de búsqueda (máx. 160 caracteres)'
  })
  descripcion_seo?: string;

  @Field({
    type: FieldType.String,
    label: 'Slug',
    maxLength: 255,
    formGroup: 'seo',
    formOrder: 3,
    pattern: /^[a-z0-9-]+$/,
    helpText: 'URL amigable (solo letras minúsculas, números y guiones)'
  })
  slug?: string;

  @Field({
    type: FieldType.String,
    label: 'Keywords',
    maxLength: 255,
    formGroup: 'seo',
    formOrder: 4,
    editor: 'TagsInput',
    helpText: 'Palabras clave separadas por comas'
  })
  keywords?: string;

  @Field({
    type: FieldType.URL,
    label: 'URL Canónica',
    maxLength: 500,
    formGroup: 'seo',
    formOrder: 5
  })
  canonical_url?: string;

  @Field({
    type: FieldType.Boolean,
    label: 'No Index',
    formGroup: 'seo',
    formOrder: 6,
    helpText: 'Evitar indexación en motores de búsqueda'
  })
  no_index?: boolean;

  @Field({
    type: FieldType.Boolean,
    label: 'No Follow',
    formGroup: 'seo',
    formOrder: 7,
    helpText: 'No seguir enlaces en esta página'
  })
  no_follow?: boolean;

  @Field({
    type: FieldType.String,
    label: 'OG Title',
    maxLength: 95,
    formGroup: 'seo',
    formOrder: 8,
    helpText: 'Título para Open Graph (redes sociales)'
  })
  og_title?: string;

  @Field({
    type: FieldType.Text,
    label: 'OG Description',
    maxLength: 200,
    formGroup: 'seo',
    formOrder: 9,
    helpText: 'Descripción para Open Graph'
  })
  og_description?: string;

  @Field({
    type: FieldType.Image,
    label: 'OG Image',
    formGroup: 'seo',
    formOrder: 10,
    editor: 'ImageUploader',
    helpText: 'Imagen para compartir en redes sociales'
  })
  og_image?: string;

  @Field({
    type: FieldType.String,
    label: 'OG Type',
    maxLength: 50,
    formGroup: 'seo',
    formOrder: 11,
    helpText: 'Tipo de contenido Open Graph (article, website, etc.)'
  })
  og_type?: string;

  @Field({
    type: FieldType.URL,
    label: 'OG URL',
    maxLength: 500,
    formGroup: 'seo',
    formOrder: 12
  })
  og_url?: string;

  @Field({
    type: FieldType.String,
    label: 'Texto Alternativo Imagen',
    maxLength: 255,
    formGroup: 'seo',
    formOrder: 13,
    helpText: 'Descripción de la imagen para accesibilidad'
  })
  alt_text_image?: string;

  @Field({
    type: FieldType.String,
    label: 'Tipo de Schema',
    maxLength: 100,
    formGroup: 'seo',
    formOrder: 14,
    helpText: 'Tipo de datos estructurados (Article, Book, etc.)'
  })
  schema_type?: string;

  @Field({
    type: FieldType.String,
    label: 'Tags',
    maxLength: 500,
    formGroup: 'seo',
    formOrder: 15,
    editor: 'TagsInput',
    helpText: 'Etiquetas separadas por comas'
  })
  tags?: string;

  @Field({
    type: FieldType.Boolean,
    label: 'Compartir en Redes Sociales',
    formGroup: 'seo',
    formOrder: 16
  })
  social_sharing_enabled?: boolean;

  @Field({
    type: FieldType.Number,
    label: 'SEO Score',
    min: 0,
    max: 100,
    formGroup: 'seo',
    formOrder: 17,
    formVisible: false,
    gridVisible: true,
    gridWidth: 100,
    gridRender: 'badge'
  })
  seo_score?: number;
}
