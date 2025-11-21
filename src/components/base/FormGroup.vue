<template>
  <div class="form-group">
    <el-row :gutter="20">
      <el-col
        v-for="field in group.fields"
        :key="field.name"
        :span="getFieldSpan(field)"
      >
        <el-form-item
          :label="field.label"
          :required="field.required"
          :error="errors[field.name]"
        >
          <component
            :is="getEditorComponent(field.editor)"
            :model-value="(modelValue || {})[field.name]"
            :disabled="disabled"
            :field-config="field"
            @update:model-value="(val: any) => emit('update:modelValue', field.name, val)"
          />
          <div v-if="field.helpText" class="field-help">
            {{ field.helpText }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue';
import type { FormGroupConfig, FormFieldConfig } from '@/core/types';
import TextInput from '../editors/TextInput.vue';
import TextArea from '../editors/TextArea.vue';
import NumberInput from '../editors/NumberInput.vue';
import Switch from '../editors/Switch.vue';
import SelectInput from '../editors/SelectInput.vue';
import RichTextEditor from '../editors/RichTextEditor.vue';
import ImageUpload from '../editors/ImageUpload.vue';
import FileUpload from '../editors/FileUpload.vue';
import TagsInput from '../editors/TagsInput.vue';

interface Props {
  group: FormGroupConfig;
  modelValue: Record<string, any>;
  errors: Record<string, string>;
  disabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [field: string, value: any];
}>();



const editorComponents: Record<string, any> = {
  TextInput: markRaw(TextInput),
  TextArea: markRaw(TextArea),
  NumberInput: markRaw(NumberInput),
  Switch: markRaw(Switch),
  SelectInput: markRaw(SelectInput),
  EmailInput: markRaw(TextInput),
  URLInput: markRaw(TextInput),
  DatePicker: markRaw(TextInput), // Placeholder
  DateTimePicker: markRaw(TextInput), // Placeholder
  ImageUploader: markRaw(ImageUpload),
  FileUploader: markRaw(FileUpload),
  FileUpload: markRaw(FileUpload),
  TagsInput: markRaw(TagsInput),
  RichText: markRaw(RichTextEditor)
};

const getEditorComponent = (editorName: string) => {
  return editorComponents[editorName] || editorComponents.TextInput;
};

const getFieldSpan = (field: FormFieldConfig): number => {
  // Campos de texto largo ocupan todo el ancho
  if (field.type === 'text' || field.editor === 'TextArea' || field.editor === 'RichText') {
    return 24;
  }
  // Por defecto también usar todo el ancho para mejor legibilidad
  return 24;
};
</script>

<style scoped>
.form-group {
  padding: 20px 0;
}

.field-help {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 5px;
}
</style>
