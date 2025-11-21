import type { BaseModel } from '@/core/models/base';
import type { FormConfig, FormFieldConfig, FormGroupConfig } from '@/core/types';
import { FieldType } from '@/core/types';
import { humanize } from '@/utils/helpers';

/**
 * Generador de configuración para formularios dinámicos
 */
export class FormGenerator {
  /**
   * Genera la configuración completa del formulario
   */
  static generateFormConfig(modelClass: typeof BaseModel): FormConfig {
    const groups = new Map<string, FormFieldConfig[]>();
    const fields = modelClass.getFields();

    // Agrupar campos según su formGroup
    for (const [fieldName, fieldConfig] of fields) {
      // Excluir campos no visibles en formularios
      if (fieldConfig.formVisible === false) {
        continue;
      }
      
      // Excluir campos base que se manejan automáticamente
      if (['id', 'created_at', 'updated_at', 'url_busqueda'].includes(fieldName)) {
        continue;
      }

      const groupName = fieldConfig.formGroup || 'general';
      
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }

      const field: FormFieldConfig = {
        name: fieldName,
        label: fieldConfig.label,
        type: fieldConfig.type,
        editor: fieldConfig.editor || this.getDefaultEditor(fieldConfig.type),
        required: fieldConfig.required || false,
        maxLength: fieldConfig.maxLength,
        minLength: fieldConfig.minLength,
        min: fieldConfig.min,
        max: fieldConfig.max,
        validation: this.generateFieldValidation(fieldConfig),
        order: fieldConfig.formOrder || 999,
        placeholder: fieldConfig.placeholder,
        helpText: fieldConfig.helpText,
        inputType: fieldConfig.inputType
      };

      // Configuración especial para ForeignKey
      if (fieldConfig.type === FieldType.ForeignKey && fieldConfig.relatedModel) {
        field.dataSource = `${fieldConfig.relatedModel}Service`;
        field.displayExpr = fieldConfig.relatedField || 'nombre';
        field.valueExpr = 'id';
      }

      // Configuración especial para Select
      if (fieldConfig.type === FieldType.Select && fieldConfig.options) {
        field.options = fieldConfig.options;
      }

      groups.get(groupName)!.push(field);
    }

    // Convertir grupos a array y ordenar campos
    const formGroups: FormGroupConfig[] = Array.from(groups.entries()).map(([name, fields]) => ({
      name,
      title: this.getGroupTitle(name),
      fields: fields.sort((a, b) => a.order - b.order)
    }));

    // Ordenar grupos (general primero, seo al final)
    formGroups.sort((a, b) => {
      if (a.name === 'general') return -1;
      if (b.name === 'general') return 1;
      if (a.name === 'seo') return 1;
      if (b.name === 'seo') return -1;
      return a.name.localeCompare(b.name);
    });

    return { groups: formGroups };
  }

  /**
   * Obtiene el editor por defecto según el tipo de campo
   */
  private static getDefaultEditor(fieldType: FieldType): string {
    const editorMap: Record<FieldType, string> = {
      [FieldType.String]: 'TextInput',
      [FieldType.Text]: 'TextArea',
      [FieldType.Number]: 'NumberInput',
      [FieldType.Boolean]: 'Switch',
      [FieldType.Date]: 'DatePicker',
      [FieldType.DateTime]: 'DateTimePicker',
      [FieldType.Image]: 'ImageUploader',
      [FieldType.File]: 'FileUploader',
      [FieldType.Email]: 'EmailInput',
      [FieldType.URL]: 'URLInput',
      [FieldType.ForeignKey]: 'SelectInput',
      [FieldType.Select]: 'SelectInput',
      [FieldType.MultiSelect]: 'MultiSelectInput'
    };

    return editorMap[fieldType] || 'TextInput';
  }

  /**
   * Genera reglas de validación para un campo
   */
  private static generateFieldValidation(fieldConfig: any): any {
    const rules: any[] = [];

    if (fieldConfig.required) {
      rules.push({
        required: true,
        message: `${fieldConfig.label} es requerido`
      });
    }

    if (fieldConfig.maxLength) {
      rules.push({
        max: fieldConfig.maxLength,
        message: `${fieldConfig.label} no puede exceder ${fieldConfig.maxLength} caracteres`
      });
    }

    if (fieldConfig.minLength) {
      rules.push({
        min: fieldConfig.minLength,
        message: `${fieldConfig.label} debe tener al menos ${fieldConfig.minLength} caracteres`
      });
    }

    if (fieldConfig.type === FieldType.Email) {
      rules.push({
        type: 'email',
        message: 'Ingrese un email válido'
      });
    }

    if (fieldConfig.type === FieldType.URL) {
      rules.push({
        type: 'url',
        message: 'Ingrese una URL válida'
      });
    }

    if (fieldConfig.pattern) {
      rules.push({
        pattern: fieldConfig.pattern,
        message: `${fieldConfig.label} no cumple con el formato requerido`
      });
    }

    if (fieldConfig.min !== undefined) {
      rules.push({
        type: 'number',
        min: fieldConfig.min,
        message: `El valor mínimo es ${fieldConfig.min}`
      });
    }

    if (fieldConfig.max !== undefined) {
      rules.push({
        type: 'number',
        max: fieldConfig.max,
        message: `El valor máximo es ${fieldConfig.max}`
      });
    }

    return rules;
  }

  /**
   * Obtiene el título humanizado de un grupo
   */
  private static getGroupTitle(groupName: string): string {
    const titleMap: Record<string, string> = {
      'general': 'Información General',
      'media': 'Multimedia',
      'contenido': 'Contenido',
      'relaciones': 'Relaciones',
      'seo': 'SEO y Metadatos'
    };

    return titleMap[groupName] || humanize(groupName);
  }

  /**
   * Genera layout responsivo para el formulario
   */
  static generateLayout(formConfig: FormConfig): any {
    return {
      labelPosition: 'top',
      labelWidth: '120px',
      colCount: 2, // Dos columnas por defecto
      groups: formConfig.groups.map(group => ({
        ...group,
        colSpan: group.name === 'seo' ? 2 : 1 // SEO ocupa todo el ancho
      }))
    };
  }
}
