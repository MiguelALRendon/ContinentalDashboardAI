<template>
  <el-input-number
    :model-value="modelValue"
    :disabled="disabled"
    :min="fieldConfig?.min"
    :max="fieldConfig?.max"
    :placeholder="fieldConfig?.placeholder"
    style="width: 100%"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { FormFieldConfig } from '@/core/types';

interface Props {
  modelValue?: number;
  disabled?: boolean;
  fieldConfig?: FormFieldConfig;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();
</script>
