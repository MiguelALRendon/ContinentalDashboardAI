<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1 v-if="!collapsed">
        <el-icon><Reading /></el-icon>
        <span>Continental</span>
      </h1>
      <el-icon v-else size="24"><Reading /></el-icon>
    </div>
    
    <el-menu
      :default-active="currentRoute"
      :collapse="collapsed"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <template #title>Dashboard</template>
      </el-menu-item>
      
      <el-divider />
      
      <el-menu-item
        v-for="model in navigationModels"
        :key="model.name"
        :index="model.path"
      >
        <el-icon>
          <component :is="getIconComponent(model.icon)" />
        </el-icon>
        <template #title>{{ model.label }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  Reading, 
  Odometer, 
  Document, 
  List,
  Notification
} from '@element-plus/icons-vue';
import { useAppStore, useModelStore } from '@/stores';

const appStore = useAppStore();
const modelStore = useModelStore();
const route = useRoute();

const collapsed = computed(() => appStore.sidebarCollapsed);
const currentRoute = computed(() => route.path);
const navigationModels = computed(() => modelStore.navigationModels);

// Mapeo de iconos
const iconMap: Record<string, any> = {
  Reading,
  Document,
  List,
  Notification,
  Odometer
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Document;
};
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--el-border-color);
}

.sidebar-header h1 {
  margin: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.el-menu {
  border: none;
  flex: 1;
  overflow-y: auto;
}
</style>
