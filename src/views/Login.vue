<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="40" color="#409EFF"><Reading /></el-icon>
          <h2>Continental Manager</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Usuario" prop="nombre">
          <el-input
            v-model="loginForm.nombre"
            placeholder="Ingrese su nombre de usuario"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="Contraseña" prop="contraseña">
          <el-input
            v-model="loginForm.contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            native-type="submit"
          >
            Iniciar Sesión
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        style="margin-top: 15px"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Reading, User, Lock } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const error = ref('');

const loginForm = reactive({
  nombre: '',
  contraseña: ''
});

const rules: FormRules = {
  nombre: [
    { required: true, message: 'Por favor ingrese su nombre de usuario', trigger: 'blur' },
    { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres', trigger: 'blur' }
  ],
  contraseña: [
    { required: true, message: 'Por favor ingrese su contraseña', trigger: 'blur' },
    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) {
      console.log('[LOGIN] Validación de formulario falló');
      return;
    }
  } catch (err) {
    console.log('[LOGIN] Error en validación:', err);
    return;
  }

  loading.value = true;
  error.value = '';

  console.log('[LOGIN] Intentando login con:', {
    nombre: loginForm.nombre,
    contraseña: '***'
  });

  try {
    await userStore.login({
      nombre: loginForm.nombre,
      contraseña: loginForm.contraseña
    });

    console.log('[LOGIN] Login exitoso, redirigiendo...');
    const redirect = route.query.redirect as string || '/dashboard';
    await router.push(redirect);
  } catch (e: any) {
    console.error('[LOGIN] Error capturado en componente:', e);
    
    // Manejo de errores según la API
    if (e.response?.status === 401) {
      error.value = 'Credenciales inválidas';
    } else if (e.response?.status === 400) {
      error.value = e.response.data?.error || 'Usuario y contraseña son requeridos';
    } else if (e.response?.data?.error) {
      error.value = e.response.data.error;
    } else if (e.message) {
      error.value = `Error: ${e.message}`;
    } else {
      error.value = 'Error al iniciar sesión. Por favor intente nuevamente.';
    }
    
    console.log('[LOGIN] Mensaje de error mostrado:', error.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
}
</style>
