# Comments Module

Sistema completo de comentarios estilo Reddit con soporte multiidioma, moderación y almacenamiento en Firestore.

## 📁 Estructura del Módulo

```
Comments/
├── components/           # Componentes React
│   ├── RedditCommentsIsland.tsx    # Componente principal de comentarios
│   └── CommentsWithToast.tsx       # Wrapper con Toast Provider
├── hooks/               # Custom hooks
│   ├── useToast.tsx               # Sistema de notificaciones toast
│   └── useUserCache.tsx           # Caché de datos de usuario en localStorage
├── stores/              # Zustand stores
│   └── commentsStore.ts           # Store global de comentarios
├── types/               # TypeScript types
│   └── comments.ts                # Tipos de comentarios y formularios
├── utils/               # Utilidades (vacío por ahora)
├── index.ts             # Exports centralizados del módulo
└── README.md            # Esta documentación
```

## 🚀 Uso

### Importación Simple

```tsx
// Importar desde el módulo centralizado
import { CommentsWithToast } from '@/components/modules/Comments';

// Usar en un componente Astro
<CommentsWithToast client:visible storyId="my-story-id" />
```

### Importaciones Disponibles

```tsx
// Componentes
import {
  RedditCommentsIsland,
  CommentsWithToast
} from '@/components/modules/Comments';

// Stores
import { useCommentsStore } from '@/components/modules/Comments';

// Hooks
import {
  useToast,
  ToastProvider,
  useUserCache
} from '@/components/modules/Comments';

// Types
import type {
  Comment,
  CommentFormData,
  ModerationEmailData
} from '@/components/modules/Comments';
```

## 📦 Componentes

### RedditCommentsIsland

Componente principal que renderiza el sistema de comentarios completo con:
- Comentarios anidados (estilo Reddit)
- Sistema de likes
- Respuestas a comentarios
- Avatar personalizable
- Caché de datos de usuario
- Multiidioma (i18n)

**Props:**
```tsx
interface RedditCommentsIslandProps {
  storyId: string;  // ID único de la historia/página
}
```

### CommentsWithToast

Wrapper que provee el contexto de Toast para notificaciones.

**Props:**
```tsx
interface CommentsWithToastProps {
  storyId: string;
}
```

## 🔌 Hooks

### useCommentsStore

Store de Zustand que maneja el estado global de comentarios.

**Estado:**
```tsx
{
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  formData: CommentFormData;
  isSubmitting: boolean;
  showForm: boolean;
}
```

**Acciones:**
```tsx
{
  fetchComments: (storyId: string) => Promise<void>;
  submitComment: (storyId: string) => Promise<SubmitCommentResult | false>;
  submitReply: (storyId: string, parentId: string, content: string) => Promise<boolean>;
  likeComment: (commentId: string) => Promise<boolean>;
  setFormField: (field: keyof CommentFormData, value: any) => void;
  resetForm: () => void;
}
```

### useToast

Hook para mostrar notificaciones toast.

```tsx
const { showSuccess, showError, showWarning } = useToast();

showSuccess('Comment posted successfully!');
showError('Failed to post comment');
showWarning('Please fill all fields');
```

### useUserCache

Hook para cachear datos del usuario en localStorage.

```tsx
const {
  cachedData,           // Datos cacheados
  saveUserData,         // Guardar datos
  clearUserData,        // Limpiar caché
  hasCachedData         // Boolean si hay datos
} = useUserCache();
```

## 🗄️ Tipos

### Comment

```tsx
interface Comment {
  id: string;
  name: string;
  comment: string;
  profilePicUrl?: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  moderationToken?: string;
  storyId: string;
  parentId?: string;
  likes: number;
  likedBy: string[];
  replies: Comment[];
  depth: number;
}
```

### CommentFormData

```tsx
interface CommentFormData {
  name: string;
  email: string;
  comment: string;
  profilePic?: File | null;
}
```

## 🔗 Dependencias Externas

Este módulo depende de:

- **Firestore**: Almacenamiento de comentarios (APIs en `/src/pages/api/`)
- **i18n**: Sistema de traducciones (`/src/i18n/translations.js`)
- **TypeSound**: Componente de sonido (`/src/components/ui/TypeSound.tsx`)
- **Lucide React**: Iconos
- **Motion**: Animaciones
- **Zustand**: State management

## 📡 APIs Relacionadas

Este módulo se comunica con las siguientes APIs:

- `POST /api/submit-comment` - Enviar nuevo comentario
- `GET /api/get-comments?storyId={id}` - Obtener comentarios
- `POST /api/like-comment` - Dar like a un comentario
- `POST /api/moderate-comment` - Moderar comentario (admin)

## 🎨 Estilos

Los estilos están centralizados en `CommentsSection.astro` que incluye:
- Tema claro/oscuro
- Responsive design
- Animaciones
- Scrollbar personalizado
- Botones con efectos realistas

## 🌍 Multiidioma

Soporta los siguientes idiomas:
- Inglés (en)
- Español (es)
- Francés (fr)
- Hindi (hi)
- Japonés (ja)
- Chino Simplificado (zh-cn)
- Chino Tradicional (zh-tw)

Las traducciones se obtienen de `/src/i18n/translations.js`.

## 📝 Notas de Desarrollo

- **Caché de Usuario**: Los datos del usuario se guardan en localStorage con la clave `karen_portfolio_user_data`
- **URLs de Blob**: El sistema limpia automáticamente las URLs blob temporales del caché
- **Moderación**: Todos los comentarios pasan por moderación antes de ser visibles
- **Privacidad**: El módulo incluye avisos de privacidad y links a la política de privacidad

## 🔧 Mantenimiento

Al actualizar este módulo:

1. Mantener la compatibilidad de tipos
2. Actualizar las traducciones en `/src/i18n/translations.js`
3. Documentar cambios en las APIs
4. Probar en todos los idiomas soportados
5. Verificar el funcionamiento del caché

## 🚨 Troubleshooting

### Error: "Cannot find module"
Verificar que las rutas de importación sean correctas desde la ubicación del módulo.

### Los comentarios no se cargan
1. Verificar la conexión con Firestore
2. Revisar los logs del API endpoint
3. Verificar el `storyId` sea correcto

### El caché no funciona
Limpiar localStorage y verificar que no haya URLs blob corruptas.

---

**Última actualización**: Octubre 2024
**Mantenedor**: Karen Ortiz
