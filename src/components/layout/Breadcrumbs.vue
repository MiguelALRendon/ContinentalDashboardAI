<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in items"
      :key="index"
      :to="item.to"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const items = computed(() => {
  const breadcrumbs = [
    { label: 'Inicio', to: '/dashboard' }
  ];
  
  if (route.meta.title && route.path !== '/dashboard') {
    breadcrumbs.push({
      label: route.meta.title as string,
      to: undefined
    });
  }
  
  return breadcrumbs;
});
</script>
