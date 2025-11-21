<template>
  <div class="tags-input-container">
    <el-tag
      v-for="tag in tags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleRemoveTag(tag)"
      class="tag-item"
    >
      {{ tag }}
    </el-tag>
    
    <el-input
      v-if="inputVisible"
      ref="inputRef"
      v-model="inputValue"
      class="tag-input"
      size="small"
      :placeholder="placeholder"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput"
    >
      + {{ addButtonText }}
    </el-button>
    
    <div v-if="helpText" class="help-text">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import type { InputInstance } from 'element-plus';

/**
 * Props del componente
 */
interface Props {
  modelValue?: string;
  separator?: string;
  maxTags?: number;
  maxLength?: number;
  placeholder?: string;
  helpText?: string;
  addButtonText?: string;
  allowDuplicates?: boolean;
  caseSensitive?: boolean;
  trimTags?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  separator: ',',
  maxTags: 20,
  maxLength: 50,
  placeholder: 'Escribe y presiona Enter',
  helpText: 'Presiona Enter o pierde el foco para agregar un tag',
  addButtonText: 'Nuevo Tag',
  allowDuplicates: false,
  caseSensitive: false,
  trimTags: true
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
const inputVisible = ref(false);
const inputValue = ref('');
const inputRef = ref<InputInstance>();

/**
 * Tags procesados desde modelValue
 */
const tags = computed<string[]>(() => {
  if (!props.modelValue) return [];
  return props.modelValue
    .split(props.separator)
    .map(tag => props.trimTags ? tag.trim() : tag)
    .filter(tag => tag.length > 0);
});

/**
 * Sincronizar con modelValue externo
 */
watch(() => props.modelValue, (newValue) => {
  // Si el valor externo cambia, asegurarse de que esté formateado correctamente
  if (newValue) {
    const processedTags = newValue
      .split(props.separator)
      .map(tag => props.trimTags ? tag.trim() : tag)
      .filter(tag => tag.length > 0);
    const newFormattedValue = processedTags.join(props.separator + ' ');
    if (newFormattedValue !== newValue) {
      emit('update:modelValue', newFormattedValue);
    }
  }
});

/**
 * Mostrar input para agregar tag
 */
const showInput = () => {
  if (tags.value.length >= props.maxTags) {
    ElMessage.warning(`Máximo ${props.maxTags} tags permitidos`);
    return;
  }
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

/**
 * Confirmar input de nuevo tag
 */
const handleInputConfirm = () => {
  if (!inputValue.value) {
    inputVisible.value = false;
    return;
  }

  let newTag = props.trimTags ? inputValue.value.trim() : inputValue.value;
  
  // Validar longitud
  if (newTag.length > props.maxLength) {
    ElMessage.error(`El tag no debe exceder ${props.maxLength} caracteres`);
    return;
  }
  
  // Validar duplicados
  if (!props.allowDuplicates) {
    const existingTags = props.caseSensitive 
      ? tags.value 
      : tags.value.map(t => t.toLowerCase());
    const checkTag = props.caseSensitive ? newTag : newTag.toLowerCase();
    
    if (existingTags.includes(checkTag)) {
      ElMessage.warning('Este tag ya existe');
      inputValue.value = '';
      inputVisible.value = false;
      return;
    }
  }
  
  // Agregar nuevo tag
  const updatedTags = [...tags.value, newTag];
  const newValue = updatedTags.join(props.separator + ' ');
  emit('update:modelValue', newValue);
  
  inputValue.value = '';
  inputVisible.value = false;
};

/**
 * Eliminar un tag
 */
const handleRemoveTag = (tag: string) => {
  const updatedTags = tags.value.filter(t => t !== tag);
  const newValue = updatedTags.join(props.separator + ' ');
  emit('update:modelValue', newValue);
};
</script>

<style scoped>
.tags-input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin: 0;
}

.tag-input {
  width: 120px;
}

.button-new-tag {
  height: 24px;
  padding: 0 8px;
  line-height: 22px;
}

.help-text {
  width: 100%;
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
