<template>
  <div class="image-upload-container">
    <el-upload
      class="image-uploader"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :disabled="disabled"
      accept="image/jpeg,image/png,image/webp,image/gif"
    >
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
            @click.stop="handleRemove"
          />
        </div>
      </div>
      <el-icon v-else class="image-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    
    <div v-if="helpText" class="help-text">
      {{ helpText }}
    </div>
    
    <div v-if="showUrlInput" class="url-input-section">
      <el-divider>O ingresa una URL</el-divider>
      <el-input
        v-model="manualUrl"
        placeholder="https://ejemplo.com/imagen.jpg"
        @change="handleManualUrl"
      >
        <template #prepend>
          <el-icon><Link /></el-icon>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, Link } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';

/**
 * Props del componente
 */
interface Props {
  modelValue?: string;
  disabled?: boolean;
  helpText?: string;
  maxSize?: number; // En MB
  showUrlInput?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  helpText: 'Arrastra una imagen o haz clic para subir (JPG, PNG, WebP, GIF)',
  maxSize: Number(import.meta.env.VITE_UPLOAD_MAX_SIZE || 5242880) / 1024 / 1024, // Convertir a MB
  showUrlInput: true
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
 * URL y headers para upload
 */
const uploadUrl = computed(() => '/backend-api/upload/image');
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('auth_token');
  const urlBusqueda = localStorage.getItem('url_busqueda');
  return {
    'token': token || '',
    'url-busqueda': urlBusqueda || ''
  };
});

/**
 * Sincronizar con modelValue
 */
watch(() => props.modelValue, (newValue) => {
  imageUrl.value = newValue || '';
});

/**
 * Validación antes de subir
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allowedTypesStr = import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif';
  const allowedTypes = allowedTypesStr.split(',');
  
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('El archivo debe ser una imagen (JPG, PNG, WebP o GIF)');
    return false;
  }
  
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  if (rawFile.size > maxSizeBytes) {
    ElMessage.error(`El tamaño de la imagen no debe exceder ${props.maxSize}MB`);
    return false;
  }
  
  return true;
};

/**
 * Manejo de éxito en upload
 */
const handleSuccess: UploadProps['onSuccess'] = (response: any) => {
  if (response && response.url) {
    imageUrl.value = response.url;
    emit('update:modelValue', response.url);
    ElMessage.success('Imagen subida exitosamente');
  } else {
    ElMessage.error('Error al obtener URL de la imagen');
  }
};

/**
 * Manejo de error en upload
 */
const handleError: UploadProps['onError'] = (error: Error) => {
  console.error('Error al subir imagen:', error);
  ElMessage.error('Error al subir la imagen. Intenta nuevamente.');
};

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
const handleManualUrl = () => {
  if (manualUrl.value) {
    // Validar que sea una URL válida
    try {
      new URL(manualUrl.value);
      imageUrl.value = manualUrl.value;
      emit('update:modelValue', manualUrl.value);
      ElMessage.success('URL de imagen establecida');
    } catch {
      ElMessage.error('URL inválida. Ingresa una URL completa (https://...)');
      manualUrl.value = '';
    }
  }
};
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.image-uploader {
  width: 100%;
}

.image-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-uploader :deep(.el-upload):hover {
  border-color: var(--el-color-primary);
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  position: relative;
  width: 178px;
  height: 178px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  display: block;
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

.help-text {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.url-input-section {
  margin-top: 16px;
}
</style>
