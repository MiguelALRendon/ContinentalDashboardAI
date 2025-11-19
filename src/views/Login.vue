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
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="Ingrese su email"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="Contraseña" prop="password">
          <el-input
            v-model="loginForm.password"
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
  email: '',
  password: ''
});

const rules: FormRules = {
  email: [
    { required: true, message: 'Por favor ingrese su email', trigger: 'blur' },
    { type: 'email', message: 'Por favor ingrese un email válido', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Por favor ingrese su contraseña', trigger: 'blur' },
    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    error.value = '';

    try {
      const success = await userStore.login({
        email: loginForm.email,
        password: loginForm.password
      });

      if (success) {
        const redirect = route.query.redirect as string || '/dashboard';
        router.push(redirect);
      } else {
        error.value = 'Credenciales inválidas';
      }
    } catch (e: any) {
      error.value = e.message || 'Error al iniciar sesión';
    } finally {
      loading.value = false;
    }
  });
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
