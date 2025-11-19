# 🚀 Continental Manager - Sistema de Administración Dinámico

Sistema de administración web empresarial en **Vue 3 + TypeScript** que genera automáticamente interfaces CRUD completas (DataGrids, Formularios) a partir de definiciones de modelos, inspirado en DevExpress.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Arquitectura](#arquitectura)
- [Cómo Usar](#cómo-usar)
- [Agregar Nuevo Modelo](#agregar-nuevo-modelo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejemplos](#ejemplos)

## ✨ Características

- ✅ **CRUD Automático**: Genera interfaces completas desde modelos TypeScript
- ✅ **DataGrid Empresarial**: Paginación, ordenamiento, filtrado, selección múltiple
- ✅ **Formularios Dinámicos**: Validación integrada, editores especializados
- ✅ **Relaciones ForeignKey**: Soporte completo para relaciones entre modelos
- ✅ **SEO Integrado**: Modelos con campos SEO automáticos
- ✅ **Type Safety**: TypeScript en todo el stack
- ✅ **UI Moderna**: Element Plus con temas light/dark
- ✅ **Rutas Dinámicas**: Generación automática de rutas por modelo
- ✅ **Composables Reutilizables**: Lógica compartida con Vue Composition API

## 🛠️ Tecnologías

### Core
- **Vue 3.5+** - Framework progresivo (Composition API + `<script setup>`)
- **TypeScript 5+** - Type safety completo
- **Vite 7+** - Build tool ultra rápido

### Estado y Routing
- **Pinia 3+** - State management oficial de Vue
- **Vue Router 4+** - Routing con guardias y rutas dinámicas

### UI y Estilos
- **Element Plus 2+** - Componentes empresariales
- **@element-plus/icons-vue** - Iconos

### HTTP y Utilidades
- **Axios 1+** - Cliente HTTP con interceptores
- **VueUse 14+** - Composables útiles
- **Day.js 1+** - Manejo de fechas
- **VeeValidate 4+** - Validaciones de formularios

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm 9+

### Pasos

```bash
# Clonar el repositorio
cd admin-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

El servidor de desarrollo estará disponible en `http://localhost:5173`

## 🏗️ Arquitectura

### Sistema de Modelos con Decoradores

Los modelos se definen usando decoradores TypeScript `@Field` que describen completamente cada campo:

```typescript
@Field({
  type: FieldType.String,
  label: 'Nombre',
  required: true,
  maxLength: 100,
  gridVisible: true,    // Mostrar en tabla
  gridWidth: 250,
  formGroup: 'general', // Agrupar en formulario
  formOrder: 1
})
nombre!: string;
```

### Generadores Dinámicos

- **GridGenerator**: Crea configuración de columnas para DataGrid
- **FormGenerator**: Genera formularios con tabs/grupos
- **ValidationGenerator**: Reglas de validación automáticas

### Servicios API Genéricos

```typescript
const service = ApiServiceFactory.getService(ObraModel);
const obras = await service.list();
const obra = await service.getById(id);
await service.create(data);
await service.update(id, data);
await service.delete(id);
```

## 🎯 Cómo Usar

### Acceso al Sistema

1. **Login**: `/login`
   - Email: cualquier email válido
   - Contraseña: mínimo 6 caracteres
   - (Autenticación simulada para demo)

2. **Dashboard**: `/dashboard`
   - Vista general del sistema
   - Accesos rápidos a modelos

3. **CRUD de Modelos**: `/{modelo}`
   - Ejemplo: `/obra`, `/capitulo`, `/arco`

### Operaciones CRUD

#### Listar Registros
- **Buscar**: Campo de búsqueda global en toolbar
- **Filtrar**: Click en encabezados de columna
- **Ordenar**: Click en encabezados para alternar ASC/DESC
- **Paginar**: Controles en parte inferior

#### Crear Registro
1. Click en botón "Agregar {Modelo}"
2. Completar formulario (campos con * son obligatorios)
3. Si el modelo tiene SEO, completar pestaña "SEO y Metadatos"
4. Click en "Crear"

#### Editar Registro
1. Click en icono de editar (✏️) en la fila
2. Modificar campos necesarios
3. Click en "Actualizar"

#### Eliminar Registro
- **Individual**: Click en icono eliminar (🗑️) → Confirmar
- **Múltiple**: Seleccionar checkboxes → "Eliminar Seleccionados"

## 🆕 Agregar Nuevo Modelo

### Paso 1: Crear el Modelo

Crear archivo `src/core/models/MiModelo.model.ts`:

```typescript
import { Field, BaseModel } from './base';
import { FieldType } from '@/core/types';

export class MiModeloModel extends BaseModel {
  static override modelName = 'MiModelo';
  static override endpoint = '/backend-api/mi-modelo';
  static override displayField = 'nombre';
  static override icon = 'Document'; // Icono de Element Plus

  @Field({
    type: FieldType.String,
    label: 'Nombre',
    required: true,
    maxLength: 100,
    gridVisible: true,
    gridWidth: 250,
    formGroup: 'general',
    formOrder: 1
  })
  nombre!: string;

  @Field({
    type: FieldType.Text,
    label: 'Descripción',
    gridVisible: true,
    gridWidth: 300,
    formGroup: 'general',
    formOrder: 2,
    editor: 'TextArea'
  })
  descripcion?: string;

  // Agregar más campos según necesidad
}
```

### Paso 2: Registrar el Modelo

En `src/core/models/index.ts`:

```typescript
import { MiModeloModel } from './MiModelo.model';

export const modelRegistry = new Map<string, typeof BaseModel>([
  ['Obra', ObraModel],
  ['Capitulo', CapituloModel],
  ['Arco', ArcoModel],
  ['Noticia', NoticiaModel],
  ['MiModelo', MiModeloModel], // ✅ Agregar aquí
]);

export { MiModeloModel }; // ✅ Exportar
```

### Paso 3: ¡Listo! 🎉

El sistema automáticamente:
- ✅ Crea ruta `/mimodelo`
- ✅ Agrega entrada en sidebar de navegación
- ✅ Genera DataGrid con columnas configuradas
- ✅ Genera formulario de creación/edición
- ✅ Configura validaciones
- ✅ Conecta con API `/backend-api/mi-modelo`

## 📁 Estructura del Proyecto

```
src/
├── core/                           # Sistema central dinámico
│   ├── models/                     # Modelos con decoradores
│   │   ├── base/
│   │   │   ├── BaseModel.ts        # Clase base
│   │   │   └── SeoModel.ts         # Modelo con SEO
│   │   ├── Obra.model.ts
│   │   ├── Capitulo.model.ts
│   │   ├── Arco.model.ts
│   │   └── index.ts                # ⭐ Registro de modelos
│   │
│   ├── services/                   # Servicios API
│   │   ├── BaseApiService.ts       # CRUD genérico
│   │   └── ApiServiceFactory.ts    # Factory
│   │
│   ├── generators/                 # Generadores dinámicos
│   │   ├── GridGenerator.ts
│   │   ├── FormGenerator.ts
│   │   └── ValidationGenerator.ts
│   │
│   └── types/                      # Tipos TypeScript
│       ├── FieldDefinition.ts
│       └── ComponentConfig.ts
│
├── components/                     # Componentes Vue
│   ├── base/
│   │   ├── DynamicDataGrid.vue     # Grid genérico
│   │   ├── DynamicForm.vue         # Formulario genérico
│   │   ├── FormGroup.vue
│   │   └── CellRenderer.vue
│   │
│   ├── editors/                    # Editores de campo
│   │   ├── TextInput.vue
│   │   ├── TextArea.vue
│   │   ├── NumberInput.vue
│   │   ├── Switch.vue
│   │   └── SelectInput.vue
│   │
│   └── layout/
│       ├── AppLayout.vue
│       ├── Sidebar.vue
│       └── Breadcrumbs.vue
│
├── views/                          # Vistas principales
│   ├── Dashboard.vue
│   ├── DynamicCRUD.vue            # Vista CRUD genérica
│   └── Login.vue
│
├── stores/                         # Pinia stores
│   ├── app.store.ts
│   ├── model.store.ts
│   └── user.store.ts
│
├── router/
│   └── index.ts                   # Router con rutas dinámicas
│
├── composables/                   # Composables reutilizables
│   ├── useCRUD.ts                 # Lógica CRUD
│   ├── useValidation.ts
│   └── useTableState.ts
│
├── utils/
│   ├── apiClient.ts               # Axios configurado
│   └── helpers.ts
│
├── App.vue
└── main.ts
```

## 📚 Ejemplos

### Ejemplo 1: Modelo Simple (Arco)

```typescript
export class ArcoModel extends BaseModel {
  static override modelName = 'Arco';
  static override endpoint = '/backend-api/arcos';
  static override displayField = 'nombre';
  static override icon = 'List';

  @Field({
    type: FieldType.String,
    label: 'Nombre del Arco',
    required: true,
    gridVisible: true,
    formGroup: 'general'
  })
  nombre!: string;

  @Field({
    type: FieldType.Boolean,
    label: 'Es Subarco',
    gridVisible: true,
    gridRender: 'boolean',
    formGroup: 'general'
  })
  es_subarco?: boolean;
}
```

### Ejemplo 2: Modelo con ForeignKey (Capítulo)

```typescript
export class CapituloModel extends SeoBaseModel {
  // ... otros campos

  @Field({
    type: FieldType.ForeignKey,
    label: 'Obra',
    relatedModel: 'Obra',        // Nombre del modelo relacionado
    relatedField: 'nombre',      // Campo a mostrar
    required: true,
    gridVisible: true,
    formGroup: 'relaciones'
  })
  obra_id!: string;
}
```

### Ejemplo 3: Usar Composable CRUD

```typescript
const { items, loading, create, update, remove } = useCRUD(ObraModel);

// Crear
await create({ nombre: 'Nueva Obra', descripcion: '...' });

// Actualizar
await update(id, { nombre: 'Obra Actualizada' });

// Eliminar
await remove(id);
```

### Ejemplo 4: Validación Personalizada

```typescript
@Field({
  type: FieldType.String,
  label: 'Código Único',
  required: true,
  pattern: /^[A-Z]{3}-\d{4}$/,
  customValidation: (value: string) => {
    if (value && !value.startsWith('COD-')) {
      return 'El código debe comenzar con COD-';
    }
    return null;
  }
})
codigo!: string;
```

## 🎨 Tipos de Campos Soportados

| FieldType | Editor | Grid Render | Uso |
|-----------|--------|-------------|-----|
| `String` | TextInput | default | Textos cortos |
| `Text` | TextArea | default | Textos largos |
| `Number` | NumberInput | default | Números |
| `Boolean` | Switch | boolean | Sí/No |
| `Date` | DatePicker | date | Fechas |
| `DateTime` | DateTimePicker | datetime | Fecha + Hora |
| `Email` | EmailInput | default | Correos |
| `URL` | URLInput | link | URLs |
| `Image` | ImageUploader | image-thumbnail | Imágenes |
| `ForeignKey` | SelectInput | lookup | Relaciones |
| `Select` | SelectInput | default | Opciones fijas |

## 🔒 Seguridad

- Autenticación con JWT (simulada en demo)
- Guards de navegación en Vue Router
- Interceptores Axios para tokens
- Validación de formularios cliente/servidor

## 🚀 Próximas Mejoras

- [ ] Exportación Excel/PDF real
- [ ] Master-Detail automático
- [ ] Búsqueda avanzada con múltiples filtros
- [ ] Rich Text Editor (TinyMCE/Quill)
- [ ] Image Uploader con preview
- [ ] Virtualización de scroll para grids grandes
- [ ] Temas personalizables
- [ ] i18n (internacionalización)

## 📄 Licencia

ISC

## 👨‍💻 Autor

Sistema desarrollado con Vue 3 + TypeScript para Continental Manager

---

**¡Feliz desarrollo! 🎉**
