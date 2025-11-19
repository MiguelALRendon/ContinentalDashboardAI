<template>
  <span v-if="column.render === 'image-thumbnail'" class="cell-image">
    <el-image
      v-if="cellValue"
      :src="cellValue"
      fit="cover"
      style="width: 60px; height: 60px"
      :preview-src-list="[cellValue]"
    />
    <span v-else class="text-muted">Sin imagen</span>
  </span>

  <el-tag v-else-if="column.render === 'badge'" :type="getBadgeType(cellValue)">
    {{ getBadgeText(cellValue) }}
  </el-tag>

  <el-icon v-else-if="column.render === 'boolean'" :color="cellValue ? '#67C23A' : '#909399'">
    <component :is="cellValue ? CircleCheck : CircleClose" />
  </el-icon>

  <span v-else-if="column.render === 'date'">
    {{ formatDate(cellValue, 'short') }}
  </span>

  <span v-else-if="column.render === 'datetime'">
    {{ formatDate(cellValue, 'datetime') }}
  </span>

  <el-link v-else-if="column.render === 'link'" type="primary" :href="cellValue" target="_blank">
    {{ cellValue }}
  </el-link>

  <span v-else :title="cellValue" class="cell-text">
    {{ truncatedValue }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';
import type { GridColumnConfig } from '@/core/types';
import { formatDate } from '@/utils/helpers';

interface Props {
  column: GridColumnConfig;
  row: any;
}

const props = defineProps<Props>();

const cellValue = computed(() => {
  return props.row[props.column.field];
});

const truncatedValue = computed(() => {
  const value = cellValue.value;
  if (!value) return value;
  
  const str = String(value);
  const maxLength = 100;
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength) + '...';
});

const getBadgeType = (value: any): string => {
  if (props.column.field === 'estatus') {
    return value === 1 ? 'success' : 'danger';
  }
  return 'info';
};

const getBadgeText = (value: any): string => {
  if (props.column.field === 'estatus') {
    return value === 1 ? 'Activo' : 'Inactivo';
  }
  return value?.toString() || '';
};
</script>

<style scoped>
.cell-image {
  display: inline-block;
}

.text-muted {
  color: var(--el-text-color-secondary);
  font-style: italic;
}

.cell-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}
</style>
