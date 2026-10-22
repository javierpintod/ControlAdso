# ControlAdso - EduStock Asset Manager (Versión PHP & MySQL)

Sistema web para el control de inventarios, trazabilidad serializada, actas de custodia con firma digital SHA-256, mesa de ayuda técnica con SLA y auditorías físicas in situ, adaptado para ambientes de aprendizaje del **SENA** (Centro de Servicios y Gestión Empresarial - Regional Antioquia).

---

## 🛠️ Requisitos del Sistema

- **Servidor Web y PHP:** PHP 7.4, 8.0, 8.1, 8.2 o superior con extensión `pdo_mysql`.
- **Base de Datos:** MySQL 5.7+, MySQL 8.0+ o MariaDB 10.3+.
- **Recomendado:** Cualquier suite como **XAMPP**, **WampServer**, **Laragon** o **MAMP**.

---

## 🚀 Instalación y Puesta en Marcha

### Opción 1: Con XAMPP (Recomendado para desarrollo local)

1. **Copiar el proyecto:**
   Copia la carpeta de este proyecto dentro del directorio `htdocs` de tu instalación de XAMPP:
   - En Windows: `C:\xampp\htdocs\ControlAdso`
   - En Mac: `/Applications/XAMPP/xamppfiles/htdocs/ControlAdso`
   - En Linux: `/opt/lampp/htdocs/ControlAdso`

2. **Iniciar servicios:**
   Abre el panel de control de XAMPP y presiona **Start** en **Apache** y en **MySQL**.

3. **Aprovisionar la Base de Datos en 1 Clic:**
   Abre en tu navegador la siguiente dirección:
   ```
   http://localhost/ControlAdso/install.php
   ```
   Haz clic en el botón **"Ejecutar Instalación / Migración"**.
   - El instalador creará automáticamente la base de datos `controladso_db`.
   - Creará las 12 tablas relacionales con restricciones e integridad referencial.
   - Cargará más de 50 activos del inventario oficial del SENA, sedes, ambientes, categorías, movimientos y tickets de prueba.

4. **Ingresar a la Aplicación:**
   Abre:
   ```
   http://localhost/ControlAdso/
   ```

---

### Opción 2: Importar manualmente desde phpMyAdmin

1. Abre `http://localhost/phpmyadmin/` en tu navegador.
2. Crea una base de datos llamada `controladso_db` con cotejamiento `utf8mb4_unicode_ci`.
3. Haz clic en la pestaña **Importar**.
4. Selecciona el archivo `database/schema.sql` ubicado en este proyecto y presiona **Continuar**.

---

### Opción 3: Servidor Embebido de PHP

Si tienes PHP y MySQL instalados en tu terminal:

```bash
# Iniciar servidor embebido en el puerto 8000
php -S localhost:8000
```
Luego abre `http://localhost:8000/install.php` en tu navegador.

---

## 👥 Usuarios de Prueba Preconfigurados

Todos los usuarios cuentan con la contraseña predeterminada: **`admin123`** (o acceso directo con 1 clic en la pantalla de login):

| Rol | Nombre | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|---|
| **Administrador (Admin RW)** | Carlos Mendoza | `carlos.mendoza@edustock.edu` | `admin123` | Control total, crear, editar, eliminar y traslados |
| **Técnico Mesa de Ayuda** | Tec. Marcos Peña | `marcos.pena@edustock.edu` | `admin123` | Gestión de tickets, diagnósticos y notas técnicas |
| **Auditora Externa (Consulta RO)** | Dra. Carmen Morales | `carmen.morales@edustock.edu` | `admin123` | Consulta de reportes y toma física in situ |

---

## 📁 Estructura del Proyecto

```text
├── config/
│   ├── db.php               # Conexión PDO a MySQL implementando el Patrón de Diseño SINGLETON
│   ├── jwt.php              # Implementación RFC 7519 de JSON Web Token (HS256)
│   └── auth.php             # Control de autenticación con JWT, cookies HTTP-Only y roles RBAC
├── database/
│   └── schema.sql           # Esquema relacional DDL + Seed Data institucional SENA
├── includes/
│   ├── header.php           # Encabezado HTML, Tailwind CSS y Lucide Icons
│   ├── navbar.php           # Barra superior con buscador y conmutador rápido de roles
│   ├── sidebar.php          # Menú lateral con enlaces a todos los módulos
│   └── footer.php           # Pie de página y cierre de scripts
├── index.php                # Dashboard principal con KPIs, aforo de ambientes y actividad
├── login.php                # Formulario de inicio de sesión institucional
├── logout.php               # Cierre de sesión
├── assets.php               # Catálogo maestro de inventario con filtros y búsqueda
├── asset_create.php         # Registro de nuevos activos con datos SENA
├── asset_edit.php           # Edición de activos existentes
├── asset_detail.php         # Hoja de vida, rótulo adhesivo y código QR oficial
├── asset_delete.php         # Baja o eliminación de activos
├── movements.php            # Histórico de traslados con firma criptográfica SHA-256
├── movement_create.php      # Formulario para transferir activos entre ambientes
├── movement_acta.php        # Acta de custodia digital imprimible con QR y sello digital
├── servicedesk.php          # Mesa de ayuda y seguimiento de casos técnicos con SLA
├── ticket_create.php        # Apertura de ticket técnico por falla
├── ticket_detail.php        # Línea de tiempo de reparación y bitácora de notas
├── audits.php               # Gestión de sesiones de auditoría física in situ
├── audit_session.php        # Toma física y cotejo en tiempo real (Presente / Discrepancia)
├── environments.php         # Ambientes de aprendizaje, sedes y porcentajes de ocupación
├── categories.php           # Familias de activos y porcentajes de operatividad
├── scanner.php              # Lector óptico QR y código de barras con cámara web o manual
├── reports.php              # Reportes ejecutivos para imprimir en formato oficial
├── users.php                # Directorio de usuarios y roles RBAC
├── install.php              # Asistente web de instalación en 1 clic
```

