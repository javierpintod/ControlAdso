# Base de Datos Supabase (PostgreSQL 15+) - ControlAdso EduStock

Este directorio contiene el esquema completo de base de datos relacional para el sistema de control de inventarios, activos serializados y mesa de ayuda técnica **ControlAdso - EduStock Asset Manager**, diseñado para **Supabase**.

---

## 📁 Archivos Disponibles

- `supabase/schema.sql`: Script DDL completo con extensiones (`uuid-ossp`, `pgcrypto`), tipos enumerados (ENUMs), tablas relacionales, llaves foráneas, índices, triggers para hashing criptográfico SHA-256 inmutable, políticas de seguridad RLS y datos iniciales (Seed Data).

---

## 🚀 Pasos para Desplegar en Supabase

### Opción 1: A través de la Consola Web de Supabase (Recomendado)

1. Ingresa a [supabase.com](https://supabase.com) e inicia sesión.
2. Crea un nuevo proyecto (ej. `controladso-edustock`).
3. Ve a la sección **SQL Editor** en el menú lateral izquierdo.
4. Haz clic en **+ New Query**.
5. Abre y copia el contenido completo del archivo `supabase/schema.sql` (o haz clic en el botón *"Copiar SQL para Supabase"* dentro de la aplicación en la pestaña **BD Supabase**).
6. Pega el script en el editor y presiona **RUN**.
7. ¡Listo! Todas las 12 tablas, triggers, índices y políticas RLS quedarán aprovisionadas con datos semilla de prueba.

### Opción 2: A través de Supabase CLI

```bash
# Iniciar sesión en la CLI de Supabase
npx supabase login

# Vincular tu proyecto
npx supabase link --project-ref TU_PROJECT_REF

# Aplicar el esquema
npx supabase db push
```

---

## 🔑 Variables de Entorno (`.env`)

En la raíz del proyecto web, configura las credenciales de tu proyecto Supabase:

```env
# URL de la API de tu proyecto Supabase (Formato: https://<project-ref>.supabase.co)
VITE_SUPABASE_URL=https://najjrhdvnhexffzseaah.supabase.co

# Llave anónima pública (anon / public key)
VITE_SUPABASE_ANON_KEY=sb_publishable_Fad2vS1Z5C5Fa3VHZeWozQ_b5iHi2r4
```

*(También puedes ingresarlas dinámicamente desde la interfaz gráfica de la aplicación en la pestaña "Base de Datos" -> "Conexión Supabase Cloud").*

---

## 🗄️ Diccionario de Tablas

| Tabla | Descripción | Clave Primaria | Relaciones Clave |
|---|---|---|---|
| `campuses` | Sedes educativas (Central, Norte, Sur) | `id` (TEXT) | — |
| `environments` | Ambientes y laboratorios de aprendizaje | `id` (TEXT) | `campus_id` → `campuses.id` |
| `user_profiles` | Directorio de usuarios y roles RBAC | `id` (UUID) | Vinculable a `auth.users` |
| `product_categories` | Familias patrimoniales y stock por ambiente | `id` (UUID) | — |
| `assets` | Activos serializados individuales | `id` (UUID) | `environment_id` → `environments.id`, `category_id` → `product_categories.id` |
| `asset_history` | Trazabilidad y hoja de vida inmutable | `id` (UUID) | `asset_id` → `assets.id` |
| `inventory_movements` | Actas de traslado con firma criptográfica SHA-256 | `id` (UUID) | `origin_environment_id`, `destination_environment_id` |
| `service_desk_tickets` | Casos de soporte técnico con SLA | `id` (UUID) | `asset_id` → `assets.id` |
| `ticket_timeline_steps` | Etapas del flujo de reparación | `id` (UUID) | `ticket_id` → `service_desk_tickets.id` |
| `ticket_notes` | Bitácora de notas técnicas | `id` (UUID) | `ticket_id` → `service_desk_tickets.id` |
| `audit_sessions` | Procesos de auditoría física in situ | `id` (UUID) | `environment_id` → `environments.id` |
| `audit_items` | Lista de cotejo y verificación física | `id` (UUID) | `session_id` → `audit_sessions.id`, `asset_id` → `assets.id` |

---

## 🔒 Políticas de Seguridad a Nivel de Filas (Row Level Security - RLS)

- **Lectura Pública / Autenticada (`SELECT`)**: Todos los usuarios pueden consultar las tablas de catálogo, activos y reportes.
- **Escritura (`INSERT`, `UPDATE`, `DELETE`)**: Protegida para roles administrativos con validación de integridad referencial.
- **Triggers**: La tabla `inventory_movements` cuenta con el trigger `trigger_generate_movement_hash` que calcula automáticamente el hash SHA-256 inmutable de cada transacción antes del guardado.
