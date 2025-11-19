# Guía de Inicio Rápido - Continental Manager

## 🚀 Ejecutar el Proyecto

### 1. Instalar Dependencias

```bash
cd admin-frontend
npm install
```

### 2. Configurar Variables de Entorno (Opcional)

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 4. Acceder al Sistema

- **URL**: http://localhost:5173/login
- **Email**: cualquier email válido (ej: admin@example.com)
- **Contraseña**: mínimo 6 caracteres (ej: password123)

> ⚠️ **Nota**: La autenticación actual es simulada para desarrollo. La integración real con el backend requiere implementar el endpoint `/auth/login`.

## 🔌 Conectar con Backend Flask

### Configuración del Backend

El frontend está configurado para comunicarse con el backend Flask en `http://localhost:5000`.

**Archivo de Configuración**: `vite.config.ts`

```typescript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/backend-api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Endpoints Requeridos en el Backend

Para cada modelo registrado, el backend debe exponer:

#### Obras (`/backend-api/obras`)
```python
GET    /backend-api/obras/          # Listar todas las obras
POST   /backend-api/obras/          # Crear nueva obra
GET    /backend-api/obras/<id>      # Obtener obra por ID
PUT    /backend-api/obras/<id>      # Actualizar obra
DELETE /backend-api/obras/<id>      # Desactivar obra (soft delete)
```

#### Formato de Respuesta

**Lista (GET /backend-api/obras/)**:
```json
[
  {
    "id": "uuid-1234",
    "nombre": "Mi Obra",
    "descripcion": "Descripción de la obra",
    "url_portada": "https://...",
    "orden": 1,
    "estatus": 1,
    "created_at": "2025-01-01T00:00:00",
    "updated_at": "2025-01-01T00:00:00",
    "url_busqueda": "mi-obra"
  }
]
```

**Crear/Actualizar (POST/PUT)**:
```json
{
  "nombre": "Nueva Obra",
  "descripcion": "Descripción",
  "url_portada": "https://...",
  "orden": 1
}
```

**Respuesta**:
```json
{
  "id": "nuevo-uuid",
  "nombre": "Nueva Obra",
  "descripcion": "Descripción",
  ...
  "estatus": 1,
  "created_at": "2025-11-17T...",
  "updated_at": "2025-11-17T..."
}
```

## 🧪 Pruebas sin Backend

Si el backend no está disponible, el frontend funcionará con las siguientes limitaciones:

- ✅ Login (simulado)
- ✅ Navegación entre vistas
- ✅ Generación de formularios
- ✅ Validación de campos
- ❌ Operaciones CRUD reales (no hay datos)

Los errores de red se mostrarán en la consola del navegador.

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (hot reload)

# Producción
npm run build        # Compilar para producción
npm run preview      # Previsualizar build de producción

# Utilidades
npm run type-check   # Verificar tipos TypeScript
```

## 🎨 Personalización

### Cambiar Puerto del Frontend

`vite.config.ts`:
```typescript
server: {
  port: 3000  // Cambiar aquí
}
```

### Cambiar URL del Backend

`vite.config.ts`:
```typescript
proxy: {
  '/backend-api': {
    target: 'http://tu-backend-url:puerto'
  }
}
```

## 📝 Agregar un Nuevo Modelo (Paso a Paso)

### 1. Crear el Modelo

**Archivo**: `src/core/models/Autor.model.ts`

```typescript
import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

export class AutorModel extends BaseModel {
  static override modelName = 'Autor';
  static override endpoint = '/backend-api/autores';
  static override displayField = 'nombre';
  static override icon = 'User';

  @Field({
    type: FieldType.String,
    label: 'Nombre',
    required: true,
    maxLength: 100,
    gridVisible: true,
    gridWidth: 200,
    formGroup: 'general',
    formOrder: 1
  })
  nombre!: string;

  @Field({
    type: FieldType.Email,
    label: 'Email',
    required: true,
    gridVisible: true,
    gridWidth: 200,
    formGroup: 'general',
    formOrder: 2
  })
  email!: string;

  @Field({
    type: FieldType.Text,
    label: 'Biografía',
    gridVisible: false,
    formGroup: 'general',
    formOrder: 3,
    editor: 'TextArea'
  })
  biografia?: string;
}
```

### 2. Registrar el Modelo

**Archivo**: `src/core/models/index.ts`

```typescript
import { AutorModel } from './Autor.model';

export const modelRegistry = new Map<string, typeof BaseModel>([
  ['Obra', ObraModel],
  ['Capitulo', CapituloModel],
  ['Arco', ArcoModel],
  ['Noticia', NoticiaModel],
  ['Autor', AutorModel], // 👈 Agregar aquí
]);

export { AutorModel }; // 👈 Exportar
```

### 3. Reiniciar Servidor

```bash
# Ctrl+C para detener
npm run dev
```

### 4. ¡Listo!

- Ruta automática: **http://localhost:5173/autor**
- Menú lateral actualizado con "Autor"
- CRUD completo funcional

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"

**Solución**: Verificar que el backend Flask esté corriendo en `http://localhost:5000`

### Error: "Module not found"

**Solución**: Ejecutar `npm install` nuevamente

### La página se queda en blanco

**Solución**: 
1. Abrir DevTools del navegador (F12)
2. Verificar errores en la consola
3. Revisar que `main.ts` esté correctamente configurado

### Los cambios no se reflejan

**Solución**:
1. Refrescar el navegador (Ctrl+R)
2. Limpiar caché del navegador
3. Reiniciar el servidor de Vite

## 📧 Soporte

Para reportar problemas o solicitar funcionalidades:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---

**¡Feliz Desarrollo! 🚀**