---

## ✨ Características Principales

1. **Patrón de Diseño Singleton (`Database::getInstance()`):**
   - Garantiza una única instancia de conexión PDO a MySQL para toda la ejecución de la petición.
   - Constructor privado, prevención de clonación (`__clone()`) y prevención de deserialización (`__wakeup()`).
2. **Patrón de Diseño Fábrica Abstracta (`AssetAbstractFactory` & `AssetFactoryProducer`):**
   - Proporciona una interfaz unificada para crear familias de elementos institucionales (`AssetInterface`) sin acoplar el código cliente a clases concretas.
   - **Familias de Productos Especializadas:**
     - `ITEquipmentFactory` &rarr; `ComputeAsset`: Laptops, Workstations y Todo-En-Uno (Garantía tecnológica de 3 años, cálculo de CPU, RAM, almacenamiento y licencias).
     - `InfrastructureFactory` &rarr; `InfrastructureAsset`: Climatización HVAC y Racks (Garantía de 5 años, ciclo trimestral de mantenimiento preventivo, capacidad BTU y refrigerante).
     - `RoboticsFactory` &rarr; `RoboticsAsset`: Brazos robóticos 6-DOF, Simuladores VR y sensores IoT (Garantía de 2 años, calibración periódica y protocolos ROS2/Ethernet).
     - `FurnitureFactory` &rarr; `FurnitureAsset`: Sillas ergonómicas, mesas y lockers (Garantía comercial de 1 año, resistencia y normas NTC 5655).
   - **Productor de Fábricas (`AssetFactoryProducer::getFactory($categoryId)`):** Resuelve dinámicamente la fábrica apropiada a partir de la categoría seleccionada en `asset_create.php`.
   - **Pruebas Automatizadas:** Ejecutable mediante `php tests/test_abstract_factory.php`.
3. **Arquitectura Modelo-Vista-Controlador (MVC) y Principios SOLID:**
   - **S (Single Responsibility Principle):** Cada capa tiene una responsabilidad única y delimitada:
     - `Controllers`: Reciben la petición HTTP, delegan a los servicios y retornan la vista o JSON.
     - `Services`: Lógica de dominio, cálculos criptográficos SHA-256, cálculo de SLA e integración con la Fábrica Abstracta.
     - `Repositories`: Encapsulan exclusivamente las operaciones de persistencia SQL en MySQL.
     - `Views`: Plantillas limpias sin consultas SQL embebidas.
   - **O (Open/Closed Principle):** Enrutador Front-Controller extensible y fábricas abiertas para agregar nuevas familias sin alterar el núcleo.
   - **L (Liskov Substitution Principle):** Cualquier repositorio que implemente los contratos de persistencia puede sustituirse sin quebrar los servicios o controladores.
   - **I (Interface Segregation Principle):** Interfaces segregadas y enfocadas (`AssetRepositoryInterface`, `MovementRepositoryInterface`, `TicketRepositoryInterface`, `EnvironmentRepositoryInterface`, `UserRepositoryInterface`).
   - **D (Dependency Inversion Principle):** Los controladores y servicios dependen de abstracciones/interfaces mediante un Contenedor de Inyección de Dependencias IoC (`App\Core\Container`), nunca de clases concretas o variables globales.
   - **Pruebas Automatizadas:** Ejecutable mediante `php tests/test_mvc_solid.php` (10 pruebas unitarias con 100% PASS).
4. **Autenticación con JSON Web Tokens (JWT - RFC 7519):**
   - Firma criptográfica HMAC SHA-256 (`HS256`).
   - Almacenamiento seguro en cookie `HTTP-Only` con SameSite Lax para protección contra ataques XSS y CSRF.
   - Verificación de firma en tiempo constante (`hash_equals`) y expiración automática (`exp`).
5. **Campos Oficiales SENA:** Regional (41), Centro de Costos (952710), Módulo (INVE), Número de Placa, Consecutivo, Serial y Valor de Ingreso.
6. **Criptografía SHA-256 para Actas:** Generación de actas de custodia digital no repudiables con hash inmutable de 64 caracteres.
7. **Mesa de Ayuda con SLA:** Control de horas restantes según prioridad (Crítica 24h, Alta 48h, Media 72h, Baja 120h).
8. **Toma Física In Situ:** Interfaz de cotejo para inventarios físicos con verificación de discrepancias.
9. **Generador y Lector de Códigos QR:** Generación de rótulo patrimonial y escaneo en vivo con la cámara del dispositivo móvil o laptop.
