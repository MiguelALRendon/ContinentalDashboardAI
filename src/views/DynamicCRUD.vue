<template>
  <div class="dynamic-crud-view">
    <div class="view-header">
      <h2>{{ modelClass.modelName }}</h2>
    </div>

    <DynamicDataGrid
      :model-class="modelClass"
      :items="items"
      :loading="loading"
      :pagination="pagination"
      @add="openCreateModal"
      @edit="openEditModal"
      @view="openViewModal"
      @delete="handleDelete"
      @batch-delete="handleBatchDelete"
      @refresh="refresh"
      @search="handleSearch"
      @sort="handleSort"
      @page-change="changePage"
      @page-size-change="changePageSize"
    />

    <!-- Modal de Formulario -->
    <el-dialog
      v-model="showFormModal"
      :title="formTitle"
      class="dynamic-form-dialog"
      width="75vw"
      :close-on-click-modal="false"
      align-center
    >
      <DynamicForm
        v-if="showFormModal"
        :model-class="modelClass"
        :model-value="selectedItem"
        :mode="formMode"
        @submit="handleFormSubmit"
        @cancel="showFormModal = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useCRUD } from '@/composables';
import type { BaseModel } from '@/core/models/base';
import DynamicDataGrid from '@/components/base/DynamicDataGrid.vue';
import DynamicForm from '@/components/base/DynamicForm.vue';

interface Props {
  modelClass: typeof BaseModel;
}

const props = defineProps<Props>();

const showFormModal = ref(false);
const formMode = ref<'create' | 'edit' | 'view'>('create');
const selectedItem = ref<any>(null);

const {
  items,
  loading,
  pagination,
  loadData,
  create,
  update,
  remove,
  batchRemove,
  search,
  changePage,
  changePageSize,
  refresh
} = useCRUD(props.modelClass);

const formTitle = computed(() => {
  const modelName = props.modelClass.modelName;
  if (formMode.value === 'create') return `Crear ${modelName}`;
  if (formMode.value === 'edit') return `Editar ${modelName}`;
  return `Ver ${modelName}`;
});

const openCreateModal = () => {
  formMode.value = 'create';
  selectedItem.value = null;
  showFormModal.value = true;
};

const openEditModal = (item: any) => {
  formMode.value = 'edit';
  selectedItem.value = item ? { ...item } : null;
  showFormModal.value = true;
};

const openViewModal = (item: any) => {
  formMode.value = 'view';
  selectedItem.value = item ? { ...item } : null;
  showFormModal.value = true;
};

const handleFormSubmit = async (data: any) => {
  try {
    if (formMode.value === 'create') {
      await create(data);
      ElMessage.success('Registro creado exitosamente');
    } else if (formMode.value === 'edit') {
      await update(data.id, data);
      ElMessage.success('Registro actualizado exitosamente');
    }
    showFormModal.value = false;
    refresh();
  } catch (error: any) {
    ElMessage.error(error.message || 'Error al guardar el registro');
  }
};

const handleDelete = async (item: any) => {
  try {
    await remove(item.id);
    ElMessage.success('Registro eliminado exitosamente');
  } catch (error: any) {
    ElMessage.error(error.message || 'Error al eliminar el registro');
  }
};

const handleBatchDelete = async (items: any[]) => {
  try {
    const ids = items.map(item => item.id);
    await batchRemove(ids);
    ElMessage.success(`${ids.length} registros eliminados exitosamente`);
  } catch (error: any) {
    ElMessage.error(error.message || 'Error al eliminar los registros');
  }
};

const handleSearch = (term: string) => {
  search(term);
};

const handleSort = (field: string, order: 'asc' | 'desc') => {
  loadData({ sortField: field, sortOrder: order });
};

// Cargar datos al montar
onMounted(() => {
  loadData();
});

// Recargar datos cuando cambia el modelo
watch(
  () => props.modelClass,
  (newModel, oldModel) => {
    if (newModel !== oldModel) {
      // Resetear estado
      showFormModal.value = false;
      selectedItem.value = null;
      // Recargar datos
      loadData();
    }
  }
);
</script>

<style>
/* Estilos globales para el modal - NO scoped para que aplique a todos */
.dynamic-form-dialog.el-dialog__wrapper .el-dialog {
  width: 75vw !important;
  max-width: 75vw !important;
  min-height: 80vh !important;
  max-height: 80vh !important;
  height: 80vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

.dynamic-form-dialog.el-dialog__wrapper .el-dialog__header {
  border-bottom: 1px solid var(--el-border-color);
  padding: 20px;
  flex-shrink: 0 !important;
}

.dynamic-form-dialog.el-dialog__wrapper .el-dialog__body {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 20px;
  min-height: 0 !important;
}

.dynamic-form-dialog.el-dialog__wrapper .el-dialog__footer {
  flex-shrink: 0 !important;
  padding: 20px;
}
</style>

<style scoped>
.dynamic-crud-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}
</style>
