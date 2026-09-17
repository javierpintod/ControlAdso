import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPABASE_SQL_SCHEMA } from '../../data/supabaseSchema';
import { 
  activeSupabaseUrl, 
  activeSupabaseKey, 
  updateSupabaseCredentials, 
  getSupabaseClient 
} from '../../lib/supabase';

interface DatabaseViewProps {
  onNavigate: (view: string) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ onNavigate }) => {
  const { showToast, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState<'tables' | 'schema' | 'connection' | 'erd'>('tables');
  const [copied, setCopied] = useState(false);

  // Connection settings state
  const [supabaseUrl, setSupabaseUrl] = useState(activeSupabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(activeSupabaseKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('assets');

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('¡Script SQL de Supabase copiado al portapapeles!', 'success', 'content_copy');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'controladso_supabase_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Descargando archivo controladso_supabase_schema.sql', 'info', 'download');
  };

  const handleSaveAndTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      showToast('Por favor ingrese la URL y la Anon Key de su proyecto Supabase', 'warning');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Estableciendo handshake con la base de datos en Supabase...');

    const result = updateSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    if (!result.success || !result.client) {
      setTestStatus('error');
      setTestMessage(result.error || 'Error al inicializar el cliente de Supabase.');
      showToast('Error de configuración en Supabase', 'error');
      return;
    }

    try {
      // Test querying a public table or checking health
      const { data, error } = await result.client
        .from('campuses')
        .select('id, name')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist yet, but connection succeeded!
          setTestStatus('success');
          setTestMessage('¡Conexión establecida con éxito a Supabase! (Aviso: Las tablas aún no han sido creadas. Ejecuta el script SQL en el SQL Editor de Supabase).');
          showToast('Conectado a Supabase. Requiere ejecutar el SQL en Supabase.', 'info');
        } else {
          setTestStatus('error');
          setTestMessage(`Error de Supabase: ${error.message} (Código: ${error.code})`);
          showToast(`Error al consultar Supabase: ${error.message}`, 'error');
        }
      } else {
        setTestStatus('success');
        setTestMessage(`¡Conexión exitosa y verificada! Tablas activas y operativas en Supabase.`);
        showToast('¡Conectado y sincronizado con Supabase Cloud!', 'success', 'verified');
      }
    } catch (err: unknown) {
      setTestStatus('error');
      const msg = err instanceof Error ? err.message : 'Error de red';
      setTestMessage(`Fallo en la petición HTTP a Supabase: ${msg}`);
      showToast('Error de red al contactar Supabase', 'error');
    }
  };

  const tablesData = [
    {
      name: 'assets',
      label: 'Activos Serializados',
      icon: 'devices',
      description: 'Inventario de activos institucionales con los 12 campos oficiales SENA, placa, serial único, asignación a ambientes y estado físico.',
      columns: [
        { name: 'id', type: 'UUID', pk: true, nullable: false, desc: 'Identificador único del activo' },
        { name: 'regional', type: 'VARCHAR(50)', nullable: true, desc: 'Regional institucional (ej. 41)' },
        { name: 'centro_costo', type: 'VARCHAR(50)', nullable: true, desc: 'Centro de costo institucional (ej. 952710)' },
        { name: 'modulo', type: 'VARCHAR(50)', nullable: true, desc: 'Módulo de inventario (ej. INVE)' },
        { name: 'modelo', type: 'VARCHAR(150)', nullable: true, desc: 'Modelo del bien o equipo' },
        { name: 'consecutivo', type: 'VARCHAR(50)', nullable: true, desc: 'Consecutivo patrimonial único' },
        { name: 'descripcion', type: 'TEXT', nullable: false, desc: 'Descripción del catálogo inicial' },
        { name: 'descripcion_actual', type: 'TEXT', nullable: true, desc: 'Descripción detallada actual' },
        { name: 'tipo', type: 'VARCHAR(50)', nullable: true, desc: 'Tipo de elemento (ej. Devolutivo)' },
        { name: 'placa', type: 'VARCHAR(100)', unique: true, nullable: true, desc: 'Placa oficial institucional del activo' },
        { name: 'serial', type: 'VARCHAR(100)', nullable: true, desc: 'Número de serial de fábrica del activo' },
        { name: 'fecha_adquisicion', type: 'DATE', nullable: true, desc: 'Fecha de ingreso / adquisición' },
        { name: 'valor_ingreso', type: 'VARCHAR(100)', nullable: true, desc: 'Valor patrimonial de adquisición' },
        { name: 'environment_id', type: 'TEXT', fk: 'environments.id', nullable: false, desc: 'Ambiente físico asignado (amb1, amb2, amb3, service, damaged)' },
        { name: 'station', type: 'VARCHAR(100)', nullable: false, desc: 'Puesto de trabajo específico dentro del ambiente' },
        { name: 'physical_status', type: 'asset_status_type', nullable: false, desc: 'operativo | mesa_servicio | con_dano' },
        { name: 'responsible_person', type: 'VARCHAR(150)', nullable: false, desc: 'Custodio o docente titular asignado' },
        { name: 'barcode', type: 'VARCHAR(100)', nullable: false, desc: 'Código de barras GS1-128' },
        { name: 'qr_token', type: 'VARCHAR(150)', nullable: false, desc: 'Token QR de verificación rápida' }
      ]
    },
    {
      name: 'inventory_movements',
      label: 'Movimientos & Actas de Custodia',
      icon: 'sync_alt',
      description: 'Bitácora inmutable de traslados con firma criptográfica SHA-256 generada por trigger.',
      columns: [
        { name: 'id', type: 'UUID', pk: true, nullable: false, desc: 'Identificador del registro' },
        { name: 'folio', type: 'VARCHAR(100)', unique: true, nullable: false, desc: 'Folio oficial (#ACT-TRF-2025-XXXX)' },
        { name: 'type', type: 'movement_type_enum', nullable: false, desc: 'IN | OUT | TRANSFER' },
        { name: 'product_name', type: 'VARCHAR(200)', nullable: false, desc: 'Nombre del lote o activo' },
        { name: 'origin_environment_id', type: 'TEXT', fk: 'environments.id', nullable: true, desc: 'Ambiente de origen' },
        { name: 'destination_environment_id', type: 'TEXT', fk: 'environments.id', nullable: false, desc: 'Ambiente de destino' },
        { name: 'quantity', type: 'INTEGER', nullable: false, desc: 'Cantidad de unidades transferidas' },
        { name: 'user_name', type: 'VARCHAR(150)', nullable: false, desc: 'Usuario responsable que firma' },
        { name: 'crypto_hash', type: 'VARCHAR(64)', nullable: false, desc: 'Hash SHA-256 inmutable de 64 caracteres' },
        { name: 'qr_verification_token', type: 'VARCHAR(100)', nullable: false, desc: 'Token QR de verificación' },
        { name: 'status', type: 'VARCHAR(30)', nullable: false, desc: 'COMPLETADO | PENDIENTE | RECHAZADO' }
      ]
    },
    {
      name: 'service_desk_tickets',
      label: 'Mesa de Servicio Técnico',
      icon: 'build',
      description: 'Gestión de fallas y averías con control de SLA, diagnóstico y dictamen técnico.',
      columns: [
        { name: 'id', type: 'UUID', pk: true, nullable: false, desc: 'ID único del ticket' },
        { name: 'ticket_number', type: 'VARCHAR(50)', unique: true, nullable: false, desc: 'Folio del ticket (#TK-4091)' },
        { name: 'asset_id', type: 'UUID', fk: 'assets.id', nullable: true, desc: 'Activo reportado con daño' },
        { name: 'priority', type: 'ticket_priority_type', nullable: false, desc: 'critica | alta | media | baja' },
        { name: 'status', type: 'ticket_status_type', nullable: false, desc: 'taller_diagnostico | en_reparacion | resuelto' },
        { name: 'sla_hours_left', type: 'INTEGER', nullable: false, desc: 'Horas restantes para vencer SLA' },
        { name: 'declared_symptom', type: 'TEXT', nullable: false, desc: 'Descripción del fallo emitida por docente' },
        { name: 'evidence_photo_url', type: 'TEXT', nullable: true, desc: 'Fotografía de la avería' },
        { name: 'evidence_photo_gps', type: 'VARCHAR(200)', nullable: true, desc: 'Coordenadas GPS de la toma' }
      ]
    },
    {
      name: 'product_categories',
      label: 'Familias de Productos',
      icon: 'category',
      description: 'Catálogo de categorías con distribución de existencias físicas por ambiente y total computado.',
      columns: [
        { name: 'id', type: 'UUID', pk: true, nullable: false, desc: 'ID de la familia' },
        { name: 'code', type: 'VARCHAR(50)', unique: true, nullable: false, desc: 'Código abreviado (COMP, ROBT, etc.)' },
        { name: 'name', type: 'VARCHAR(150)', nullable: false, desc: 'Nombre descriptivo de la categoría' },
        { name: 'amb1', type: 'INTEGER', nullable: false, desc: 'Stock en Ambiente 1' },
        { name: 'amb2', type: 'INTEGER', nullable: false, desc: 'Stock en Ambiente 2' },
        { name: 'amb3', type: 'INTEGER', nullable: false, desc: 'Stock en Ambiente 3' },
        { name: 'mesa', type: 'INTEGER', nullable: false, desc: 'Stock en Mesa de Servicio' },
        { name: 'dano', type: 'INTEGER', nullable: false, desc: 'Stock en Almacén de Daño / RAEE' },
        { name: 'total', type: 'INTEGER', nullable: false, desc: 'Generado automáticamente (STORED)' },
        { name: 'operational_percentage', type: 'NUMERIC(5,2)', nullable: false, desc: 'Porcentaje operativo calculado' }
      ]
    },
    {
      name: 'environments',
      label: 'Ambientes de Aprendizaje',
      icon: 'domain',
      description: 'Laboratorios y talleres físicos con capacidad máxima y porcentaje de ocupación.',
      columns: [
        { name: 'id', type: 'TEXT', pk: true, nullable: false, desc: 'Identificador clave (amb1, amb2, amb3, service, damaged)' },
        { name: 'campus_id', type: 'TEXT', fk: 'campuses.id', nullable: false, desc: 'Sede a la que pertenece' },
        { name: 'name', type: 'VARCHAR(150)', nullable: false, desc: 'Nombre formal del ambiente' },
        { name: 'code_name', type: 'VARCHAR(100)', nullable: false, desc: 'Nombre corto' },
        { name: 'building', type: 'VARCHAR(100)', nullable: false, desc: 'Edificio o bloque' },
        { name: 'floor', type: 'VARCHAR(50)', nullable: false, desc: 'Piso o nivel' },
        { name: 'total_capacity', type: 'INTEGER', nullable: false, desc: 'Capacidad de puestos' },
        { name: 'assigned_count', type: 'INTEGER', nullable: false, desc: 'Puestos ocupados actualmente' }
      ]
    },
    {
      name: 'campuses',
      label: 'Sedes Institucionales',
      icon: 'apartment',
      description: 'Campus y centros de formación de la institución educativa.',
      columns: [
        { name: 'id', type: 'TEXT', pk: true, nullable: false, desc: 'central | norte | sur' },
        { name: 'name', type: 'VARCHAR(150)', nullable: false, desc: 'Nombre oficial de la sede' },
        { name: 'code', type: 'VARCHAR(50)', unique: true, nullable: false, desc: 'Código de sede' },
        { name: 'city', type: 'VARCHAR(100)', nullable: false, desc: 'Ciudad de ubicación' }
      ]
    },
    {
      name: 'user_profiles',
      label: 'Directorio y Roles (RBAC)',
      icon: 'badge',
      description: 'Perfiles de usuario, roles de acceso (admin RW, consulta RO) y vinculación con Supabase Auth.',
      columns: [
        { name: 'id', type: 'UUID', pk: true, nullable: false, desc: 'Identificador único' },
        { name: 'name', type: 'VARCHAR(150)', nullable: false, desc: 'Nombre del funcionario' },
        { name: 'email', type: 'VARCHAR(150)', unique: true, nullable: false, desc: 'Correo institucional' },
        { name: 'role', type: 'user_role_type', nullable: false, desc: 'admin | consulta | tecnico' },
        { name: 'role_title', type: 'VARCHAR(100)', nullable: false, desc: 'Título descriptivo del rol' },
        { name: 'authorized_environments', type: 'TEXT[]', nullable: true, desc: 'Ambientes a los que tiene acceso' },
        { name: 'status', type: 'VARCHAR(20)', nullable: false, desc: 'active | suspended' }
      ]
    },
    {
      name: 'audit_sessions',
      label: 'Sesiones de Auditoría In Situ',
      icon: 'fact_check',
      description: 'Procesos de auditoría física con lista de cotejo y registro de novedades.',
      columns: [
        { name: 'id', type: 'UUID', pk: true, nullable: false, desc: 'ID de la sesión' },
        { name: 'environment_id', type: 'TEXT', fk: 'environments.id', nullable: false, desc: 'Ambiente auditado' },
        { name: 'total_items', type: 'INTEGER', nullable: false, desc: 'Total activos a cotejar' },
        { name: 'verified_count', type: 'INTEGER', nullable: false, desc: 'Activos verificados' },
        { name: 'mismatch_count', type: 'INTEGER', nullable: false, desc: 'Novedades o discrepancias' },
        { name: 'auditor_name', type: 'VARCHAR(150)', nullable: false, desc: 'Nombre del auditor responsable' }
      ]
    }
  ];

  const currentTable = tablesData.find(t => t.name === selectedTable) || tablesData[0];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SUPABASE • POSTGRESQL 15
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Arquitectura de Base de Datos
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Base de Datos del Proyecto (Supabase)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Modelado relacional, DDL completo, políticas RLS, triggers criptográficos y consola de conexión cloud.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopySchema}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? '¡Copiado!' : 'Copiar SQL para Supabase'}</span>
          </button>
          
          <button
            onClick={handleDownloadSchema}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Descargar schema.sql"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="hidden sm:inline">schema.sql</span>
          </button>
        </div>
      </div>

      {/* Quick Setup Instructions Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-blue-950/10 to-slate-900/10 dark:bg-emerald-950/30 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[24px]">database</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sm text-slate-900 dark:text-white">
              ¿Cómo desplegar esta base de datos en tu proyecto Supabase?
            </span>
            <ol className="text-xs text-slate-600 dark:text-slate-300 mt-1 list-decimal list-inside space-y-0.5">
              <li>Haz clic en <strong>"Copiar SQL para Supabase"</strong> arriba.</li>
              <li>Ingresa a tu consola en <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">supabase.com/dashboard</a> y abre el <strong>SQL Editor</strong>.</li>
              <li>Pega el script y presiona <strong>"Run"</strong> para aprovisionar las 12 tablas, triggers e índices.</li>
            </ol>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('connection')}
          className="px-3.5 py-2 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/20 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
          <span>Probar Conexión Cloud</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'tables'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">table_chart</span>
          <span>Diccionario de Tablas ({tablesData.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'schema'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">code</span>
          <span>Script SQL Completo (DDL)</span>
        </button>

        <button
          onClick={() => setActiveTab('connection')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'connection'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
          <span>Conexión Supabase Cloud</span>
        </button>

        <button
          onClick={() => setActiveTab('erd')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'erd'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">account_tree</span>
          <span>Diagrama Relacional (ERD)</span>
        </button>
      </div>

      {/* TAB 1: Tables Dictionary */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Table List selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-3 shadow-xs flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
              Tablas del Esquema
            </span>
            {tablesData.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                className={`p-3 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                  selectedTable === t.name
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400">
                  {t.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-xs truncate">{t.name}</span>
                  <span className="text-[10px] opacity-70 truncate">{t.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Table Details */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{currentTable.icon}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                      {currentTable.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {currentTable.columns.length} columnas
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentTable.description}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold self-start sm:self-auto">
                RLS Habilitado
              </span>
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                    <th className="px-4 py-2.5">Columna</th>
                    <th className="px-4 py-2.5">Tipo de Dato</th>
                    <th className="px-4 py-2.5">Atributos</th>
                    <th className="px-4 py-2.5">Descripción / Restricción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {currentTable.columns.map(col => (
                    <tr key={col.name} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {col.pk && (
                          <span className="material-symbols-outlined text-[15px] text-amber-500" title="Primary Key">
                            key
                          </span>
                        )}
                        {col.fk && (
                          <span className="material-symbols-outlined text-[15px] text-blue-500" title={`Foreign Key: ${col.fk}`}>
                            link
                          </span>
                        )}
                        <span>{col.name}</span>
                      </td>

                      <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">
                        {col.type}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {col.pk && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                              PK
                            </span>
                          )}
                          {col.fk && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold" title={col.fk}>
                              FK → {col.fk.split('.')[0]}
                            </span>
                          )}
                          {'unique' in col && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                              UNIQUE
                            </span>
                          )}
                          {!col.nullable && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                              NOT NULL
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {col.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQL Script View */}
      {activeTab === 'schema' && (
        <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-3 px-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-xs text-slate-400 ml-2">supabase/schema.sql (PostgreSQL 15+)</span>
            </div>
            
            <button
              onClick={handleCopySchema}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed selection:bg-emerald-600 selection:text-white">
            <pre>
              <code>{SUPABASE_SQL_SCHEMA}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: Connection Console */}
      {activeTab === 'connection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[24px]">cloud_sync</span>
              <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Configurar Credenciales de Supabase
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conecta directamente tu proyecto en la nube de Supabase. Estas claves también pueden definirse en <code>.env.example</code> como <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>

            <form onSubmit={handleSaveAndTestConnection} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzprojectid.supabase.co"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Supabase Anon (Public) Key
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={testStatus === 'testing'}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {testStatus === 'testing' ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Verificando conexión con Supabase...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Probar y Guardar Conexión</span>
                  </>
                )}
              </button>
            </form>

            {/* Test status feedback */}
            {testStatus !== 'idle' && (
              <div className={`p-4 rounded-xl text-xs border ${
                testStatus === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                  : testStatus === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-500/30'
                  : 'bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-500/30'
              }`}>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                    {testStatus === 'success' ? 'check_circle' : testStatus === 'error' ? 'error' : 'hourglass_top'}
                  </span>
                  <p>{testMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Supabase Integration Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
              Arquitectura de Persistencia Híbrida
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              La aplicación implementa una arquitectura <strong>Offline-First & Cloud-Ready</strong>:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Sin Supabase configurado:</strong> La aplicación opera de manera 100% interactiva persistiendo movimientos, auditorías y cambios de stock en el almacenamiento local seguro (LocalStorage).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Con Supabase configurado:</strong> El cliente <code>@supabase/supabase-js</code> en <code>/src/lib/supabase.ts</code> se inicializa automáticamente para permitir sincronización directa con PostgreSQL.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Seguridad RLS:</strong> Todas las tablas incluyen políticas que garantizan que el rol <em>Consulta</em> sólo tenga privilegios SELECT, mientras que las operaciones DML requieren rol <em>Admin</em>.</span>
              </li>
            </ul>
          </div>

        </div>
      )}

      {/* TAB 4: ERD Diagram */}
      {activeTab === 'erd' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col">
            <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
              Diagrama Entidad-Relación (Modelo Relacional)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Representación visual de las relaciones y llaves foráneas entre las entidades del sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Campuses & Environments */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2">
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-cyan-400">campuses (1)</span>
              <div className="text-[11px] text-slate-500 flex justify-center py-1">↓ 1:N (campus_id)</div>
              <span className="font-mono font-bold text-xs text-blue-600 dark:text-cyan-400">environments (N)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Estructura física donde residen los laboratorios y almacenes.
              </p>
            </div>

            {/* Assets & History */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2">
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">assets (1)</span>
              <div className="text-[11px] text-slate-500 flex justify-center py-1">↓ 1:N (asset_id)</div>
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">asset_history (N)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Hoja de vida inmutable que registra cada evento, mantenimiento o traslado.
              </p>
            </div>

            {/* Service Desk */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2">
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">service_desk_tickets (1)</span>
              <div className="text-[11px] text-slate-500 flex justify-center py-1">↓ 1:N (ticket_id)</div>
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">ticket_timeline_steps & notes (N)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Trazabilidad del flujo técnico y bitácora de soporte.
              </p>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/5 flex flex-col gap-2 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Claves Foráneas & Relaciones Principales:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300">
              <div>• <code>assets.environment_id</code> → <code>environments.id</code></div>
              <div>• <code>assets.category_id</code> → <code>product_categories.id</code></div>
              <div>• <code>inventory_movements.origin_environment_id</code> → <code>environments.id</code></div>
              <div>• <code>inventory_movements.destination_environment_id</code> → <code>environments.id</code></div>
              <div>• <code>service_desk_tickets.asset_id</code> → <code>assets.id</code></div>
              <div>• <code>audit_items.session_id</code> → <code>audit_sessions.id</code></div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
