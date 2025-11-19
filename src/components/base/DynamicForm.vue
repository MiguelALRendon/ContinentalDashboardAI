<template>
  <div class="dynamic-form">
    <el-tabs v-model="currentTab" v-if="formConfig.groups.length > 1">
      <el-tab-pane
        v-for="group in formConfig.groups"
        :key="group.name"
        :label="group.title"
        :name="group.name"
      >
        <FormGroup
          :group="group"
          :model-value="internalValue"
          :errors="errors"
          :disabled="mode === 'view'"
          @update:model-value="handleUpdate"
        />
      </el-tab-pane>
    </el-tabs>

    <FormGroup
      v-else-if="formConfig.groups.length === 1"
      :group="formConfig.groups[0]"
      :model-value="internalValue"
      :errors="errors"
      :disabled="mode === 'view'"
      @update:model-value="handleUpdate"
    />

    <div class="form-actions" v-if="mode !== 'view'">
      <el-button type="primary" @click="handleSubmit">
        {{ mode === 'create' ? 'Crear' : 'Actualizar' }}
      </el-button>
      <el-button @click="emit('cancel')">
        Cancelar
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends BaseModel">
import { ref, computed, watch } from 'vue';
import { FormGenerator } from '@/core/generators';
import { useValidation } from '@/composables';
import type { BaseModel } from '@/core/models/base';
import FormGroup from './FormGroup.vue';

interface Props {
  modelClass: typeof BaseModel;
  modelValue?: T;
  mode: 'create' | 'edit' | 'view';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: T];
  submit: [value: T];
  cancel: [];
}>();

const internalValue = ref<Partial<T>>({});
const currentTab = ref('general');

const formConfig = computed(() => {
  return FormGenerator.generateFormConfig(props.modelClass);
});
const { errors, validate } = useValidation(props.modelClass);

// Inicializar valor
watch(
  () => props.modelValue,
  (newValue) => {
    console.log('DynamicForm - modelValue changed:', newValue);
    if (newValue) {
      internalValue.value = { ...newValue };
    } else {
      internalValue.value = {};
    }
    console.log('DynamicForm - internalValue updated:', internalValue.value);
  },
  { immediate: true }
);

// Establecer tab inicial
watch(
  formConfig,
  (config) => {
    if (config.groups.length > 0) {
      currentTab.value = config.groups[0].name;
    }
  },
  { immediate: true }
);

const handleUpdate = (field: string, value: any) => {
  internalValue.value = {
    ...internalValue.value,
    [field]: value
  };
  emit('update:modelValue', internalValue.value as T);
};

const handleSubmit = () => {
  if (validate(internalValue.value as Record<string, any>)) {
    emit('submit', internalValue.value as T);
  }
};
</script>

<style scoped>
.dynamic-form {
  padding: 20px;
}

.form-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
