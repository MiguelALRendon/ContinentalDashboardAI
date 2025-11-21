<template>
  <div class="file-upload-container">
    <el-upload
      class="file-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
      :disabled="disabled"
      :accept="acceptedFormats"
    >
      <div v-if="previewUrl" class="file-preview">
        <el-image
          :src="previewUrl"
          fit="contain"
          :preview-src-list="[previewUrl]"
          class="preview-image"
        />
        <div class="file-overlay">
          <el-button
            type="danger"
            :icon="Delete"
            circle
            size="small"
            @click.stop="handleRemove"
          />
        </div>
      </div>
      <div v-else class="upload-placeholder">
        <el-icon class="upload-icon">
          <Upload />
        </el-icon>
        <div class="upload-text">
          {{ helpText }}
        </div>
      </div>
    </el-upload>
    
    <div v-if="fileName" class="file-info">
      <el-icon><Document /></el-icon>
      <span>{{ fileName }}</span>
      <span class="file-size">{{ fileSize }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload, Delete, Document } from '@element-plus/icons-vue';
import type { UploadFile } from 'element-plus';

/**
 * Props del componente
 */
interface Props {
  modelValue?: File | null;
  disabled?: boolean;
  helpText?: string;
  maxSize?: number; // En MB
  allowedFormats?: string[]; // Ej: ['image/jpeg', 'image/png']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
  helpText: 'Arrastra un archivo o haz clic para subir',
  maxSize: 5,
  allowedFormats: () => ['image/jpeg', 'image/png']
});

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void;
}>();

/**
 * Estado local
 */
const selectedFile = ref<File | null>(props.modelValue);
const previewUrl = ref<string>('');
const fileName = ref<string>('');
const fileSize = ref<string>('');

/**
 * Formatos aceptados para el input
 */
const acceptedFormats = computed(() => props.allowedFormats.join(','));

/**
 * Formatear tamaño de archivo
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Manejo del cambio de archivo
 */
const handleFileChange = (file: UploadFile) => {
  const rawFile = file.raw;
  
  if (!rawFile) {
    return;
  }

  // Validar tipo de archivo
  if (!props.allowedFormats.includes(rawFile.type)) {
    const formats = props.allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ');
    ElMessage.error(`Solo se permiten archivos: ${formats}`);
    return;
  }
  
  // Validar tamaño
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  if (rawFile.size > maxSizeBytes) {
    ElMessage.error(`El tamaño del archivo no debe exceder ${props.maxSize}MB`);
    return;
  }

  // Guardar archivo
  selectedFile.value = rawFile;
  fileName.value = rawFile.name;
  fileSize.value = formatFileSize(rawFile.size);
  
  // Generar preview si es imagen
  if (rawFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(rawFile);
  }
  
  // Emitir el archivo
  emit('update:modelValue', rawFile);
};

/**
 * Eliminar archivo
 */
const handleRemove = () => {
  selectedFile.value = null;
  previewUrl.value = '';
  fileName.value = '';
  fileSize.value = '';
  emit('update:modelValue', null);
  ElMessage.info('Archivo eliminado');
};
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

.file-uploader {
  width: 100%;
}

.file-uploader :deep(.el-upload) {
  width: 100%;
}

.upload-placeholder {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  padding: 40px 20px;
  text-align: center;
}

.upload-placeholder:hover {
  border-color: var(--el-color-primary);
}

.upload-icon {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

.upload-text {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.file-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
  max-height: 300px;
}

.file-overlay {
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

.file-preview:hover .file-overlay {
  opacity: 1;
}

.file-info {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.file-size {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
