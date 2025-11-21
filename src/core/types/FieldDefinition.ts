/**
 * Tipos de campos soportados en el sistema
 */
export enum FieldType {
  String = 'string',
  Text = 'text',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Image = 'image',
  File = 'file',
  Email = 'email',
  URL = 'url',
  ForeignKey = 'foreignkey',
  Select = 'select',
  MultiSelect = 'multiselect'
}

/**
 * Opciones de configuración para un campo del modelo
 */
export interface FieldOptions {
  type: FieldType;
  label: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  
  // Configuración de Grid
  gridVisible?: boolean;
  gridWidth?: number;
  gridRender?: 'default' | 'image-thumbnail' | 'badge' | 'link' | 'date' | 'datetime' | 'boolean';
  gridSortable?: boolean;
  gridFilterable?: boolean;
  
  // Configuración de Formulario
  formVisible?: boolean;
  formGroup?: string;
  formOrder?: number;
  editor?: string;
  placeholder?: string;
  helpText?: string;
  inputType?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  
  // Foreign Key
  relatedModel?: string;
  relatedField?: string;
  
  // Select
  options?: Array<{ label: string; value: any }>;
  
  // Validación personalizada
  customValidation?: (value: any) => string | null;
}

/**
 * Metadata de un campo en el modelo
 */
export interface FieldMetadata extends FieldOptions {
  name: string;
}

/**
 * Configuración completa de un modelo
 */
export interface ModelConfig {
  modelName: string;
  endpoint: string;
  displayField: string;
  icon?: string;
  hasSeo?: boolean;
  fields: Map<string, FieldMetadata>;
}
