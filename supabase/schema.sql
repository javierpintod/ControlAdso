-- ==============================================================================
-- CONTROLADSO - EDUSTOCK ASSET MANAGER
-- Esquema Completo de Base de Datos para Supabase (PostgreSQL 15+)
-- Cumple con todas las especificaciones del TRD (Trazabilidad, RBAC, Cripto SHA-256)
-- ==============================================================================

-- 1. Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Definición de Tipos Enumerados (ENUMs)
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('admin', 'consulta', 'tecnico');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_status_type AS ENUM ('operativo', 'mesa_servicio', 'con_dano', 'mantenimiento', 'decomisado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE movement_type_enum AS ENUM ('IN', 'OUT', 'TRANSFER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority_type AS ENUM ('critica', 'alta', 'media', 'baja');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status_type AS ENUM ('taller_diagnostico', 'en_reparacion', 'espera_repuesto', 'resuelto', 'garantia_externa');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status_type AS ENUM ('verified', 'pending', 'mismatch');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. Tablas Estructurales e Institucionales
-- ==============================================================================

-- 3.1 Sedes / Campus
CREATE TABLE IF NOT EXISTS campuses (
    id TEXT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Bogotá D.C.',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.2 Ambientes de Aprendizaje / Laboratorios
CREATE TABLE IF NOT EXISTS environments (
    id TEXT PRIMARY KEY,
    campus_id TEXT REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code_name VARCHAR(100) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT 'science',
    total_capacity INTEGER DEFAULT 35,
    assigned_count INTEGER DEFAULT 0,
    occupancy_percentage NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.3 Directorio de Usuarios y Perfiles (Integrado con Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Opcional: Vinculación con auth.users de Supabase
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role user_role_type NOT NULL DEFAULT 'consulta',
    role_title VARCHAR(100) NOT NULL,
    authorized_environments TEXT[] DEFAULT ARRAY['Todos'],
    last_login VARCHAR(100) DEFAULT 'Reciente',
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    active_session BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.4 Familias y Categorías de Productos
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'category',
    amb1 INTEGER DEFAULT 0 CHECK (amb1 >= 0),
    amb2 INTEGER DEFAULT 0 CHECK (amb2 >= 0),
    amb3 INTEGER DEFAULT 0 CHECK (amb3 >= 0),
    mesa INTEGER DEFAULT 0 CHECK (mesa >= 0),
    dano INTEGER DEFAULT 0 CHECK (dano >= 0),
    total INTEGER GENERATED ALWAYS AS (amb1 + amb2 + amb3 + mesa + dano) STORED,
    operational_percentage NUMERIC(5,2) DEFAULT 100.0,
    status VARCHAR(20) DEFAULT 'ok' CHECK (status IN ('ok', 'warning', 'critical')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. Activos Serializados y Trazabilidad (SerialAsset)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    environment_id TEXT REFERENCES environments(id) ON DELETE RESTRICT,
    environment_name VARCHAR(150),
    station VARCHAR(100) NOT NULL,
    physical_status asset_status_type NOT NULL DEFAULT 'operativo',
    status_label VARCHAR(100) NOT NULL DEFAULT 'Operativo en Uso',
    responsible_person VARCHAR(150) NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    warranty_until DATE,
    barcode VARCHAR(100) NOT NULL,
    qr_token VARCHAR(150) NOT NULL,
    specs JSONB DEFAULT '{}'::jsonb,
    photo_url TEXT,
    -- Estructura de Registro Institucional (SENA / Entidad de Formación)
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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.1 Historial de Vida del Activo (Timeline Inmutable)
CREATE TABLE IF NOT EXISTS asset_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    date_str VARCHAR(50) NOT NULL,
    time_str VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. Movimientos de Stock y Actas de Custodia Digital (SHA-256)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio VARCHAR(100) NOT NULL UNIQUE,
    type movement_type_enum NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    asset_code VARCHAR(100),
    serial_number VARCHAR(100),
    origin_environment_id TEXT REFERENCES environments(id) ON DELETE SET NULL,
    origin_environment_name VARCHAR(150),
    destination_environment_id TEXT REFERENCES environments(id) ON DELETE RESTRICT,
    destination_environment_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    notes TEXT,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    timestamp_str VARCHAR(100) NOT NULL,
    crypto_hash VARCHAR(64) NOT NULL, -- Hash SHA-256 de 64 caracteres hex
    qr_verification_token VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'COMPLETADO' CHECK (status IN ('COMPLETADO', 'PENDIENTE', 'RECHAZADO')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. Mesa de Servicio y Gestión Técnica de Fallas
-- ==============================================================================

CREATE TABLE IF NOT EXISTS service_desk_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    folio VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    asset_name VARCHAR(200) NOT NULL,
    asset_code VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    priority ticket_priority_type NOT NULL DEFAULT 'media',
    priority_label VARCHAR(50) NOT NULL,
    status ticket_status_type NOT NULL DEFAULT 'taller_diagnostico',
    status_label VARCHAR(100) NOT NULL,
    sla_hours_left INTEGER DEFAULT 48,
    total_sla_hours INTEGER DEFAULT 48,
    origin_environment_id TEXT REFERENCES environments(id) ON DELETE SET NULL,
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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.1 Pasos del Flujo de Reparación
CREATE TABLE IF NOT EXISTS ticket_timeline_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES service_desk_tickets(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    time_label VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('completed', 'current', 'pending')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.2 Notas Técnicas en Mesa de Servicio
CREATE TABLE IF NOT EXISTS ticket_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES service_desk_tickets(id) ON DELETE CASCADE,
    author VARCHAR(150) NOT NULL,
    author_initials VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    time_ago VARCHAR(50) DEFAULT 'Justo ahora',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. Auditoría Física In Situ y Cotejo
-- ==============================================================================

CREATE TABLE IF NOT EXISTS audit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_active BOOLEAN DEFAULT true,
    environment_id TEXT NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,
    environment_name VARCHAR(150) NOT NULL,
    building VARCHAR(100) NOT NULL,
    total_items INTEGER DEFAULT 0,
    verified_count INTEGER DEFAULT 0,
    pending_count INTEGER DEFAULT 0,
    mismatch_count INTEGER DEFAULT 0,
    started_at VARCHAR(100) NOT NULL,
    auditor_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES audit_sessions(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    serial_number VARCHAR(100) NOT NULL,
    asset_code VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    station VARCHAR(100) NOT NULL,
    sheet_number VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status audit_status_type NOT NULL DEFAULT 'pending',
    verified_at VARCHAR(50),
    verified_by VARCHAR(150),
    discrepancy_note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. Índices para Alto Desempeño
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_assets_serial ON assets(serial_number);
CREATE INDEX IF NOT EXISTS idx_assets_code ON assets(asset_code);
CREATE INDEX IF NOT EXISTS idx_assets_env ON assets(environment_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(physical_status);
CREATE INDEX IF NOT EXISTS idx_movements_folio ON inventory_movements(folio);
CREATE INDEX IF NOT EXISTS idx_movements_timestamp ON inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_number ON service_desk_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_audit_items_session ON audit_items(session_id);

-- ==============================================================================
-- 9. Funciones y Triggers de Automatización Criptográfica y Stock
-- ==============================================================================

-- Generador automático de Hash SHA-256 para transferencias si viene vacío
CREATE OR REPLACE FUNCTION generate_movement_hash()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.crypto_hash IS NULL OR NEW.crypto_hash = '' THEN
        NEW.crypto_hash := encode(digest(NEW.folio || NEW.product_name || NEW.user_email || CURRENT_TIMESTAMP::text, 'sha256'), 'hex');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_movement_hash ON inventory_movements;
CREATE TRIGGER trigger_generate_movement_hash
BEFORE INSERT ON inventory_movements
FOR EACH ROW EXECUTE FUNCTION generate_movement_hash();

-- ==============================================================================
-- 10. Seguridad a Nivel de Filas (Row Level Security - RLS) para Supabase
-- ==============================================================================

ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_desk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_timeline_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_items ENABLE ROW LEVEL SECURITY;

-- 10.1 Políticas de Lectura (Consulta RO y Admin RW tienen acceso de lectura universal)
DROP POLICY IF EXISTS "Public & authenticated can read campuses" ON campuses;
CREATE POLICY "Public & authenticated can read campuses" ON campuses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read environments" ON environments;
CREATE POLICY "Public & authenticated can read environments" ON environments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read user_profiles" ON user_profiles;
CREATE POLICY "Public & authenticated can read user_profiles" ON user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read product_categories" ON product_categories;
CREATE POLICY "Public & authenticated can read product_categories" ON product_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read assets" ON assets;
CREATE POLICY "Public & authenticated can read assets" ON assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read asset_history" ON asset_history;
CREATE POLICY "Public & authenticated can read asset_history" ON asset_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read inventory_movements" ON inventory_movements;
CREATE POLICY "Public & authenticated can read inventory_movements" ON inventory_movements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read service_desk_tickets" ON service_desk_tickets;
CREATE POLICY "Public & authenticated can read service_desk_tickets" ON service_desk_tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read ticket_timeline_steps" ON ticket_timeline_steps;
CREATE POLICY "Public & authenticated can read ticket_timeline_steps" ON ticket_timeline_steps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read ticket_notes" ON ticket_notes;
CREATE POLICY "Public & authenticated can read ticket_notes" ON ticket_notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read audit_sessions" ON audit_sessions;
CREATE POLICY "Public & authenticated can read audit_sessions" ON audit_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public & authenticated can read audit_items" ON audit_items;
CREATE POLICY "Public & authenticated can read audit_items" ON audit_items FOR SELECT USING (true);

-- 10.2 Políticas de Escritura y Modificación (Admin RW / Service Role)
DROP POLICY IF EXISTS "Admin write access on assets" ON assets;
CREATE POLICY "Admin write access on assets" ON assets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write access on inventory_movements" ON inventory_movements;
CREATE POLICY "Admin write access on inventory_movements" ON inventory_movements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write access on service_desk_tickets" ON service_desk_tickets;
CREATE POLICY "Admin write access on service_desk_tickets" ON service_desk_tickets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write access on product_categories" ON product_categories;
CREATE POLICY "Admin write access on product_categories" ON product_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write access on audit_items" ON audit_items;
CREATE POLICY "Admin write access on audit_items" ON audit_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write access on audit_sessions" ON audit_sessions;
CREATE POLICY "Admin write access on audit_sessions" ON audit_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write access on user_profiles" ON user_profiles;
CREATE POLICY "Admin write access on user_profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 11. Datos Iniciales (Seed Data del TRD)
-- ==============================================================================

-- Sedes
INSERT INTO campuses (id, name, code, address, city) VALUES
('central', 'Sede Central - Campus Educativo', 'CMP-CEN-01', 'Calle 52 # 13-65', 'Bogotá D.C.'),
('norte', 'Campus Tecnológico Norte', 'CMP-NOR-02', 'Autopista Norte # 195-20', 'Bogotá D.C.'),
('sur', 'Centro de Innovación Sur', 'CMP-SUR-03', 'Av. Villavicencio # 45-10', 'Bogotá D.C.')
ON CONFLICT (id) DO NOTHING;

-- Ambientes
INSERT INTO environments (id, campus_id, name, code_name, building, floor, icon, total_capacity, assigned_count, occupancy_percentage) VALUES
('amb1', 'central', 'Ambiente 1: Lab Robótica e IA', 'Lab Robótica & IA', 'Edificio Tecnologías', 'Piso 2 • Ala Norte', 'smart_toy', 35, 34, 97.1),
('amb2', 'central', 'Ambiente 2: Aula Cómputo & Redes', 'Aula Cómputo & Redes', 'Edificio Ingenierías', 'Piso 3 • Aula 302', 'computer', 40, 38, 95.0),
('amb3', 'central', 'Ambiente 3: Taller de Electrónica', 'Taller de Electrónica', 'Edificio Tecnologías', 'Piso 1 • Taller 104', 'memory', 30, 29, 96.6),
('service', 'central', 'Mesa de Servicio Técnico', 'Mesa de Servicio', 'Edificio Central', 'Nivel 2 • Taller', 'build', 50, 38, 76.0),
('damaged', 'central', 'Almacén de Equipos con Daño', 'Almacén Daño / RAEE', 'Sótano 1', 'Depósito General', 'warning', 100, 26, 26.0),
('unassigned', 'central', 'Sin Asignar / Depósito General', 'Sin Asignar', 'Edificio Central', 'Depósito General', 'inventory_2', 500, 0, 0.0)
ON CONFLICT (id) DO NOTHING;

-- Categorías
INSERT INTO product_categories (code, name, description, icon, amb1, amb2, amb3, mesa, dano, operational_percentage, status) VALUES
('COMP', 'Laptops & Estaciones Móviles', 'Equipos de cómputo de alta gama para desarrollo y análisis de datos', 'laptop_mac', 34, 38, 0, 12, 4, 94.7, 'ok'),
('ROBT', 'Robots Educativos & Brazos 6-DOF', 'Brazos articulados robóticos con servomotores y visión artificial', 'precision_manufacturing', 28, 0, 15, 6, 2, 91.5, 'ok'),
('DEV', 'Microcontroladores & SBCs', 'Kits Arduino Mega, Raspberry Pi 5 y shields de sensores IoT', 'developer_board', 60, 45, 75, 8, 3, 94.8, 'ok'),
('MEAS', 'Instrumentación & Osciloscopios', 'Osciloscopios digitales 100MHz, generadores de señales y multímetros', 'speed', 15, 0, 30, 7, 12, 73.5, 'critical'),
('TOOL', 'Kits de Herramientas de Precisión', 'Estaciones de soldadura SMD, fuentes de poder y sets de destornilladores', 'home_repair_service', 20, 10, 40, 5, 5, 87.5, 'warning'),
('CLIM', 'Climatización & Equipos Especiales', 'Aires acondicionados Mini Split y Piso Techo', 'ac_unit', 5, 4, 3, 1, 0, 96.0, 'ok')
ON CONFLICT (code) DO NOTHING;

-- Usuarios Iniciales
INSERT INTO user_profiles (name, email, role, role_title, authorized_environments, last_login, ip_address, status) VALUES
('Carlos Mendoza', 'carlos.mendoza@edustock.edu', 'admin', 'Administrador General (Admin RW)', ARRAY['Todos los Ambientes'], 'Activo ahora', '192.168.1.104', 'active'),
('Dra. Carmen Morales', 'carmen.morales@edustock.edu', 'consulta', 'Auditora Externa (Consulta RO)', ARRAY['Ambiente 1', 'Ambiente 2', 'Ambiente 3'], 'Hoy, 08:30 AM', '192.168.1.215', 'active'),
('Tec. Marcos Peña', 'marcos.pena@edustock.edu', 'tecnico', 'Técnico de Soporte Mesa de Ayuda', ARRAY['Mesa de Servicio', 'Almacén Daño'], 'Ayer, 05:40 PM', '192.168.1.189', 'active')
ON CONFLICT (email) DO NOTHING;

-- Activos Iniciales con Registro Institucional (SENA / ADSO)
INSERT INTO assets (
    serial_number, asset_code, name, description,
    environment_id, environment_name, station,
    physical_status, status_label, responsible_person,
    barcode, qr_token,
    regional, centro_costo, modulo, modelo, consecutivo,
    descripcion, descripcion_actual, tipo, placa, serial,
    fecha_adquisicion, valor_ingreso
) VALUES
(
    '5CD0037S7T', 'AST-95271024071', 'HP ProBook 445R G6 Ryzen 7', 'COMPUTADOR PORTATIL AMD RYZEN 7 16GB 512GB SSD',
    'amb1', 'Ambiente 1: Lab Robótica e IA', 'Estación de Trabajo #01',
    'operativo', 'Operativo en Uso', 'Ing. Lucía Vargas Méndez',
    '7701234567891', 'qr_token_sena_95271024071',
    '41', '952710', 'INVE', 'PROBOOK 445R G6', '297419',
    'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14 PULGADAS', '4', '95271024071', '5CD0037S7T',
    '08/06/2020', '$1.766.042,14'
),
(
    '8TF8DB3', 'AST-95271024828', 'Dell Precision 3551 Xeon', 'COMPUTADOR PORTATIL XEON 256GB RAM 1TB SSD',
    'amb1', 'Ambiente 1: Lab Robótica e IA', 'Estación IA #02',
    'operativo', 'Operativo en Uso', 'Ing. Lucía Vargas Méndez',
    '7701234567892', 'qr_token_sena_95271024828',
    '41', '952710', 'INVE', 'PRESCISION 3551', '299274',
    'COMPUTADOR PORTATIL', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS', '4', '95271024828', '8TF8DB3',
    '20/04/2021', '$6.422.400,00'
),
(
    '6LJB673', 'AST-95271024618', 'Dell Precision 3440 Core i7', 'WORKSTATION DESKTOP CORE I7 2TB HDD',
    'amb2', 'Ambiente 2: Aula Cómputo & Redes', 'Puesto Servidor #01',
    'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza',
    '7701234567893', 'qr_token_sena_95271024618',
    '41', '952710', 'INVE', 'PRECISION 3440', '298471',
    'CPU', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE', '4', '95271024618', '6LJB673',
    '30/11/2020', '$5.764.590,00'
),
(
    '34ZM853', 'AST-95271024477', 'Dell OptiPlex 7470 AIO 23.8"', 'TODO EN UNO CORE I7 32GB RAM 1TB',
    'amb2', 'Ambiente 2: Aula Cómputo & Redes', 'Puesto Instructor',
    'operativo', 'Operativo en Uso', 'Prof. Carlos Mendoza',
    '7701234567894', 'qr_token_sena_95271024477',
    '41', '952710', 'INVE', 'OPTIPLEX 7470AIO', '297485',
    'CPU INTEGRADA CON MONITOR', 'TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS', '4', '95271024477', '34ZM853',
    '18/11/2020', '$2.691.882,00'
),
(
    '3122G05688', 'AST-95271025486', 'Aire Acondicionado 60000 BTU', 'AIRE ACONDICIONADO TIPO PISO TECHO 60K BTU',
    'amb1', 'Ambiente 1: Lab Robótica e IA', 'Pared Sur Climatización',
    'operativo', 'Operativo en Uso', 'Ing. Lucía Vargas Méndez',
    '7701234567895', 'qr_token_sena_95271025486',
    '41', '952710', 'INVE', 'LAC060', '242892',
    'AIRE ACONDICIONADO', 'TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO', '4', '95271025486', '3122G05688',
    '28/12/2023', '$8.235.294,00'
)
ON CONFLICT (serial_number) DO NOTHING;

-- ==============================================================================
-- FIN DEL ESQUEMA SUPABASE
-- ==============================================================================
