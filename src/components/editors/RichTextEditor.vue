<template>
  <div class="rich-text-editor">
    <QuillEditor
      ref="quillEditorRef"
      v-model:content="internalValue"
      :options="editorOptions"
      :disabled="disabled"
      contentType="html"
      theme="snow"
      @update:content="handleUpdate"
      @ready="onEditorReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { FormFieldConfig } from '@/core/types';

interface Props {
  modelValue?: string;
  disabled?: boolean;
  fieldConfig?: FormFieldConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const internalValue = ref(props.modelValue || '');
const quillEditorRef = ref();

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue || '';
}, { immediate: true });

const handleUpdate = (value: string) => {
  emit('update:modelValue', value);
};

const onEditorReady = () => {
  // Configurar corrección ortográfica en español cuando el editor esté listo
  const editor = quillEditorRef.value?.getQuill();
  if (editor) {
    const editorElement = editor.root;
    editorElement.setAttribute('spellcheck', 'true');
    editorElement.setAttribute('lang', 'es');
  }
};

const editorOptions = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  },
  placeholder: 'Escribe tu texto aquí...',
  readOnly: false
};
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
}

:deep(.ql-container) {
  min-height: 400px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

:deep(.ql-editor) {
  min-height: 400px;
  line-height: 1.6;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #f5f7fa;
  border-color: var(--el-border-color);
}

:deep(.ql-container) {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-color: var(--el-border-color);
}

:deep(.ql-snow .ql-stroke) {
  stroke: #606266;
}

:deep(.ql-snow .ql-fill) {
  fill: #606266;
}

:deep(.ql-snow .ql-picker-label) {
  color: #606266;
}
</style>
