import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getAllModels } from '@/core/models';
import { useUserStore } from '@/stores';

/**
 * Rutas estáticas
 */
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'Odometer'
        }
      }
    ]
  }
];

/**
 * Genera rutas dinámicas basadas en los modelos registrados
 */
function generateDynamicRoutes(): RouteRecordRaw[] {
  const models = getAllModels();
  const dynamicRoutes: RouteRecordRaw[] = [];

  models.forEach(modelClass => {
    dynamicRoutes.push({
      path: `/${modelClass.modelName.toLowerCase()}`,
      name: modelClass.modelName,
      component: () => import('@/views/DynamicCRUD.vue'),
      props: { modelClass },
      meta: {
        title: modelClass.modelName,
        icon: modelClass.icon,
        requiresAuth: true,
        modelName: modelClass.modelName
      }
    });
  });

  return dynamicRoutes;
}

/**
 * Combina rutas estáticas con rutas dinámicas
 */
function createRoutes(): RouteRecordRaw[] {
  const dynamicRoutes = generateDynamicRoutes();
  
  // Insertar rutas dinámicas dentro del layout principal
  const layoutRoute = staticRoutes.find(r => r.path === '/');
  if (layoutRoute && layoutRoute.children) {
    layoutRoute.children.push(...dynamicRoutes);
  }

  // Agregar ruta 404
  staticRoutes.push({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  });

  return staticRoutes;
}

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: createRoutes()
});

/**
 * Guard de navegación para autenticación
 */
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !userStore.isAuthenticated) {
    // Redirigir a login si la ruta requiere autenticación
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && userStore.isAuthenticated) {
    // Si ya está autenticado y trata de ir a login, redirigir al dashboard
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

/**
 * Guard para actualizar el título de la página
 */
router.afterEach((to) => {
  const title = to.meta.title as string || 'Continental Manager';
  document.title = `${title} - Continental Manager`;
});

export default router;
