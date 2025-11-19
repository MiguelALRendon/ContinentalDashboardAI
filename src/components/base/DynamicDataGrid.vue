<template>
  <div class="dynamic-data-grid">
    <!-- Toolbar -->
    <div class="grid-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" :icon="Plus" @click="emit('add')">
          {{ toolbar.items[0].text }}
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          {{ toolbar.items[1].text }}
        </el-button>
        <el-button :icon="Refresh" @click="emit('refresh')">
          {{ toolbar.items[2].text }}
        </el-button>
        <el-button :icon="Download" @click="handleExport">
          {{ toolbar.items[3].text }}
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <el-input
          v-model="searchText"
          :placeholder="toolbar.items[5].placeholder"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      v-loading="loading"
      :data="items"
      stripe
      border
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column v-if="allowSelection" type="selection" width="55" />
      
      <el-table-column
        v-for="col in columns"
        :key="col.field"
        :prop="col.field"
        :label="col.header"
        :width="col.width"
        :sortable="col.sortable ? 'custom' : false"
        :filters="getColumnFilters(col)"
        :filter-method="col.filterable ? filterHandler : undefined"
      >
        <template #default="{ row }">
          <CellRenderer :column="col" :row="row" />
        </template>
      </el-table-column>

      <el-table-column label="Acciones" width="150" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" :icon="View" @click="() => { console.log('View clicked:', row); emit('view', row); }" />
            <el-button size="small" :icon="Edit" @click="emit('edit', row)" />
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleDelete(row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="grid-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends BaseModel">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Plus,
  Delete,
  Refresh,
  Download,
  Search,
  View,
  Edit
} from '@element-plus/icons-vue';
import { GridGenerator } from '@/core/generators';
import type { BaseModel } from '@/core/models/base';
import type { GridColumnConfig } from '@/core/types';
import type { PaginationState } from '@/composables/useCRUD';
import CellRenderer from './CellRenderer.vue';

interface Props {
  modelClass: typeof BaseModel;
  items: T[];
  loading: boolean;
  pagination: PaginationState;
  allowSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  allowSelection: true
});

const emit = defineEmits<{
  add: [];
  edit: [row: T];
  view: [row: T];
  delete: [row: T];
  'batch-delete': [rows: T[]];
  refresh: [];
  search: [term: string];
  sort: [field: string, order: 'asc' | 'desc'];
  'page-change': [page: number];
  'page-size-change': [size: number];
}>();

// Estado local
const selectedRows = ref<T[]>([]);
const searchText = ref('');
const currentPage = ref(1);
const currentPageSize = ref(20);

// Configuración generada
const columns = computed(() => GridGenerator.generateColumns(props.modelClass));
const toolbar = computed(() => GridGenerator.generateToolbar(props.modelClass.modelName));

// Handlers
const handleSelectionChange = (rows: T[]) => {
  selectedRows.value = rows;
};

const handleSortChange = ({ prop, order }: any) => {
  if (prop && order) {
    emit('sort', prop, order === 'ascending' ? 'asc' : 'desc');
  }
};

const handleSearch = (value: string) => {
  emit('search', value);
};

const handleDelete = async (row: T) => {
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
    emit('delete', row);
  } catch {
    // Cancelado
  }
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `¿Está seguro de eliminar ${selectedRows.value.length} registros?`,
      'Confirmar Eliminación',
      {
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    );
    emit('batch-delete', selectedRows.value as T[]);
    selectedRows.value = [];
  } catch {
    // Cancelado
  }
};

const handleExport = () => {
  ElMessage.info('Función de exportación en desarrollo');
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit('page-change', page);
};

const handlePageSizeChange = (size: number) => {
  currentPageSize.value = size;
  emit('page-size-change', size);
};

const getColumnFilters = (_col: GridColumnConfig) => {
  // TODO: Implementar filtros dinámicos
  return undefined;
};

const filterHandler = () => {
  return true;
};

onMounted(() => {
  currentPage.value = props.pagination.currentPage;
  currentPageSize.value = props.pagination.pageSize;
});
</script>

<style scoped>
.dynamic-data-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.grid-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  background: var(--el-bg-color);
  border-radius: 4px;
}
</style>
