<template>
  <el-select
    :model-value="actualValue"
    :disabled="disabled"
    :placeholder="fieldConfig?.placeholder || 'Seleccione...'"
    :loading="loading"
    clearable
    filterable
    style="width: 100%"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { FormFieldConfig } from '@/core/types';
import { ApiServiceFactory } from '@/core/services';
import { getModel } from '@/core/models';

interface Props {
  modelValue?: string;
  disabled?: boolean;
  fieldConfig?: FormFieldConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const loading = ref(false);
const items = ref<any[]>([]);

// Computed que convierte url_busqueda a UUID si es necesario
const actualValue = computed(() => {
  if (!props.modelValue || !props.fieldConfig?.dataSource || items.value.length === 0) {
    return props.modelValue;
  }
  
  const valueField = props.fieldConfig.valueExpr || 'id';
  
  // Si el modelValue ya es un UUID válido, devolverlo tal cual
  const matchById = items.value.find(item => item[valueField] === props.modelValue);
  if (matchById) {
    return props.modelValue;
  }
  
  // Si no es UUID, buscar por url_busqueda y devolver el UUID
  const matchBySlug = items.value.find(item => item.url_busqueda === props.modelValue);
  if (matchBySlug) {
    // Emitir el UUID correcto para actualizar el modelo
    emit('update:modelValue', matchBySlug[valueField]);
    return matchBySlug[valueField];
  }
  
  return props.modelValue;
});

const options = computed(() => {
  // Si el campo tiene opciones estáticas
  if (props.fieldConfig?.options) {
    return props.fieldConfig.options;
  }

  // Si es un ForeignKey, usar datos cargados
  if (props.fieldConfig?.dataSource && items.value.length > 0) {
    const displayField = props.fieldConfig.displayExpr || 'nombre';
    const valueField = props.fieldConfig.valueExpr || 'id';
    
    return items.value.map(item => ({
      label: item[displayField],
      value: item[valueField]
    }));
  }

  return [];
});

onMounted(async () => {
  // Cargar datos para ForeignKey
  if (props.fieldConfig?.dataSource) {
    const modelName = props.fieldConfig.dataSource.replace('Service', '');
    const modelClass = getModel(modelName);
    
    if (modelClass) {
      loading.value = true;
      try {
        const service = ApiServiceFactory.getService(modelClass);
        items.value = await service.listActive();
      } catch (error) {
        console.error('Error loading select options:', error);
      } finally {
        loading.value = false;
      }
    }
  }
});
</script>
