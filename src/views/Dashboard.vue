<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" :style="{ color: stat.color }">
              <el-icon :size="40">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card header="Accesos Rápidos">
          <div class="quick-links">
            <el-button
              v-for="model in navigationModels"
              :key="model.name"
              @click="router.push(model.path)"
              style="width: 100%; margin-bottom: 10px"
            >
              <el-icon style="margin-right: 8px">
                <component :is="getIconComponent(model.icon)" />
              </el-icon>
              {{ model.label }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card header="Bienvenido">
          <div class="welcome-message">
            <p>Bienvenido al Sistema de Administración de Continental Manager</p>
            <p>
              Este sistema le permite gestionar dinámicamente todos los modelos
              de su aplicación mediante una interfaz CRUD generada automáticamente.
            </p>
            <el-alert
              type="info"
              :closable="false"
              style="margin-top: 15px"
            >
              <template #title>
                Modelos Registrados: {{ modelStore.modelList.length }}
              </template>
            </el-alert>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { useRouter } from 'vue-router';
import {
  Reading,
  Document,
  List,
  Notification
} from '@element-plus/icons-vue';
import { useModelStore } from '@/stores';

const router = useRouter();
const modelStore = useModelStore();

const navigationModels = computed(() => modelStore.navigationModels);

const stats = [
  {
    title: 'Total Modelos',
    value: modelStore.modelList.length,
    color: '#409EFF',
    icon: markRaw(Document)
  },
  {
    title: 'Obras',
    value: '-',
    color: '#67C23A',
    icon: markRaw(Reading)
  },
  {
    title: 'Capítulos',
    value: '-',
    color: '#E6A23C',
    icon: markRaw(List)
  },
  {
    title: 'Noticias',
    value: '-',
    color: '#F56C6C',
    icon: markRaw(Notification)
  }
];

const iconMap: Record<string, any> = {
  Reading: markRaw(Reading),
  Document: markRaw(Document),
  List: markRaw(List),
  Notification: markRaw(Notification)
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Document;
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard h1 {
  margin: 0 0 20px 0;
  font-size: 28px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.stat-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 5px;
}

.quick-links {
  display: flex;
  flex-direction: column;
}

.welcome-message p {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}
</style>
