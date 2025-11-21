<template>
  <div class="card-grid-view">
    <!-- Toolbar -->
    <div class="grid-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" :icon="Plus" @click="emit('add')">
          Crear {{ modelClass.modelName }}
        </el-button>
        <el-button :icon="Refresh" @click="emit('refresh')">
          Refrescar
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <el-input
          v-model="searchText"
          placeholder="Buscar..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <p>Cargando...</p>
    </div>

    <!-- Card Grid -->
    <div v-else-if="items.length > 0" class="card-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="card"
        :style="{ backgroundColor: getCardColor(item.id || '') }"
      >
        <div class="card-content">
          <div class="card-text">
            {{ getDefaultValue(item) }}
          </div>
        </div>
        
        <div class="card-actions">
          <el-button-group>
            <el-button
              size="small"
              :icon="View"
              circle
              @click.stop="emit('view', item)"
            />
            <el-button
              size="small"
              :icon="Edit"
              circle
              @click.stop="emit('edit', item)"
            />
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              circle
              @click.stop="handleDelete(item)"
            />
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <el-empty description="No hay registros para mostrar">
        <el-button type="primary" :icon="Plus" @click="emit('add')">
          Crear {{ modelClass.modelName }}
        </el-button>
      </el-empty>
    </div>

    <!-- Pagination -->
    <div v-if="items.length > 0" class="grid-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="[12, 24, 48, 96]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends BaseModel">
import { ref, onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import {
  Plus,
  Delete,
  Refresh,
  Search,
  View,
  Edit,
  Loading
} from '@element-plus/icons-vue';
import type { BaseModel } from '@/core/models/base';
import type { PaginationState } from '@/composables/useCRUD';

interface Props {
  modelClass: typeof BaseModel;
  items: T[];
  loading: boolean;
  pagination: PaginationState;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  add: [];
  edit: [row: T];
  view: [row: T];
  delete: [row: T];
  'batch-delete': [rows: T[]];
  refresh: [];
  search: [term: string];
  'page-change': [page: number];
  'page-size-change': [size: number];
}>();

// Estado local
const searchText = ref('');
const currentPage = ref(1);
const currentPageSize = ref(12);

// Colores para las tarjetas tipo post-it
const postItColors = [
  '#FFE4B5', // Moccasin
  '#FFD1DC', // Pink
  '#E6E6FA', // Lavender
  '#B0E0E6', // Powder Blue
  '#FFDAB9', // Peach Puff
  '#F0E68C', // Khaki
  '#DDA0DD', // Plum
  '#98FB98', // Pale Green
  '#FFA07A', // Light Salmon
  '#87CEEB', // Sky Blue
  '#FFB6C1', // Light Pink
  '#F5DEB3', // Wheat
];

/**
 * Obtiene el campo por defecto del modelo
 */
const getDefaultFieldName = (): string => {
  const fields = props.modelClass.getFields();
  for (const [fieldName, metadata] of fields) {
    if (metadata.isDefault) {
      return fieldName;
    }
  }
  // Si no hay campo con isDefault, usar displayField
  return props.modelClass.displayField;
};

/**
 * Obtiene el valor del campo por defecto de un item
 */
const getDefaultValue = (item: any): string => {
  const fieldName = getDefaultFieldName();
  return item[fieldName] || 'Sin título';
};

/**
 * Genera un color consistente para cada tarjeta basado en su ID
 */
const getCardColor = (id: string): string => {
  // Usar el hash del ID para obtener un índice consistente
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % postItColors.length;
  return postItColors[index];
};

const handleSearch = (value: string) => {
  emit('search', value);
};

const handleDelete = async (item: T) => {
  try {
    await ElMessageBox.confirm(
      '¿Está seguro de eliminar este registro?',
      'Confirmar Eliminación',
      {
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    );
    emit('delete', item);
  } catch {
    // Cancelado
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit('page-change', page);
};

const handlePageSizeChange = (size: number) => {
  currentPageSize.value = size;
  emit('page-size-change', size);
};

onMounted(() => {
  currentPage.value = props.pagination.currentPage;
  currentPageSize.value = props.pagination.pageSize || 12;
});
</script>

<style scoped>
.card-grid-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
}

.toolbar-right .el-input {
  width: 300px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 15px;
}

.loading-container .el-icon {
  font-size: 48px;
  color: var(--el-color-primary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
}

.card {
  position: relative;
  min-height: 200px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card:hover {
  opacity: 0.85;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.card-text {
  color: #000;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  word-wrap: break-word;
  line-height: 1.5;
  max-width: 100%;
}

.card-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-top: 15px;
}

.card:hover .card-actions {
  opacity: 1;
}

.empty-state {
  padding: 80px 20px;
  display: flex;
  justify-content: center;
}

.grid-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  background: var(--el-bg-color);
  border-radius: 4px;
}
</style>
