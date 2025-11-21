import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { modelRegistry, getAllModels } from '@/core/models';
import type { BaseModel } from '@/core/models/base';

/**
 * Store para gestión de modelos registrados
 */
export const useModelStore = defineStore('model', () => {
  const models = ref(modelRegistry);

  /**
   * Obtiene todos los modelos como array
   */
  const modelList = computed(() => getAllModels());

  /**
   * Obtiene un modelo por nombre
   */
  const getModel = (modelName: string): typeof BaseModel | undefined => {
    return models.value.get(modelName);
  };

  /**
   * Obtiene los modelos para el menú de navegación
   */
  const navigationModels = computed(() => {
    return modelList.value.map(model => ({
      name: model.modelName,
      label: model.modelName,
      icon: model.icon || 'Document',
      path: `/${model.modelName.toLowerCase().replace(/\s+/g, '-')}`
    }));
  });

  /**
   * Registra un nuevo modelo dinámicamente
   */
  const registerModel = (modelClass: typeof BaseModel) => {
    models.value.set(modelClass.modelName, modelClass);
  };

  return {
    models,
    modelList,
    navigationModels,
    getModel,
    registerModel
  };
});
