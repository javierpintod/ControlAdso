-- ==============================================================================
-- CONTROLADSO - EDUSTOCK ASSET MANAGER
-- Esquema Completo para MySQL / MariaDB (XAMPP / WAMP / phpMyAdmin)
-- Regional Antioquia - Centro de Servicios y Gestión Empresarial (SENA)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS controladso_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE controladso_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_items;
DROP TABLE IF EXISTS audit_sessions;
DROP TABLE IF EXISTS ticket_notes;
DROP TABLE IF EXISTS ticket_timeline_steps;
DROP TABLE IF EXISTS service_desk_tickets;
DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS asset_history;
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS environments;
DROP TABLE IF EXISTS campuses;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Sedes
CREATE TABLE campuses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Medellin / Bogota',
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Ambientes de Aprendizaje
CREATE TABLE environments (
    id VARCHAR(50) PRIMARY KEY,
    campus_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    code_name VARCHAR(100) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT 'monitor',
    total_capacity INT DEFAULT 35,
    assigned_count INT DEFAULT 0,
    occupancy_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_env_campus FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Perfiles y Usuarios RBAC
CREATE TABLE user_profiles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'consulta', 'tecnico') NOT NULL DEFAULT 'consulta',
    role_title VARCHAR(100) NOT NULL,
    authorized_environments TEXT,
    last_login VARCHAR(100) DEFAULT 'Reciente',
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    active_session TINYINT(1) DEFAULT 1,
    status ENUM('active', 'suspended') DEFAULT 'active',
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Categorias de Productos
CREATE TABLE product_categories (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'folder',
    amb1 INT DEFAULT 0,
    amb2 INT DEFAULT 0,
    amb3 INT DEFAULT 0,
    mesa INT DEFAULT 0,
    dano INT DEFAULT 0,
    total INT DEFAULT 0,
    operational_percentage DECIMAL(5,2) DEFAULT 100.0,
    status ENUM('ok', 'warning', 'critical') DEFAULT 'ok',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Activos Serializados (Inventario Institucional SENA)
CREATE TABLE assets (
    id VARCHAR(36) PRIMARY KEY,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    category_name VARCHAR(100),
    environment_id VARCHAR(50) NOT NULL,
    environment_name VARCHAR(150),
    station VARCHAR(100) NOT NULL,
    physical_status ENUM('operativo', 'mesa_servicio', 'con_dano', 'mantenimiento', 'decomisado') NOT NULL DEFAULT 'operativo',
    status_label VARCHAR(100) NOT NULL DEFAULT 'Operativo en Uso',
    responsible_person VARCHAR(150) NOT NULL,
    assigned_date DATE DEFAULT (CURRENT_DATE),
    warranty_until DATE,
    barcode VARCHAR(100) NOT NULL,
    qr_token VARCHAR(150) NOT NULL,
    specs TEXT,
    photo_url TEXT,
    regional VARCHAR(20) DEFAULT '41',
    centro_costo VARCHAR(50) DEFAULT '952710',
    modulo VARCHAR(50) DEFAULT 'INVE',
    modelo VARCHAR(150),
    consecutivo VARCHAR(50),
    descripcion TEXT,
    descripcion_actual TEXT,
    tipo VARCHAR(50) DEFAULT 'Devolutivo',
    placa VARCHAR(50) UNIQUE,
    serial VARCHAR(100),
    fecha_adquisicion VARCHAR(50),
    valor_ingreso VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_asset_environment FOREIGN KEY (environment_id) REFERENCES environments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Historial de Vida del Activo
CREATE TABLE asset_history (
    id VARCHAR(36) PRIMARY KEY,
    asset_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    date_str VARCHAR(50) NOT NULL,
    time_str VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Movimientos y Actas de Custodia Digital (SHA-256)
CREATE TABLE inventory_movements (
    id VARCHAR(36) PRIMARY KEY,
    folio VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('IN', 'OUT', 'TRANSFER') NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    asset_id VARCHAR(36),
    asset_code VARCHAR(100),
    serial_number VARCHAR(100),
    origin_environment_id VARCHAR(50),
    origin_environment_name VARCHAR(150),
    destination_environment_id VARCHAR(50) NOT NULL,
    destination_environment_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    user_id VARCHAR(36),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    timestamp_str VARCHAR(100) NOT NULL,
    crypto_hash VARCHAR(64) NOT NULL,
    qr_verification_token VARCHAR(100) NOT NULL,
    status ENUM('COMPLETADO', 'PENDIENTE', 'RECHAZADO') DEFAULT 'COMPLETADO',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movement_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL,
    CONSTRAINT fk_movement_orig_env FOREIGN KEY (origin_environment_id) REFERENCES environments(id) ON DELETE SET NULL,
    CONSTRAINT fk_movement_dest_env FOREIGN KEY (destination_environment_id) REFERENCES environments(id),
    CONSTRAINT fk_movement_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Mesa de Servicio (Tickets de Soporte)
CREATE TABLE service_desk_tickets (
    id VARCHAR(36) PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    folio VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    asset_id VARCHAR(36),
    asset_name VARCHAR(200) NOT NULL,
    asset_code VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    priority ENUM('critica', 'alta', 'media', 'baja') NOT NULL DEFAULT 'media',
    priority_label VARCHAR(50) NOT NULL,
    status ENUM('taller_diagnostico', 'en_reparacion', 'espera_repuesto', 'resuelto', 'garantia_externa') NOT NULL DEFAULT 'taller_diagnostico',
    status_label VARCHAR(100) NOT NULL,
    sla_hours_left INT DEFAULT 48,
    total_sla_hours INT DEFAULT 48,
    origin_environment_id VARCHAR(50),
    origin_environment VARCHAR(150) NOT NULL,
    environment_name VARCHAR(150),
    current_custody_location VARCHAR(200) NOT NULL,
    received_by VARCHAR(150) NOT NULL,
    reporter_name VARCHAR(150) NOT NULL,
    reporter_date VARCHAR(100) NOT NULL,
    declared_symptom TEXT NOT NULL,
    diagnostic_notes TEXT,
    repair_cost_estimate VARCHAR(100),
    technician_name VARCHAR(150),
    evidence_photo_url TEXT,
    evidence_photo_gps VARCHAR(200),
    evidence_size VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL,
    CONSTRAINT fk_ticket_env FOREIGN KEY (origin_environment_id) REFERENCES environments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Pasos del Flujo de Reparacion
CREATE TABLE ticket_timeline_steps (
    id VARCHAR(36) PRIMARY KEY,
    ticket_id VARCHAR(36) NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    time_label VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(150) NOT NULL,
    status ENUM('completed', 'current', 'pending') NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_timeline_ticket FOREIGN KEY (ticket_id) REFERENCES service_desk_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Notas Tecnicas de Tickets
CREATE TABLE ticket_notes (
    id VARCHAR(36) PRIMARY KEY,
    ticket_id VARCHAR(36) NOT NULL,
    author VARCHAR(150) NOT NULL,
    author_initials VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    time_ago VARCHAR(50) DEFAULT 'Justo ahora',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_ticket FOREIGN KEY (ticket_id) REFERENCES service_desk_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Sesiones de Auditoria Fisica In Situ
CREATE TABLE audit_sessions (
    id VARCHAR(36) PRIMARY KEY,
    is_active TINYINT(1) DEFAULT 1,
    environment_id VARCHAR(50) NOT NULL,
    environment_name VARCHAR(150) NOT NULL,
    building VARCHAR(100) NOT NULL,
    total_items INT DEFAULT 0,
    verified_count INT DEFAULT 0,
    pending_count INT DEFAULT 0,
    mismatch_count INT DEFAULT 0,
    started_at VARCHAR(100) NOT NULL,
    auditor_name VARCHAR(150) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_env FOREIGN KEY (environment_id) REFERENCES environments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Lista de Cotejo de Auditoria
CREATE TABLE audit_items (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    asset_id VARCHAR(36),
    serial_number VARCHAR(100) NOT NULL,
    asset_code VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    station VARCHAR(100) NOT NULL,
    sheet_number VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM('verified', 'pending', 'mismatch') NOT NULL DEFAULT 'pending',
    verified_at VARCHAR(50),
    verified_by VARCHAR(150),
    discrepancy_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_session FOREIGN KEY (session_id) REFERENCES audit_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INSERCION DE DATOS INICIALES (SEED DATA)
-- ==============================================================================

-- Sedes
INSERT INTO campuses (id, name, code, address, city) VALUES
('central', 'Sede Central - Campus Educativo SENA', 'CMP-CEN-01', 'Calle 52 # 13-65', 'Medellin / Bogota'),
('norte', 'Campus Tecnologico Norte', 'CMP-NOR-02', 'Autopista Norte # 195-20', 'Bogota D.C.'),
('sur', 'Centro de Innovacion y Desarrollo Sur', 'CMP-SUR-03', 'Av. Villavicencio # 45-10', 'Medellin');

-- Ambientes
INSERT INTO environments (id, campus_id, name, code_name, building, floor, icon, total_capacity, assigned_count, occupancy_percentage) VALUES
('amb1', 'central', 'Ambiente 1: Lab Robotica e IA', 'Lab Robotica & IA', 'Edificio Tecnologias', 'Piso 2 • Ala Norte', 'bot', 35, 14, 40.00),
('amb2', 'central', 'Ambiente 2: Aula Computo & Redes ADSO', 'Aula Computo & Redes', 'Edificio Ingenierias', 'Piso 3 • Aula 302', 'network', 40, 20, 50.00),
('amb3', 'central', 'Ambiente 3: Taller de Electronica & IoT', 'Taller de Electronica', 'Edificio Tecnologias', 'Piso 1 • Taller 104', 'cpu', 30, 10, 33.33),
('service', 'central', 'Mesa de Servicio Tecnico', 'Mesa de Servicio', 'Edificio Central', 'Nivel 2 • Taller', 'wrench', 50, 4, 8.00),
('damaged', 'central', 'Almacen de Equipos con Dano / RAEE', 'Almacen Dano', 'Sotano 1', 'Deposito General', 'alert-triangle', 100, 4, 4.00),
('unassigned', 'central', 'Sin Asignar / Deposito General', 'Sin Asignar', 'Edificio Central', 'Deposito General', 'archive', 500, 2, 0.40);

-- Categorias
INSERT INTO product_categories (id, code, name, description, icon, amb1, amb2, amb3, mesa, dano, total, operational_percentage, status) VALUES
('cat-comp', 'COMP', 'Laptops & Estaciones Moviles', 'Equipos portatiles de alto rendimiento para desarrollo de software ADSO', 'laptop', 8, 12, 0, 2, 1, 23, 91.30, 'ok'),
('cat-aio', 'AIO', 'Computadores Todo-En-Uno (AIO)', 'Workstations integradas con pantalla de alta definicion', 'monitor', 2, 8, 0, 1, 1, 12, 91.60, 'ok'),
('cat-cpu', 'CPU', 'Workstations & Servidores Desktop', 'Estaciones de trabajo de alto rendimiento Intel Core i7 / Xeon', 'server', 2, 0, 6, 1, 1, 10, 80.00, 'warning'),
('cat-clim', 'CLIM', 'Climatizacion & Aires Acondicionados', 'Aires acondicionados industriales Mini Split y Piso Techo', 'wind', 2, 0, 2, 0, 1, 5, 80.00, 'ok'),
('cat-robt', 'ROBT', 'Robots Educativos & Brazos 6-DOF', 'Brazos roboticos con servomotores y vision computacional', 'bot', 0, 0, 2, 0, 0, 2, 100.00, 'ok');

-- Usuarios
-- Contrasena predeterminada para todos: admin123
INSERT INTO user_profiles (id, name, email, password, role, role_title, authorized_environments, last_login, status) VALUES
('usr-admin', 'Carlos Mendoza', 'carlos.mendoza@edustock.edu', '$2y$10$KBkFfNlGsk7d3067Rjj.t.cGYG24s0NvjKmH/Ef8/ffvmqJj05B4m', 'admin', 'Administrador General (Admin RW)', 'Todos los Ambientes', 'Activo ahora', 'active'),
('usr-tecnico', 'Tec. Marcos Pena', 'marcos.pena@edustock.edu', '$2y$10$KBkFfNlGsk7d3067Rjj.t.cGYG24s0NvjKmH/Ef8/ffvmqJj05B4m', 'tecnico', 'Tecnico de Soporte Mesa de Ayuda', 'Mesa de Servicio, Almacen Dano', 'Ayer, 05:40 PM', 'active'),
('usr-auditor', 'Dra. Carmen Morales', 'carmen.morales@edustock.edu', '$2y$10$KBkFfNlGsk7d3067Rjj.t.cGYG24s0NvjKmH/Ef8/ffvmqJj05B4m', 'consulta', 'Auditora Externa (Consulta RO)', 'Ambiente 1, Ambiente 2, Ambiente 3', 'Hoy, 08:30 AM', 'active');
-- Insercion de Activos Institucionales SENA
INSERT INTO assets (
    id, serial_number, asset_code, name, description,
    category_id, category_name, environment_id, environment_name,
    station, physical_status, status_label, responsible_person,
    assigned_date, warranty_until, barcode, qr_token,
    regional, centro_costo, modulo, modelo, consecutivo,
    descripcion, descripcion_actual, tipo, placa, serial,
    fecha_adquisicion, valor_ingreso
) VALUES
('ast-sena-95271022764', '2019', 'AST-95271022764', 'AIRE ACONDICIONADO CS-24A', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 24000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA MINI SPLIT', 'cat-clim', 'Climatizacion & Aires Acondicionados', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #01', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271022764', 'qr_sena_95271022764', '41', '952710', 'INVE', 'CS-24A', '232794', 'AIRE ACONDICIONADO', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 24000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA MINI SPLIT', '4', '95271022764', '2019', '26/12/2018', '$2.220.000,00'),
('ast-sena-95271022765', '0426', 'AST-95271022765', 'AIRE ACONDICIONADO CS-24A', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 24000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA MINI SPLIT', 'cat-clim', 'Climatizacion & Aires Acondicionados', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #02', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271022765', 'qr_sena_95271022765', '41', '952710', 'INVE', 'CS-24A', '232794', 'AIRE ACONDICIONADO', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 24000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA MINI SPLIT', '4', '95271022765', '0426', '26/12/2018', '$2.220.000,00'),
('ast-sena-95271025486', '3122G05688', 'AST-95271025486', 'AIRE ACONDICIONADO LAC060', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', 'cat-clim', 'Climatizacion & Aires Acondicionados', 'amb3', 'Ambiente 3: Taller de Electronica & IoT', 'Estacion #03', 'operativo', 'Operativo en Uso', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271025486', 'qr_sena_95271025486', '41', '952710', 'INVE', 'LAC060', '242892', 'AIRE ACONDICIONADO', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', '4', '95271025486', '3122G05688', '28/12/2023', '$8.235.294,00'),
('ast-sena-95271025485', '3122C01766', 'AST-95271025485', 'AIRE ACONDICIONADO LAC060', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', 'cat-clim', 'Climatizacion & Aires Acondicionados', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #04', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271025485', 'qr_sena_95271025485', '41', '952710', 'INVE', 'LAC060', '242892', 'AIRE ACONDICIONADO', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', '4', '95271025485', '3122C01766', '28/12/2023', '$8.235.294,00'),
('ast-sena-95271025484', '3122G05695', 'AST-95271025484', 'AIRE ACONDICIONADO LAC060', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', 'cat-clim', 'Climatizacion & Aires Acondicionados', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #05', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271025484', 'qr_sena_95271025484', '41', '952710', 'INVE', 'LAC060', '242892', 'AIRE ACONDICIONADO', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', '4', '95271025484', '3122G05695', '28/12/2023', '$8.235.294,00'),
('ast-sena-95271024828', '8TF8DB3', 'AST-95271024828', 'COMPUTADOR PORTATIL PRESCISION 3551', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'service', 'Mesa de Servicio Tecnico', 'Estacion #06', 'mesa_servicio', 'En Mesa de Ayuda / Diagnostico', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271024828', 'qr_sena_95271024828', '41', '952710', 'INVE', 'PRESCISION 3551', '299274', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', '4', '95271024828', '8TF8DB3', '20/04/2021', '$6.422.400,00'),
('ast-sena-95271024818', '53N5DB3', 'AST-95271024818', 'COMPUTADOR PORTATIL PRESCISION 3551', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'damaged', 'Almacen de Equipos con Dano / RAEE', 'Estacion #07', 'con_dano', 'Con Dano Fisico / Deposito', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271024818', 'qr_sena_95271024818', '41', '952710', 'INVE', 'PRESCISION 3551', '299274', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', '4', '95271024818', '53N5DB3', '20/04/2021', '$6.422.400,00'),
('ast-sena-95271024817', 'CFH1DB3', 'AST-95271024817', 'COMPUTADOR PORTATIL PRESCISION 3551', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #08', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271024817', 'qr_sena_95271024817', '41', '952710', 'INVE', 'PRESCISION 3551', '299274', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', '4', '95271024817', 'CFH1DB3', '20/04/2021', '$6.422.400,00'),
('ast-sena-95271024816', 'DPT5DB3', 'AST-95271024816', 'COMPUTADOR PORTATIL PRESCISION 3551', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #09', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024816', 'qr_sena_95271024816', '41', '952710', 'INVE', 'PRESCISION 3551', '299274', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', '4', '95271024816', 'DPT5DB3', '20/04/2021', '$6.422.400,00'),
('ast-sena-95271024815', 'H9Z6DB3', 'AST-95271024815', 'COMPUTADOR PORTATIL PRESCISION 3551', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #10', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024815', 'qr_sena_95271024815', '41', '952710', 'INVE', 'PRESCISION 3551', '299274', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', '4', '95271024815', 'H9Z6DB3', '20/04/2021', '$6.422.400,00'),
('ast-sena-95271024814', '1SRQFB3', 'AST-95271024814', 'COMPUTADOR PORTATIL PRESCISION 3551', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #11', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271024814', 'qr_sena_95271024814', '41', '952710', 'INVE', 'PRESCISION 3551', '299274', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.', '4', '95271024814', '1SRQFB3', '20/04/2021', '$6.422.400,00'),
('ast-sena-101001130405', 'C02C24A7MD6T', 'AST-101001130405', 'COMPUTADOR PORTATIL Z0Y05E/A', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I9 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 16 PULGADAS UNIDAD LECTORA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb3', 'Ambiente 3: Taller de Electronica & IoT', 'Estacion #12', 'operativo', 'Operativo en Uso', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7701001130405', 'qr_sena_101001130405', '41', '952710', 'INVE', 'Z0Y05E/A', '298208', 'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I9 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 16 PULGADAS UNIDAD LECTORA N.A.', '4', '101001130405', 'C02C24A7MD6T', '13/05/2020', '$10.774.109,24'),
('ast-sena-95271024618', '6LJB673', 'AST-95271024618', 'CPU PRECISION 3440', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #13', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024618', 'qr_sena_95271024618', '41', '952710', 'INVE', 'PRECISION 3440', '298471', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '95271024618', '6LJB673', '30/11/2020', '$5.764.590,00'),
('ast-sena-95271024562', '6LJ9673', 'AST-95271024562', 'CPU PRECISION 3440', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #14', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271024562', 'qr_sena_95271024562', '41', '952710', 'INVE', 'PRECISION 3440', '298471', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '95271024562', '6LJ9673', '30/11/2020', '$5.764.590,00'),
('ast-sena-95271024610', '6LJVH63', 'AST-95271024610', 'CPU PRECISION 3440', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'service', 'Mesa de Servicio Tecnico', 'Estacion #15', 'mesa_servicio', 'En Mesa de Ayuda / Diagnostico', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271024610', 'qr_sena_95271024610', '41', '952710', 'INVE', 'PRECISION 3440', '298471', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '95271024610', '6LJVH63', '30/11/2020', '$5.764.590,00'),
('ast-sena-95271024606', '6LJYH63', 'AST-95271024606', 'CPU PRECISION 3440', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'damaged', 'Almacen de Equipos con Dano / RAEE', 'Estacion #16', 'con_dano', 'Con Dano Fisico / Deposito', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271024606', 'qr_sena_95271024606', '41', '952710', 'INVE', 'PRECISION 3440', '298471', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '95271024606', '6LJYH63', '30/11/2020', '$5.764.590,00'),
('ast-sena-95271024602', '6LJWH63', 'AST-95271024602', 'CPU PRECISION 3440', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #17', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271024602', 'qr_sena_95271024602', '41', '952710', 'INVE', 'PRECISION 3440', '298471', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '95271024602', '6LJWH63', '30/11/2020', '$5.764.590,00'),
('ast-sena-95271024598', '6LJ8673', 'AST-95271024598', 'CPU PRECISION 3440', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #18', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024598', 'qr_sena_95271024598', '41', '952710', 'INVE', 'PRECISION 3440', '298471', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '95271024598', '6LJ8673', '30/11/2020', '$5.764.590,00'),
('ast-sena-95271024477', '34ZM853', 'AST-95271024477', 'CPU INTEGRADA CON MONITOR OPTIPLEX 7470AIO', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #19', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024477', 'qr_sena_95271024477', '41', '952710', 'INVE', 'OPTIPLEX 7470AIO', '297485', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271024477', '34ZM853', '18/11/2020', '$2.691.882,00'),
('ast-sena-95271024478', '34VFQ53', 'AST-95271024478', 'CPU INTEGRADA CON MONITOR OPTIPLEX 7470AIO', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #20', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271024478', 'qr_sena_95271024478', '41', '952710', 'INVE', 'OPTIPLEX 7470AIO', '297485', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271024478', '34VFQ53', '18/11/2020', '$2.691.882,00'),
('ast-sena-95271024479', '358DQ53', 'AST-95271024479', 'CPU INTEGRADA CON MONITOR OPTIPLEX 7470AIO', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb3', 'Ambiente 3: Taller de Electronica & IoT', 'Estacion #01', 'operativo', 'Operativo en Uso', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271024479', 'qr_sena_95271024479', '41', '952710', 'INVE', 'OPTIPLEX 7470AIO', '297485', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271024479', '358DQ53', '18/11/2020', '$2.691.882,00'),
('ast-sena-95271024483', '34VM853', 'AST-95271024483', 'CPU INTEGRADA CON MONITOR OPTIPLEX 7470AIO', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #02', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024483', 'qr_sena_95271024483', '41', '952710', 'INVE', 'OPTIPLEX 7470AIO', '297485', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271024483', '34VM853', '18/11/2020', '$2.691.882,00'),
('ast-sena-10104118894', '8CN4490K77', 'AST-10104118894', 'CPU INTEGRADA CON MONITOR PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #03', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700104118894', 'qr_sena_10104118894', '41', '101041', 'INVE', 'PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', '301857', 'CPU INTEGRADA CON MONITOR', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', '4', '10104118894', '8CN4490K77', '28/02/2025', '$3.373.931,00'),
('ast-sena-10104118895', '8CN4490K85', 'AST-10104118895', 'CPU INTEGRADA CON MONITOR PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'service', 'Mesa de Servicio Tecnico', 'Estacion #04', 'mesa_servicio', 'En Mesa de Ayuda / Diagnostico', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700104118895', 'qr_sena_10104118895', '41', '101041', 'INVE', 'PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', '301857', 'CPU INTEGRADA CON MONITOR', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', '4', '10104118895', '8CN4490K85', '28/02/2025', '$3.373.931,00'),
('ast-sena-10104118896', '8CN4490K89', 'AST-10104118896', 'CPU INTEGRADA CON MONITOR PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'damaged', 'Almacen de Equipos con Dano / RAEE', 'Estacion #05', 'con_dano', 'Con Dano Fisico / Deposito', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700104118896', 'qr_sena_10104118896', '41', '101041', 'INVE', 'PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', '301857', 'CPU INTEGRADA CON MONITOR', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', '4', '10104118896', '8CN4490K89', '28/02/2025', '$3.373.931,00'),
('ast-sena-10104118897', '8CN4490KCY', 'AST-10104118897', 'CPU INTEGRADA CON MONITOR PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #06', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700104118897', 'qr_sena_10104118897', '41', '101041', 'INVE', 'PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', '301857', 'CPU INTEGRADA CON MONITOR', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', '4', '10104118897', '8CN4490KCY', '28/02/2025', '$3.373.931,00'),
('ast-sena-10104118898', '8CN4490KD5', 'AST-10104118898', 'CPU INTEGRADA CON MONITOR PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #07', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7700104118898', 'qr_sena_10104118898', '41', '101041', 'INVE', 'PC AIO HP PRO ONE 440 G9 I7 B5CR9LS', '301857', 'CPU INTEGRADA CON MONITOR', 'CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;', '4', '10104118898', '8CN4490KD5', '28/02/2025', '$3.373.931,00'),
('ast-sena-95271022889', '8CG8493CDH', 'AST-95271022889', 'CPU INTEGRADA CON MONITOR PRO ONE 400', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #08', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271022889', 'qr_sena_95271022889', '41', '952710', 'INVE', 'PRO ONE 400', '289196', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271022889', '8CG8493CDH', '31/12/2018', '$4.302.170,88'),
('ast-sena-95271022890', '8CG8493CBV', 'AST-95271022890', 'CPU INTEGRADA CON MONITOR PRO ONE 400', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #09', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271022890', 'qr_sena_95271022890', '41', '952710', 'INVE', 'PRO ONE 400', '289196', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271022890', '8CG8493CBV', '31/12/2018', '$4.302.170,88'),
('ast-sena-95271022891', '8CG8493CC3', 'AST-95271022891', 'CPU INTEGRADA CON MONITOR PRO ONE 400', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', 'cat-aio', 'Computadores Todo-En-Uno (AIO)', 'amb3', 'Ambiente 3: Taller de Electronica & IoT', 'Estacion #10', 'operativo', 'Operativo en Uso', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271022891', 'qr_sena_95271022891', '41', '952710', 'INVE', 'PRO ONE 400', '289196', 'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.', '4', '95271022891', '8CG8493CC3', '31/12/2018', '$4.302.170,88'),
('ast-sena-95271024563', 'CN04D9T1QDC0004QA52U', 'AST-95271024563', 'MONITOR P2219H', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #11', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271024563', 'qr_sena_95271024563', '41', '952710', 'INVE', 'P2219H', '284008', 'MONITOR', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.', '4', '95271024563', 'CN04D9T1QDC0004QA52U', '30/11/2020', '$1.108.575,00'),
('ast-sena-95271024567', 'CN04D9T1QDC0003V68HB', 'AST-95271024567', 'MONITOR P2219H', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #12', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271024567', 'qr_sena_95271024567', '41', '952710', 'INVE', 'P2219H', '284008', 'MONITOR', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.', '4', '95271024567', 'CN04D9T1QDC0003V68HB', '30/11/2020', '$1.108.575,00'),
('ast-sena-95271024571', 'CN04D9T1QDC0008A1PSI', 'AST-95271024571', 'MONITOR P2219H', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'service', 'Mesa de Servicio Tecnico', 'Estacion #13', 'mesa_servicio', 'En Mesa de Ayuda / Diagnostico', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271024571', 'qr_sena_95271024571', '41', '952710', 'INVE', 'P2219H', '284008', 'MONITOR', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.', '4', '95271024571', 'CN04D9T1QDC0008A1PSI', '30/11/2020', '$1.108.575,00'),
('ast-sena-952715603', 'Z7H0HCDDB00830Y', 'AST-952715603', 'MONITOR MD55C', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 55 PULGADAS UNIDAD DE MEDIDA UNIDAD TECNOLOGIA LED INDUSTRIAL', 'cat-comp', 'Laptops & Estaciones Moviles', 'damaged', 'Almacen de Equipos con Dano / RAEE', 'Estacion #14', 'con_dano', 'Con Dano Fisico / Deposito', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700952715603', 'qr_sena_952715603', '41', '952710', 'INVE', 'MD55C', '275786', 'MONITOR', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 55 PULGADAS UNIDAD DE MEDIDA UNIDAD TECNOLOGIA LED INDUSTRIAL', '4', '952715603', 'Z7H0HCDDB00830Y', '27/12/2013', '$3.785.047,86'),
('ast-sena-952721722', 'KYSD103D05090083', 'AST-952721722', 'MONITOR ONE SCREEN', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD TECNOLOGIA PANTALLA GRAFICA INTERACTIVA', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #15', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700952721722', 'qr_sena_952721722', '41', '952710', 'INVE', 'ONE SCREEN', '273258', 'MONITOR', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD TECNOLOGIA PANTALLA GRAFICA INTERACTIVA', '4', '952721722', 'KYSD103D05090083', '23/12/2017', '$18.900.000,00'),
('ast-sena-1001102292', 'R32C603KKQD', 'AST-1001102292', 'TABLET GALAXY TAB 2 P5110', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 10.1 PULGADAS UNIDAD DE MEDIDA UNIDAD MEMORIA 16 GB', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #16', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7701001102292', 'qr_sena_1001102292', '41', '952710', 'INVE', 'GALAXY TAB 2 P5110', '273255', 'TABLET', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO 10.1 PULGADAS UNIDAD DE MEDIDA UNIDAD MEMORIA 16 GB', '4', '1001102292', 'R32C603KKQD', '28/12/2012', '$729.900,00'),
('ast-sena-952721694', '5CC7420003', 'AST-952721694', 'PLATAFORMAS DE SIMULACION OMEN', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA ESTACION DE TRABAJO GAMER MATERIAL N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #17', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7700952721694', 'qr_sena_952721694', '41', '952710', 'INVE', 'OMEN', '287898', 'PLATAFORMAS DE SIMULACION', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA ESTACION DE TRABAJO GAMER MATERIAL N.A.', '4', '952721694', '5CC7420003', '23/12/2017', '$42.450.000,00'),
('ast-sena-952721695', '5CC7420004', 'AST-952721695', 'CPU OMEN', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA COMPUTADOR GAMER PROCESADOR N.A. DISCO DURO N.A. MEMORIA N.A. UNIDAD LECTORA N.A.', 'cat-cpu', 'Workstations & Servidores Desktop', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #18', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700952721695', 'qr_sena_952721695', '41', '952710', 'INVE', 'OMEN', '287899', 'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA COMPUTADOR GAMER PROCESADOR N.A. DISCO DURO N.A. MEMORIA N.A. UNIDAD LECTORA N.A.', '4', '952721695', '5CC7420004', '23/12/2017', '$6.600.000,00'),
('ast-sena-952721703', 'VR-SENA-001', 'AST-952721703', 'SIMULADOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE CASCO DE REALIDAD VIRTUAL HTC VIVE / OCULUS', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb3', 'Ambiente 3: Taller de Electronica & IoT', 'Estacion #19', 'operativo', 'Operativo en Uso', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700952721703', 'qr_sena_952721703', '41', '952710', 'INVE', 'N/A', '287605', 'SIMULADOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE CASCO DE REALIDAD VIRTUAL HTC VIVE / OCULUS', '4', '952721703', 'VR-SENA-001', '23/12/2017', '$4.200.000,00'),
('ast-sena-952720898', '197907272816', 'AST-952720898', 'CONSOLA XBOX ONE', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA CONSOLA DESARROLLO VIDEOJUEGOS', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #20', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7700952720898', 'qr_sena_952720898', '41', '952710', 'INVE', 'XBOX ONE', '248127', 'CONSOLA', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA CONSOLA DESARROLLO VIDEOJUEGOS', '4', '952720898', '197907272816', '06/12/2017', '$1.950.000,00'),
('ast-sena-95276104', 'A400E066773', 'AST-95276104', 'ESCANER 4500', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE HUELLA DIGITAL CON INTERFASE TECNOLOGIA USB', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #01', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700095276104', 'qr_sena_95276104', '41', '952710', 'INVE', '4500', '235395', 'ESCANER', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE HUELLA DIGITAL CON INTERFASE TECNOLOGIA USB', '4', '95276104', 'A400E066773', '09/09/2010', '$277.240,00'),
('ast-sena-95276105', 'A400E066775', 'AST-95276105', 'ESCANER 4500', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE HUELLA DIGITAL CON INTERFASE TECNOLOGIA USB', 'cat-comp', 'Laptops & Estaciones Moviles', 'service', 'Mesa de Servicio Tecnico', 'Estacion #02', 'mesa_servicio', 'En Mesa de Ayuda / Diagnostico', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700095276105', 'qr_sena_95276105', '41', '952710', 'INVE', '4500', '235395', 'ESCANER', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE HUELLA DIGITAL CON INTERFASE TECNOLOGIA USB', '4', '95276105', 'A400E066775', '09/09/2010', '$277.240,00'),
('ast-sena-95276126', 'Y6EWG6', 'AST-95276126', 'LECTOR SYMBOLLS2208', 'TIPO ELEMENTO DEVOLUTIVO USO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE CODIGO DE BARRAS LASER', 'cat-comp', 'Laptops & Estaciones Moviles', 'damaged', 'Almacen de Equipos con Dano / RAEE', 'Estacion #03', 'con_dano', 'Con Dano Fisico / Deposito', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700095276126', 'qr_sena_95276126', '41', '952710', 'INVE', 'SYMBOLLS2208', '235304', 'LECTOR', 'TIPO ELEMENTO DEVOLUTIVO USO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE CODIGO DE BARRAS LASER', '4', '95276126', 'Y6EWG6', '09/09/2010', '$370.968,00'),
('ast-sena-95276128', 'Y6GWGF', 'AST-95276128', 'LECTOR SYMBOLLS2208', 'TIPO ELEMENTO DEVOLUTIVO USO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE CODIGO DE BARRAS LASER', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #04', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700095276128', 'qr_sena_95276128', '41', '952710', 'INVE', 'SYMBOLLS2208', '235304', 'LECTOR', 'TIPO ELEMENTO DEVOLUTIVO USO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE CODIGO DE BARRAS LASER', '4', '95276128', 'Y6GWGF', '09/09/2010', '$370.968,00'),
('ast-sena-95271026663', 'SIL-APL-01', 'AST-95271026663', 'SILLA', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA APILABLE MATERIAL N.A. SISTEMA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #05', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271026663', 'qr_sena_95271026663', '41', '952710', 'INVE', 'N/A', '234792', 'SILLA', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA APILABLE MATERIAL N.A. SISTEMA N.A.', '4', '95271026663', 'SIL-APL-01', '23/10/2025', '$97.371,65'),
('ast-sena-95271026665', 'SIL-APL-02', 'AST-95271026665', 'SILLA', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA APILABLE MATERIAL N.A. SISTEMA N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #06', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271026665', 'qr_sena_95271026665', '41', '952710', 'INVE', 'N/A', '234792', 'SILLA', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA APILABLE MATERIAL N.A. SISTEMA N.A.', '4', '95271026665', 'SIL-APL-02', '23/10/2025', '$97.371,65'),
('ast-sena-95271028147', 'SIL-ERG-01', 'AST-95271028147', 'SILLA', 'SILLA;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;CARACTERISTICA=ERGONOMICA GIRATORIA, CON BRAZOS GRADUABLES, ESPALDAR EN MALLA;CLASE=N.A.;COLOR=N.A.;MATERIAL=N.A.;SISTEMA=N.A.;', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #07', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7705271028147', 'qr_sena_95271028147', '41', '952710', 'INVE', 'N/A', '304353', 'SILLA', 'SILLA;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;CARACTERISTICA=ERGONOMICA GIRATORIA, CON BRAZOS GRADUABLES, ESPALDAR EN MALLA;CLASE=N.A.;COLOR=N.A.;MATERIAL=N.A.;SISTEMA=N.A.;', '4', '95271028147', 'SIL-ERG-01', '15/04/2026', '$515.126,05'),
('ast-sena-10104118696', 'SIL-MAL-01', 'AST-10104118696', 'SILLA', 'SILLA;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;CARACTERISTICA=GIRATORIA, EN MALLA RESPALDO MEDIO;CLASE=N.A.;COLOR=N.A.;MATERIAL=N.A.;SISTEMA=N.A.;', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb3', 'Ambiente 3: Taller de Electronica & IoT', 'Estacion #08', 'operativo', 'Operativo en Uso', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700104118696', 'qr_sena_10104118696', '41', '101041', 'INVE', 'N/A', '299707', 'SILLA', 'SILLA;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;CARACTERISTICA=GIRATORIA, EN MALLA RESPALDO MEDIO;CLASE=N.A.;COLOR=N.A.;MATERIAL=N.A.;SISTEMA=N.A.;', '4', '10104118696', 'SIL-MAL-01', '17/12/2021', '$601.092,44'),
('ast-sena-95271028282', 'ESC-001', 'AST-95271028282', 'ESCRITORIO', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA N.A. MATERIAL N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #09', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7705271028282', 'qr_sena_95271028282', '41', '952710', 'INVE', 'N/A', '239923', 'ESCRITORIO', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA N.A. MATERIAL N.A.', '4', '95271028282', 'ESC-001', '11/05/2026', '$852.942,18'),
('ast-sena-10104118826', 'LCK-001', 'AST-10104118826', 'LOCKER', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE 4 PUESTOS MATERIAL METALICO', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #10', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700104118826', 'qr_sena_10104118826', '41', '101041', 'INVE', 'N/A', '284047', 'LOCKER', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE 4 PUESTOS MATERIAL METALICO', '4', '10104118826', 'LCK-001', '17/12/2021', '$973.109,00'),
('ast-sena-95271028029', 'TAB-001', 'AST-95271028029', 'TABLERO', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA BORRABLE MATERIAL ACRILICO', 'cat-comp', 'Laptops & Estaciones Moviles', 'service', 'Mesa de Servicio Tecnico', 'Estacion #11', 'mesa_servicio', 'En Mesa de Ayuda / Diagnostico', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7705271028029', 'qr_sena_95271028029', '41', '952710', 'INVE', 'N/A', '273247', 'TABLERO', 'TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA BORRABLE MATERIAL ACRILICO', '4', '95271028029', 'TAB-001', '15/04/2026', '$225.210,08'),
('ast-sena-95273317', 'MES-001', 'AST-95273317', 'MESA', 'TIPO ELEMENTO=ELEMENTO DEVOLUTIVO;USO=PARA TRABAJO;UNIDAD DE MEDIDA=UNIDAD;', 'cat-comp', 'Laptops & Estaciones Moviles', 'damaged', 'Almacen de Equipos con Dano / RAEE', 'Estacion #12', 'con_dano', 'Con Dano Fisico / Deposito', 'Tec. Marcos Pena', '2024-01-15', '2027-12-31', '7700095273317', 'qr_sena_95273317', '41', '952710', 'INVE', 'N/A', '000574', 'MESA', 'TIPO ELEMENTO=ELEMENTO DEVOLUTIVO;USO=PARA TRABAJO;UNIDAD DE MEDIDA=UNIDAD;', '4', '95273317', 'MES-001', '12/03/2009', '$1.473.200,00'),
('ast-sena-952720897', '170315-0621068', 'AST-952720897', 'UPS UPO22-RT AX 5400 WAL', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA PARA SERVIDORES VOLTAJE N.A.', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Estacion #13', 'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza', '2024-01-15', '2027-12-31', '7700952720897', 'qr_sena_952720897', '41', '952710', 'INVE', 'UPO22-RT AX 5400 WAL', '287866', 'UPS', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA PARA SERVIDORES VOLTAJE N.A.', '4', '952720897', '170315-0621068', '06/12/2017', '$7.500.000,00'),
('ast-sena-952720423', 'AS1B061028A0', 'AST-952720423', 'IMPRESORA B730', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA LASER MONOCROMATICA', 'cat-comp', 'Laptops & Estaciones Moviles', 'amb1', 'Ambiente 1: Lab Robotica e IA', 'Estacion #14', 'operativo', 'Operativo en Uso', 'Ing. Lucia Vargas Mendez', '2024-01-15', '2027-12-31', '7700952720423', 'qr_sena_952720423', '41', '952710', 'INVE', 'B730', '277680', 'IMPRESORA', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA LASER MONOCROMATICA', '4', '952720423', 'AS1B061028A0', '15/05/2013', '$2.900.000,00');
-- Insercion de Trazabilidad e Historial Inicial
INSERT INTO asset_history (id, asset_id, title, date_str, time_str, description, author, event_type) VALUES
('5b5bcb29-6087-4ab5-afeb-c36de34a2336', 'ast-sena-95271022764', 'Alta de Activo en Inventario SENA', '26/12/2018', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271022764.', 'Admin Inventarios', 'INVENTORY_IN'),
('851ed912-8553-43b3-b298-214f84fe8d1c', 'ast-sena-95271022765', 'Alta de Activo en Inventario SENA', '26/12/2018', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271022765.', 'Admin Inventarios', 'INVENTORY_IN'),
('35550e27-42b6-4b7c-b189-dcfcfe6e3bf1', 'ast-sena-95271025486', 'Alta de Activo en Inventario SENA', '28/12/2023', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271025486.', 'Admin Inventarios', 'INVENTORY_IN'),
('0e519821-925d-49ea-aa26-5a37e865232e', 'ast-sena-95271025485', 'Alta de Activo en Inventario SENA', '28/12/2023', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271025485.', 'Admin Inventarios', 'INVENTORY_IN'),
('0b0c9e8f-676c-4765-84ea-30ac894f57ea', 'ast-sena-95271025484', 'Alta de Activo en Inventario SENA', '28/12/2023', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271025484.', 'Admin Inventarios', 'INVENTORY_IN'),
('6b62d66c-e8bb-4c43-8663-331fc84d3bf4', 'ast-sena-95271024828', 'Alta de Activo en Inventario SENA', '20/04/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024828.', 'Admin Inventarios', 'INVENTORY_IN'),
('82e6430e-d484-4fe7-a5ca-9ff1397c3a35', 'ast-sena-95271024818', 'Alta de Activo en Inventario SENA', '20/04/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024818.', 'Admin Inventarios', 'INVENTORY_IN'),
('d28cc75d-ab82-48f7-9caf-4c00fc23ccab', 'ast-sena-95271024817', 'Alta de Activo en Inventario SENA', '20/04/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024817.', 'Admin Inventarios', 'INVENTORY_IN'),
('120c3fe8-535a-4a20-baf0-018cc5aab8c1', 'ast-sena-95271024816', 'Alta de Activo en Inventario SENA', '20/04/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024816.', 'Admin Inventarios', 'INVENTORY_IN'),
('7448e165-c732-4ddf-beb2-ce3bda311b34', 'ast-sena-95271024815', 'Alta de Activo en Inventario SENA', '20/04/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024815.', 'Admin Inventarios', 'INVENTORY_IN'),
('08d6b018-9b4d-47a7-be96-046910ec54fb', 'ast-sena-95271024814', 'Alta de Activo en Inventario SENA', '20/04/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024814.', 'Admin Inventarios', 'INVENTORY_IN'),
('46b1db4b-f685-4158-85dd-38e642da7247', 'ast-sena-101001130405', 'Alta de Activo en Inventario SENA', '13/05/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 101001130405.', 'Admin Inventarios', 'INVENTORY_IN'),
('9cc92cd5-c7d9-412d-8b64-41c20fbae1cb', 'ast-sena-95271024618', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024618.', 'Admin Inventarios', 'INVENTORY_IN'),
('810d4d9d-4a17-4c0b-b9c7-c9fb3c7569d2', 'ast-sena-95271024562', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024562.', 'Admin Inventarios', 'INVENTORY_IN'),
('ab288bb3-6534-4018-b955-51ab9f364ba8', 'ast-sena-95271024610', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024610.', 'Admin Inventarios', 'INVENTORY_IN'),
('81188ee0-36d2-4d9b-bc30-cc5f15548877', 'ast-sena-95271024606', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024606.', 'Admin Inventarios', 'INVENTORY_IN'),
('44a973d9-d7f5-4bbe-a876-dfde404c2d5a', 'ast-sena-95271024602', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024602.', 'Admin Inventarios', 'INVENTORY_IN'),
('a373efe7-0a27-4307-9d52-985967ea049f', 'ast-sena-95271024598', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024598.', 'Admin Inventarios', 'INVENTORY_IN'),
('2c234a59-11c9-47ee-876f-e1c6bde36633', 'ast-sena-95271024477', 'Alta de Activo en Inventario SENA', '18/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024477.', 'Admin Inventarios', 'INVENTORY_IN'),
('a50822f0-25e5-4768-9231-ff94cf29c561', 'ast-sena-95271024478', 'Alta de Activo en Inventario SENA', '18/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024478.', 'Admin Inventarios', 'INVENTORY_IN'),
('4b0cd9f3-5724-452e-a2aa-eac1c35f4ab2', 'ast-sena-95271024479', 'Alta de Activo en Inventario SENA', '18/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024479.', 'Admin Inventarios', 'INVENTORY_IN'),
('673d1646-9461-484c-8467-4673d630fd18', 'ast-sena-95271024483', 'Alta de Activo en Inventario SENA', '18/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024483.', 'Admin Inventarios', 'INVENTORY_IN'),
('e01c3c73-96f4-43b2-b760-958ee1d3d4a8', 'ast-sena-10104118894', 'Alta de Activo en Inventario SENA', '28/02/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118894.', 'Admin Inventarios', 'INVENTORY_IN'),
('0d41a755-9708-4e0c-9f2f-da46bec762b3', 'ast-sena-10104118895', 'Alta de Activo en Inventario SENA', '28/02/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118895.', 'Admin Inventarios', 'INVENTORY_IN'),
('c81afd5d-e195-4131-9b66-1ee324b61ef8', 'ast-sena-10104118896', 'Alta de Activo en Inventario SENA', '28/02/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118896.', 'Admin Inventarios', 'INVENTORY_IN'),
('87465053-b417-4378-8cd4-86cdf547f957', 'ast-sena-10104118897', 'Alta de Activo en Inventario SENA', '28/02/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118897.', 'Admin Inventarios', 'INVENTORY_IN'),
('69470519-999a-47d0-bdc9-52f4a105bede', 'ast-sena-10104118898', 'Alta de Activo en Inventario SENA', '28/02/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118898.', 'Admin Inventarios', 'INVENTORY_IN'),
('5b3e646c-4d8a-4b12-b864-93369693d02a', 'ast-sena-95271022889', 'Alta de Activo en Inventario SENA', '31/12/2018', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271022889.', 'Admin Inventarios', 'INVENTORY_IN'),
('48b0de03-ac9d-4964-a12d-c9221d11eeb3', 'ast-sena-95271022890', 'Alta de Activo en Inventario SENA', '31/12/2018', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271022890.', 'Admin Inventarios', 'INVENTORY_IN'),
('4496fd4c-b3ef-4f60-9a23-cf4f894037d9', 'ast-sena-95271022891', 'Alta de Activo en Inventario SENA', '31/12/2018', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271022891.', 'Admin Inventarios', 'INVENTORY_IN'),
('bccbc4a9-86ae-4e3d-a2d8-ba4261ec3a9e', 'ast-sena-95271024563', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024563.', 'Admin Inventarios', 'INVENTORY_IN'),
('226a41be-8afa-4e86-8855-52bfeec31893', 'ast-sena-95271024567', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024567.', 'Admin Inventarios', 'INVENTORY_IN'),
('b5e241b7-6378-43f9-ae1e-02caf6439208', 'ast-sena-95271024571', 'Alta de Activo en Inventario SENA', '30/11/2020', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271024571.', 'Admin Inventarios', 'INVENTORY_IN'),
('75b9742d-1950-41b5-9627-f47359000bc0', 'ast-sena-952715603', 'Alta de Activo en Inventario SENA', '27/12/2013', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952715603.', 'Admin Inventarios', 'INVENTORY_IN'),
('cbd0a56f-23e4-48de-9ada-c348cc0065e4', 'ast-sena-952721722', 'Alta de Activo en Inventario SENA', '23/12/2017', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952721722.', 'Admin Inventarios', 'INVENTORY_IN'),
('8d9112a7-201b-443b-8815-0f9ad45f8c84', 'ast-sena-1001102292', 'Alta de Activo en Inventario SENA', '28/12/2012', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 1001102292.', 'Admin Inventarios', 'INVENTORY_IN'),
('7abc5348-5870-405b-b180-64608162a677', 'ast-sena-952721694', 'Alta de Activo en Inventario SENA', '23/12/2017', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952721694.', 'Admin Inventarios', 'INVENTORY_IN'),
('bac9f20d-0f7d-471d-9a80-1bca9830c7df', 'ast-sena-952721695', 'Alta de Activo en Inventario SENA', '23/12/2017', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952721695.', 'Admin Inventarios', 'INVENTORY_IN'),
('125f8cf2-9bd3-48e9-8507-93ffe2747899', 'ast-sena-952721703', 'Alta de Activo en Inventario SENA', '23/12/2017', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952721703.', 'Admin Inventarios', 'INVENTORY_IN'),
('b4b57b22-22a3-4c0e-9c98-61a4c74eb65e', 'ast-sena-952720898', 'Alta de Activo en Inventario SENA', '06/12/2017', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952720898.', 'Admin Inventarios', 'INVENTORY_IN'),
('b5f1adf1-91f3-491b-b860-4595f33d2866', 'ast-sena-95276104', 'Alta de Activo en Inventario SENA', '09/09/2010', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95276104.', 'Admin Inventarios', 'INVENTORY_IN'),
('40f9251a-98b9-45c2-9e75-730af2119aec', 'ast-sena-95276105', 'Alta de Activo en Inventario SENA', '09/09/2010', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95276105.', 'Admin Inventarios', 'INVENTORY_IN'),
('19fd0251-2de7-49b6-9149-042c53110008', 'ast-sena-95276126', 'Alta de Activo en Inventario SENA', '09/09/2010', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95276126.', 'Admin Inventarios', 'INVENTORY_IN'),
('bfde135b-664f-462e-85a5-8b35794427fe', 'ast-sena-95276128', 'Alta de Activo en Inventario SENA', '09/09/2010', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95276128.', 'Admin Inventarios', 'INVENTORY_IN'),
('9cc544fa-f769-4909-b6c6-866732cda3ac', 'ast-sena-95271026663', 'Alta de Activo en Inventario SENA', '23/10/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271026663.', 'Admin Inventarios', 'INVENTORY_IN'),
('fb039475-7b53-41da-8c1d-0a5c48f20140', 'ast-sena-95271026665', 'Alta de Activo en Inventario SENA', '23/10/2025', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271026665.', 'Admin Inventarios', 'INVENTORY_IN'),
('16ee8a69-1479-4ff3-93a4-1169744a938c', 'ast-sena-95271028147', 'Alta de Activo en Inventario SENA', '15/04/2026', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271028147.', 'Admin Inventarios', 'INVENTORY_IN'),
('2961e54a-3816-4172-807f-3918f43b8efc', 'ast-sena-10104118696', 'Alta de Activo en Inventario SENA', '17/12/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118696.', 'Admin Inventarios', 'INVENTORY_IN'),
('86cc19a1-e9b4-4754-86aa-b26de308a4b7', 'ast-sena-95271028282', 'Alta de Activo en Inventario SENA', '11/05/2026', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271028282.', 'Admin Inventarios', 'INVENTORY_IN'),
('ad725d2b-fdd6-4f7e-8a22-3dea8f82989f', 'ast-sena-10104118826', 'Alta de Activo en Inventario SENA', '17/12/2021', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 10104118826.', 'Admin Inventarios', 'INVENTORY_IN'),
('614a664a-c657-4af6-a64a-4b5870ad048c', 'ast-sena-95271028029', 'Alta de Activo en Inventario SENA', '15/04/2026', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95271028029.', 'Admin Inventarios', 'INVENTORY_IN'),
('19aa5ec8-b9ae-47e4-8da8-b25bc3a882b5', 'ast-sena-95273317', 'Alta de Activo en Inventario SENA', '12/03/2009', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 95273317.', 'Admin Inventarios', 'INVENTORY_IN'),
('de9b758a-29a9-4947-84f8-5bc06e60dcee', 'ast-sena-952720897', 'Alta de Activo en Inventario SENA', '06/12/2017', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952720897.', 'Admin Inventarios', 'INVENTORY_IN'),
('d756f27f-c1e9-4b08-804a-f23b4a2528ca', 'ast-sena-952720423', 'Alta de Activo en Inventario SENA', '15/05/2013', '08:00 AM', 'Ingreso patrimonial por modulo INVE con placa de inventario 952720423.', 'Admin Inventarios', 'INVENTORY_IN');
-- Movimientos y Actas con Hash SHA-256
INSERT INTO inventory_movements (
    id, folio, type, product_name, asset_id, asset_code, serial_number,
    origin_environment_id, origin_environment_name, destination_environment_id, destination_environment_name,
    quantity, notes, user_id, user_name, user_role, user_email,
    timestamp_str, crypto_hash, qr_verification_token, status
) VALUES
(
    'mov-001', 'MOV-SENA-2026-001', 'TRANSFER',
    'COMPUTADOR PORTATIL PROBOOK 445R G6', 'ast-sena-95271024071', 'AST-95271024071', '5CD0037S7T',
    'amb1', 'Ambiente 1: Lab Robotica e IA', 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO',
    1, 'Reasignacion para practicas de desarrollo ADSO - Ficha 2670142', 'usr-admin', 'Carlos Mendoza', 'Administrador (Admin)', 'carlos.mendoza@edustock.edu',
    '2026-10-20 09:15:30', 'a89c2049e7b1a238fb012f4590c88b7123984eaf89104b2a8d11c01e765ba391', 'qr_verif_mov_001', 'COMPLETADO'
),
(
    'mov-002', 'MOV-SENA-2026-002', 'TRANSFER',
    'CPU PRECISION 3440', 'ast-sena-95271024606', 'AST-95271024606', '6LJYH63',
    'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'service', 'Mesa de Servicio Tecnico',
    1, 'Remision por fallo intermitente en fuente de poder ATX', 'usr-tecnico', 'Tec. Marcos Pena', 'Tecnico Soporte', 'marcos.pena@edustock.edu',
    '2026-10-21 11:30:00', '7b689a91ce346dc28023e936c34b8c9d19a28e938f3818e87498c392476b7123', 'qr_verif_mov_002', 'COMPLETADO'
);

-- Tickets de Mesa de Servicio Tecnico
INSERT INTO service_desk_tickets (
    id, ticket_number, folio, title, asset_id, asset_name, asset_code, serial_number,
    priority, priority_label, status, status_label, sla_hours_left, total_sla_hours,
    origin_environment_id, origin_environment, environment_name, current_custody_location,
    received_by, reporter_name, reporter_date, declared_symptom, diagnostic_notes,
    repair_cost_estimate, technician_name, created_at
) VALUES
(
    'tk-sena-24606', 'TK-9527-24606', 'TKT-SENA-2026-018',
    'Ticket #TKT-SENA-2026-018 • Dell Precision 3440 / Falla de Encendido',
    'ast-sena-95271024606', 'CPU Dell Precision 3440 Workstation Core i7', 'AST-95271024606', '6LJYH63',
    'critica', 'Critica (P1)', 'taller_diagnostico', 'En Taller / Diagnostico',
    28, 48, 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Puesto Servidor #01',
    'Mesa de Servicio Tecnico — Banco #02', 'Ing. Roberto Gomez', 'Prof. Carlos Mendoza',
    '2026-10-20 08:30:00', 'El equipo no energiza. El LED frontal parpadea en codigo ambar 2-3.',
    'Se revisaron voltajes de riel +12V y +5VSB. La fuente de poder presenta capacitores desvalorizados.',
    '$120.000 COP', 'Tec. Marcos Pena', NOW()
),
(
    'tk-sena-24477', 'TK-9527-24477', 'TKT-SENA-2026-019',
    'Ticket #TKT-SENA-2026-019 • Dell OptiPlex 7470 AIO / Lineas en Pantalla',
    'ast-sena-95271024477', 'Dell OptiPlex 7470 AIO 23.8"', 'AST-95271024477', '34ZM853',
    'media', 'Media (P3)', 'en_reparacion', 'En Reparacion Activa',
    36, 72, 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Puesto Instructor',
    'Mesa de Servicio Tecnico — Banco #01', 'Tec. Marcos Pena', 'Prof. Carlos Mendoza',
    '2026-10-19 14:00:00', 'Aparicion de lineas horizontales intermitentes en la pantalla LCD.',
    'Cable flex eDP flojo en la placa base; requiere reemplazo de adhesivo termico y prueba de estres.',
    '$45.000 COP', 'Tec. Marcos Pena', NOW()
);

-- Pasos del Timeline del Ticket
INSERT INTO ticket_timeline_steps (id, ticket_id, step_number, title, time_label, assigned_to, status, note) VALUES
('step-1', 'tk-sena-24606', 1, 'Recepcion y Asignacion de Caso', '20/10/2026 08:35', 'Mesa Central', 'completed', 'Ingreso a banco de trabajo.'),
('step-2', 'tk-sena-24606', 2, 'Diagnostico Electronico de Fuente', '20/10/2026 11:20', 'Tec. Marcos Pena', 'current', 'Verificacion con multimetro y osciloscopio.'),
('step-3', 'tk-sena-24606', 3, 'Sustitucion de Componentes', 'Pendiente', 'Tec. Marcos Pena', 'pending', 'En espera de repuesto institucional.');

-- Notas Tecnicas
INSERT INTO ticket_notes (id, ticket_id, author, author_initials, content, time_ago) VALUES
('note-1', 'tk-sena-24606', 'Tec. Marcos Pena', 'MP', 'Se solicito la orden de repuesto de fuente de poder para Dell Precision al almacen central.', 'Hace 2 horas'),
('note-2', 'tk-sena-24606', 'Ing. Roberto Gomez', 'RG', 'Prioridad alta por ser equipo de pruebas para proyecto formativo ADSO.', 'Hace 4 horas');

-- Sesion de Auditoria Fisica In Situ
INSERT INTO audit_sessions (
    id, is_active, environment_id, environment_name, building,
    total_items, verified_count, pending_count, mismatch_count,
    started_at, auditor_name
) VALUES
(
    'audit-sena-001', 1, 'amb2', 'Ambiente 2: Aula Computo & Redes ADSO', 'Edificio Ingenierias - Aula 302',
    20, 18, 1, 1, '2026-10-21 08:00 AM', 'Dra. Carmen Morales'
);

-- Lista de Cotejo de Auditoria
INSERT INTO audit_items (id, session_id, asset_id, serial_number, asset_code, name, station, sheet_number, category, status, verified_at, verified_by, discrepancy_note) VALUES
('item-1', 'audit-sena-001', 'ast-sena-95271024618', '6LJB673', 'AST-95271024618', 'CPU Dell Precision 3440', 'Estacion #01', 'HOJA-01', 'Computadores', 'verified', '08:15 AM', 'Dra. Carmen Morales', NULL),
('item-2', 'audit-sena-001', 'ast-sena-95271024562', '6LJ9673', 'AST-95271024562', 'CPU Dell Precision 3440', 'Estacion #02', 'HOJA-01', 'Computadores', 'verified', '08:20 AM', 'Dra. Carmen Morales', NULL),
('item-3', 'audit-sena-001', 'ast-sena-95271024606', '6LJYH63', 'AST-95271024606', 'CPU Dell Precision 3440', 'Estacion #03', 'HOJA-01', 'Computadores', 'mismatch', '08:45 AM', 'Dra. Carmen Morales', 'Equipo ausente fisicamente; se encuentra en Mesa de Servicio segun acta MOV-SENA-2026-002.');
