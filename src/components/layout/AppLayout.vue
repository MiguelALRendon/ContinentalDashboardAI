<template>
  <el-container class="app-layout">
    <el-aside :width="sidebarWidth" class="app-sidebar">
      <Sidebar />
    </el-aside>
    
    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          <el-button
            :icon="Fold"
            circle
            @click="appStore.toggleSidebar()"
          />
          <Breadcrumbs />
        </div>
        
        <div class="header-right">
          <el-button
            :icon="theme === 'light' ? Moon : Sunny"
            circle
            @click="toggleTheme"
          />
          <el-dropdown>
            <span class="user-dropdown">
              <el-avatar size="small">
                {{ userStore.user?.nombre?.charAt(0) }}
              </el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Perfil</el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  Cerrar Sesión
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Fold, Moon, Sunny } from '@element-plus/icons-vue';
import { useAppStore, useUserStore } from '@/stores';
import Sidebar from './Sidebar.vue';
import Breadcrumbs from './Breadcrumbs.vue';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();

const sidebarWidth = computed(() => 
  appStore.sidebarCollapsed ? '64px' : '250px'
);

const theme = computed(() => appStore.theme);

const toggleTheme = () => {
  appStore.setTheme(theme.value === 'light' ? 'dark' : 'light');
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.app-layout {
  height: 100vh;
}

.app-sidebar {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  transition: width 0.3s;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color);
  padding: 0 20px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-dropdown {
  cursor: pointer;
}

.app-main {
  background-color: var(--el-bg-color-page);
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
