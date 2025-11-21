<template>
  <div class="image-upload-container">
    <div v-if="imageUrl" class="image-preview">
      <el-image
        :src="imageUrl"
        fit="contain"
        :preview-src-list="[imageUrl]"
        class="uploaded-image"
      />
      <div class="image-overlay">
        <el-button
          type="danger"
          :icon="Delete"
          circle
          size="small"
          @click="handleRemove"
        />
      </div>
    </div>
    
    <div class="url-input-section">
      <el-input
        v-model="manualUrl"
        placeholder="https://ejemplo.com/imagen.jpg"
        :disabled="disabled"
        clearable
      >
        <template #prepend>
          <el-icon><Link /></el-icon>
        </template>
      </el-input>
      <div v-if="manualUrl && !isValidUrl(manualUrl)" class="error-text">
        URL inválida. Debe ser una URL completa (https://...)
      </div>
      <div v-if="helpText" class="help-text">
        {{ helpText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, Link } from '@element-plus/icons-vue';

/**
 * Props del componente
 */
interface Props {
  modelValue?: string;
  disabled?: boolean;
  helpText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  helpText: 'Ingresa la URL de la imagen (JPG, PNG)'
});

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

/**
 * Estado local
 */
const imageUrl = ref<string>(props.modelValue);
const manualUrl = ref<string>('');

/**
 * Valida si una cadena es una URL válida
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sincronizar con modelValue
 */
watch(() => props.modelValue, (newValue) => {
  imageUrl.value = newValue || '';
  if (newValue && isValidUrl(newValue)) {
    manualUrl.value = newValue;
  }
}, { immediate: true });

/**
 * Eliminar imagen
 */
const handleRemove = () => {
  imageUrl.value = '';
  manualUrl.value = '';
  emit('update:modelValue', '');
  ElMessage.info('Imagen eliminada');
};

/**
 * Manejar URL manual
 */
watch(manualUrl, (newUrl) => {
  if (newUrl && isValidUrl(newUrl)) {
    imageUrl.value = newUrl;
    emit('update:modelValue', newUrl);
  } else if (!newUrl) {
    imageUrl.value = '';
    emit('update:modelValue', '');
  }
});
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: auto;
  display: block;
  max-height: 300px;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.url-input-section {
  width: 100%;
}

.help-text {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.error-text {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-color-danger);
}
</style>
