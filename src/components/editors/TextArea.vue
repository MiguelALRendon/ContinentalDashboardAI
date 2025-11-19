<template>
  <el-input
    :model-value="modelValue"
    :disabled="disabled"
    :placeholder="fieldConfig?.placeholder"
    :maxlength="fieldConfig?.maxLength"
    :rows="4"
    :show-word-limit="!!fieldConfig?.maxLength"
    type="textarea"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { FormFieldConfig } from '@/core/types';

interface Props {
  modelValue?: string;
  disabled?: boolean;
  fieldConfig?: FormFieldConfig;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
