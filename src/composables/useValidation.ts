import { ref } from 'vue';
import { ValidationGenerator } from '@/core/generators';
import type { BaseModel } from '@/core/models/base';

/**
 * Composable para validación de formularios
 */
export function useValidation(modelClass: typeof BaseModel) {
  const errors = ref<Record<string, string>>({});
  const isValid = ref(true);

  /**
   * Valida un campo individual
   */
  const validateField = (fieldName: string, value: any): boolean => {
    const fields = modelClass.getFields();
    const fieldConfig = fields.get(fieldName);
    
    if (!fieldConfig) {
      return true;
    }

    const error = ValidationGenerator.validateValue(value, fieldConfig);
    
    if (error) {
      errors.value[fieldName] = error;
      return false;
    } else {
      delete errors.value[fieldName];
      return true;
    }
  };

  /**
   * Valida todo el formulario
   */
  const validate = (data: Record<string, any>): boolean => {
    const validationErrors = ValidationGenerator.validateModel(data, modelClass);
    errors.value = validationErrors;
    isValid.value = Object.keys(validationErrors).length === 0;
    return isValid.value;
  };

  /**
   * Limpia los errores
   */
  const clearErrors = () => {
    errors.value = {};
    isValid.value = true;
  };

  /**
   * Limpia el error de un campo específico
   */
  const clearFieldError = (fieldName: string) => {
    delete errors.value[fieldName];
  };

  /**
   * Establece un error personalizado
   */
  const setError = (fieldName: string, message: string) => {
    errors.value[fieldName] = message;
    isValid.value = false;
  };

  /**
   * Obtiene las reglas de validación para formularios de Element Plus
   */
  const getRules = () => {
    return ValidationGenerator.generateRules(modelClass);
  };

  return {
    errors,
    isValid,
    validateField,
    validate,
    clearErrors,
    clearFieldError,
    setError,
    getRules
  };
}
