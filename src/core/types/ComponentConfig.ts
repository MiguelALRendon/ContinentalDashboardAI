/**
 * Configuración de columna para DataGrid
 */
export interface GridColumnConfig {
  field: string;
  header: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  type: string;
  render?: string;
  lookup?: {
    dataSource: string;
    displayField: string;
    valueField: string;
  };
}

/**
 * Configuración de toolbar para DataGrid
 */
export interface GridToolbarConfig {
  items: Array<{
    type: 'add' | 'delete' | 'refresh' | 'export' | 'separator' | 'search' | 'custom';
    text?: string;
    icon?: string;
    placeholder?: string;
    action?: () => void;
  }>;
}

/**
 * Configuración de campo para formulario
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  editor: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  validation?: any;
  order: number;
  dataSource?: string;
  displayExpr?: string;
  valueExpr?: string;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  helpText?: string;
}

/**
 * Configuración de grupo de formulario
 */
export interface FormGroupConfig {
  name: string;
  title: string;
  fields: FormFieldConfig[];
}

/**
 * Configuración completa del formulario
 */
export interface FormConfig {
  groups: FormGroupConfig[];
}
