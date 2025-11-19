import type { BaseModel } from '@/core/models/base';
import type { FieldMetadata } from '@/core/types';
import { FieldType } from '@/core/types';

/**
 * Generador de reglas de validación
 */
export class ValidationGenerator {
  /**
   * Genera todas las reglas de validación para un modelo
   */
  static generateRules(modelClass: typeof BaseModel): Record<string, any[]> {
    const rules: Record<string, any[]> = {};
    const fields = modelClass.getFields();

    for (const [fieldName, fieldConfig] of fields) {
      const fieldRules = this.generateFieldRules(fieldName, fieldConfig);
      if (fieldRules.length > 0) {
        rules[fieldName] = fieldRules;
      }
    }

    return rules;
  }

  /**
   * Genera reglas de validación para un campo específico
   */
  static generateFieldRules(_fieldName: string, fieldConfig: FieldMetadata): any[] {
    const rules: any[] = [];

    // Validación de campo requerido
    if (fieldConfig.required) {
      rules.push({
        required: true,
        message: `${fieldConfig.label} es obligatorio`,
        trigger: 'blur'
      });
    }

    // Validación según tipo de campo
    switch (fieldConfig.type) {
      case FieldType.String:
      case FieldType.Text:
        if (fieldConfig.minLength) {
          rules.push({
            min: fieldConfig.minLength,
            message: `${fieldConfig.label} debe tener al menos ${fieldConfig.minLength} caracteres`,
            trigger: 'blur'
          });
        }
        if (fieldConfig.maxLength) {
          rules.push({
            max: fieldConfig.maxLength,
            message: `${fieldConfig.label} no puede exceder ${fieldConfig.maxLength} caracteres`,
            trigger: 'blur'
          });
        }
        break;

      case FieldType.Number:
        rules.push({
          type: 'number',
          message: `${fieldConfig.label} debe ser un número`,
          trigger: 'blur'
        });
        if (fieldConfig.min !== undefined) {
          rules.push({
            type: 'number',
            min: fieldConfig.min,
            message: `El valor mínimo es ${fieldConfig.min}`,
            trigger: 'blur'
          });
        }
        if (fieldConfig.max !== undefined) {
          rules.push({
            type: 'number',
            max: fieldConfig.max,
            message: `El valor máximo es ${fieldConfig.max}`,
            trigger: 'blur'
          });
        }
        break;

      case FieldType.Email:
        rules.push({
          type: 'email',
          message: 'Por favor ingrese un email válido',
          trigger: 'blur'
        });
        break;

      case FieldType.URL:
        rules.push({
          type: 'url',
          message: 'Por favor ingrese una URL válida',
          trigger: 'blur'
        });
        break;

      case FieldType.Boolean:
        rules.push({
          type: 'boolean',
          message: `${fieldConfig.label} debe ser verdadero o falso`,
          trigger: 'change'
        });
        break;

      case FieldType.Date:
      case FieldType.DateTime:
        rules.push({
          type: 'date',
          message: `${fieldConfig.label} debe ser una fecha válida`,
          trigger: 'change'
        });
        break;

      case FieldType.ForeignKey:
        if (fieldConfig.required) {
          rules.push({
            required: true,
            message: `Debe seleccionar ${fieldConfig.label}`,
            trigger: 'change'
          });
        }
        break;
    }

    // Validación con patrón personalizado
    if (fieldConfig.pattern) {
      rules.push({
        pattern: fieldConfig.pattern,
        message: `${fieldConfig.label} no cumple con el formato requerido`,
        trigger: 'blur'
      });
    }

    // Validación personalizada
    if (fieldConfig.customValidation) {
      rules.push({
        validator: (_rule: any, value: any, callback: any) => {
          const error = fieldConfig.customValidation!(value);
          if (error) {
            callback(new Error(error));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      });
    }

    return rules;
  }

  /**
   * Valida un valor individual
   */
  static validateValue(value: any, fieldConfig: FieldMetadata): string | null {
    // Campo requerido
    if (fieldConfig.required && (value === null || value === undefined || value === '')) {
      return `${fieldConfig.label} es obligatorio`;
    }

    // Si no hay valor y no es requerido, no validar
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // Validaciones según tipo
    switch (fieldConfig.type) {
      case FieldType.String:
      case FieldType.Text:
        if (typeof value !== 'string') {
          return `${fieldConfig.label} debe ser texto`;
        }
        if (fieldConfig.minLength && value.length < fieldConfig.minLength) {
          return `${fieldConfig.label} debe tener al menos ${fieldConfig.minLength} caracteres`;
        }
        if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
          return `${fieldConfig.label} no puede exceder ${fieldConfig.maxLength} caracteres`;
        }
        break;

      case FieldType.Number:
        const num = Number(value);
        if (isNaN(num)) {
          return `${fieldConfig.label} debe ser un número`;
        }
        if (fieldConfig.min !== undefined && num < fieldConfig.min) {
          return `El valor mínimo es ${fieldConfig.min}`;
        }
        if (fieldConfig.max !== undefined && num > fieldConfig.max) {
          return `El valor máximo es ${fieldConfig.max}`;
        }
        break;

      case FieldType.Email:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Por favor ingrese un email válido';
        }
        break;

      case FieldType.URL:
        try {
          new URL(value);
        } catch {
          return 'Por favor ingrese una URL válida';
        }
        break;
    }

    // Patrón personalizado
    if (fieldConfig.pattern && !fieldConfig.pattern.test(value)) {
      return `${fieldConfig.label} no cumple con el formato requerido`;
    }

    // Validación personalizada
    if (fieldConfig.customValidation) {
      return fieldConfig.customValidation(value);
    }

    return null;
  }

  /**
   * Valida un objeto completo contra un modelo
   */
  static validateModel(data: Record<string, any>, modelClass: typeof BaseModel): Record<string, string> {
    const errors: Record<string, string> = {};
    const fields = modelClass.getFields();

    for (const [fieldName, fieldConfig] of fields) {
      const error = this.validateValue(data[fieldName], fieldConfig);
      if (error) {
        errors[fieldName] = error;
      }
    }

    return errors;
  }
}
