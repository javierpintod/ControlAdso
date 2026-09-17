import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Environment, SerialAsset, ProductCategory, User, AssetPhysicalStatus, EnvironmentId } from '../../types';

interface CustomizationViewProps {
  onNavigate: (view: string) => void;
}

export const CustomizationView: React.FC<CustomizationViewProps> = ({ onNavigate }) => {
  const {
    institutionProfile,
    updateInstitutionProfile,
    resetInstitutionProfile,
    environments,
    updateEnvironment,
    createEnvironment,
    deleteEnvironment,
    assets,
    updateAsset,
    createAsset,
    deleteAsset,
    categories,
    updateCategory,
    createCategory,
    deleteCategory,
    users,
    updateUser,
    exportEntireBackupJson,
    importEntireBackupJson,
    resetAllDataToFactory,
    currentRole,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'institucion' | 'ambientes' | 'activos' | 'categorias_usuarios' | 'respaldo'>('institucion');

  // Institution State Form
  const [instForm, setInstForm] = useState({
    name: institutionProfile.name,
    shortName: institutionProfile.shortName,
    centerName: institutionProfile.centerName,
    regional: institutionProfile.regional,
    nit: institutionProfile.nit,
    address: institutionProfile.address,
    city: institutionProfile.city,
    phone: institutionProfile.phone,
    email: institutionProfile.email,
    website: institutionProfile.website,
    slogan: institutionProfile.slogan,
    adminContact: institutionProfile.adminContact,
    systemName: institutionProfile.systemName,
    systemSubtitle: institutionProfile.systemSubtitle,
    logoIcon: institutionProfile.logoIcon
  });

  // Environment Editing / Creation State
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [isCreatingEnv, setIsCreatingEnv] = useState(false);
  const [newEnvForm, setNewEnvForm] = useState({
    id: '',
    name: '',
    codeName: '',
    building: 'Torre Tecnológica',
    floor: 'Piso 1',
    icon: 'meeting_room',
    totalCapacity: 25,
    assignedInstructorId: ''
  });

  // Asset Editing / Creation State
  const [assetSearch, setAssetSearch] = useState('');
  const [assetEnvFilter, setAssetEnvFilter] = useState('all');
  const [editingAsset, setEditingAsset] = useState<SerialAsset | null>(null);
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);
  const [newAssetForm, setNewAssetForm] = useState<Partial<SerialAsset>>({
    name: '',
    assetCode: '',
    serialNumber: '',
    description: '',
    descripcionActual: '',
    category: 'computo',
    environmentId: 'amb1',
    station: 'Puesto 01',
    physicalStatus: 'operativo',
    responsiblePerson: 'Almacén Institucional',
    valorIngreso: '$ 1.500.000,00',
    fechaAdquisicion: new Date().toISOString().split('T')[0],
    centroCosto: '952710',
    regional: '41'
  });

  // Category / User Editing State
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    code: '',
    description: '',
    icon: 'devices_other'
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Backup Import State
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Handlers for Institution
  const handleSaveInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === 'consulta') {
      showToast('Acción no permitida en modo consulta.', 'error');
      return;
    }
    updateInstitutionProfile(instForm);
  };

  const handleResetInstitution = () => {
    if (confirm('¿Desea restablecer los datos de la institución a los valores predeterminados (SENA)?')) {
      resetInstitutionProfile();
      setInstForm({
        name: 'SENA - Servicio Nacional de Aprendizaje',
        shortName: 'SENA',
        centerName: 'Centro de Servicios y Gestión Empresarial',
        regional: 'Regional Antioquia',
        nit: '899.999.034-1',
        address: 'Calle 51 # 57-70, Torre Occidental',
        city: 'Medellín, Colombia',
        phone: '+57 (604) 576-0000',
        email: 'contacto@sena.edu.co',
        website: 'www.sena.edu.co',
        slogan: 'Conocimiento y Oportunidad para Todos los Colombianos',
        adminContact: 'Javier Pinto - Administrador de Inventarios',
        systemName: 'EduStock',
        systemSubtitle: 'Control Patrimonial y Toma Física por Ambientes',
        logoIcon: 'inventory_2'
      });
    }
  };

  // Handlers for Environments
  const handleSaveEditEnv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnv) return;
    updateEnvironment(editingEnv.id, {
      name: editingEnv.name,
      codeName: editingEnv.codeName,
      building: editingEnv.building,
      floor: editingEnv.floor,
      icon: editingEnv.icon,
      totalCapacity: Number(editingEnv.totalCapacity),
      assignedInstructorId: editingEnv.assignedInstructorId,
      assignedInstructorName: users.find(u => u.id === editingEnv.assignedInstructorId)?.name || editingEnv.assignedInstructorName,
      assignedInstructorEmail: users.find(u => u.id === editingEnv.assignedInstructorId)?.email || editingEnv.assignedInstructorEmail
    });
    setEditingEnv(null);
  };

  const handleCreateEnv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvForm.name.trim()) {
      showToast('Por favor ingrese el nombre del ambiente.', 'warning');
      return;
    }
    const instructor = users.find(u => u.id === newEnvForm.assignedInstructorId);
    createEnvironment({
      id: newEnvForm.id.trim() || undefined,
      name: newEnvForm.name.trim(),
      codeName: newEnvForm.codeName.trim() || newEnvForm.name.trim(),
      building: newEnvForm.building.trim(),
      floor: newEnvForm.floor.trim(),
      icon: newEnvForm.icon.trim() || 'meeting_room',
      totalCapacity: Number(newEnvForm.totalCapacity) || 20,
      assignedInstructorId: instructor?.id,
      assignedInstructorName: instructor?.name,
      assignedInstructorEmail: instructor?.email
    });
    setIsCreatingEnv(false);
    setNewEnvForm({
      id: '',
      name: '',
      codeName: '',
      building: 'Torre Tecnológica',
      floor: 'Piso 1',
      icon: 'meeting_room',
      totalCapacity: 25,
      assignedInstructorId: ''
    });
  };

  // Handlers for Assets
  const filteredAssets = assets.filter(a => {
    const matchesSearch = 
      (a.name || '').toLowerCase().includes(assetSearch.toLowerCase()) ||
      (a.serialNumber || '').toLowerCase().includes(assetSearch.toLowerCase()) ||
      (a.assetCode || '').toLowerCase().includes(assetSearch.toLowerCase()) ||
      (a.placa || '').toLowerCase().includes(assetSearch.toLowerCase()) ||
      (a.station || '').toLowerCase().includes(assetSearch.toLowerCase());
    
    const matchesEnv = assetEnvFilter === 'all' || a.environmentId === assetEnvFilter;
    return matchesSearch && matchesEnv;
  });

  const handleSaveEditAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    updateAsset(editingAsset.id, editingAsset);
    setEditingAsset(null);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetForm.name?.trim() || !newAssetForm.serialNumber?.trim()) {
      showToast('El nombre y el serial son obligatorios.', 'warning');
      return;
    }
    createAsset(newAssetForm);
    setIsCreatingAsset(false);
    setNewAssetForm({
      name: '',
      assetCode: '',
      serialNumber: '',
      description: '',
      descripcionActual: '',
      category: 'computo',
      environmentId: 'amb1',
      station: 'Puesto 01',
      physicalStatus: 'operativo',
      responsiblePerson: 'Almacén Institucional',
      valorIngreso: '$ 1.500.000,00',
      fechaAdquisicion: new Date().toISOString().split('T')[0],
      centroCosto: '952710',
      regional: '41'
    });
  };

  // Handlers for Backup & Restore
  const handleDownloadBackup = () => {
    const jsonStr = exportEntireBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edustock_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad descargada exitosamente en formato JSON', 'success', 'download');
  };

  const handleRestoreFromJson = () => {
    if (!backupJsonInput.trim()) {
      showToast('Pegue el contenido JSON en el recuadro.', 'warning');
      return;
    }
    const result = importEntireBackupJson(backupJsonInput);
    if (result.success) {
      setImportStatus('✅ ' + result.message);
      setBackupJsonInput('');
    } else {
      setImportStatus('❌ ' + result.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 font-mono text-xs font-semibold backdrop-blur-md border border-white/10">
                CONFIG-MASTER-V2
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-slate-300 font-medium">
                Personalización Integral & Registro
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-cyan-400">tune</span>
              Personalización de la Institución, Ambientes y Registros
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Personalice la entidad educativa, renombre y administre los ambientes de aprendizaje, o modifique cualquier activo o registro del inventario institucional en tiempo real.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              title="Descargar copia de seguridad en JSON"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_download</span>
              <span>Exportar JSON</span>
            </button>
            <button
              onClick={() => {
                if (confirm('¿Desea restablecer TODO el sistema (institución, ambientes y activos) a los valores de fábrica? Esta acción no se puede deshacer.')) {
                  resetAllDataToFactory();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-2 active:scale-95"
              title="Restablecer todos los registros a valores por defecto"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Restablecer Fábrica</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-white/10 scrollbar-none">
        <button
          onClick={() => setActiveTab('institucion')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'institucion'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">account_balance</span>
          <span>1. Institución & Membrete</span>
        </button>

        <button
          onClick={() => setActiveTab('ambientes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'ambientes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">meeting_room</span>
          <span>2. Ambientes de Aprendizaje</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {environments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('activos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'activos'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          <span>3. Modificar Cualquier Registro</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categorias_usuarios')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'categorias_usuarios'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group_work</span>
          <span>4. Categorías & Usuarios</span>
        </button>

        <button
          onClick={() => setActiveTab('respaldo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'respaldo'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
          <span>5. Respaldo & Restauración</span>
        </button>
      </div>

      {/* TAB 1: INSTITUCIÓN */}
      {activeTab === 'institucion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Identidad Institucional & Encabezados
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Esta información se refleja en comprobantes, actas de auditoría, alertas por correo y reportes.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetInstitution}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors"
                title="Restablecer a SENA"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>Restablecer a SENA</span>
              </button>
            </div>

            <form onSubmit={handleSaveInstitution} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Oficial de la Institución *
                  </label>
                  <input
                    type="text"
                    required
                    value={instForm.name}
                    onChange={e => setInstForm({ ...instForm, name: e.target.value })}
                    placeholder="Ej: SENA - Servicio Nacional de Aprendizaje"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sigla / Acrónimo Corto *
                  </label>
                  <input
                    type="text"
                    required
                    value={instForm.shortName}
                    onChange={e => setInstForm({ ...instForm, shortName: e.target.value })}
                    placeholder="Ej: SENA, UNAL, ITM"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Centro de Formación / Sede / Facultad
                  </label>
                  <input
                    type="text"
                    value={instForm.centerName}
                    onChange={e => setInstForm({ ...instForm, centerName: e.target.value })}
                    placeholder="Ej: Centro de Servicios y Gestión Empresarial"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Regional / Departamento / Provincia
                  </label>
                  <input
                    type="text"
                    value={instForm.regional}
                    onChange={e => setInstForm({ ...instForm, regional: e.target.value })}
                    placeholder="Ej: Regional Antioquia"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NIT / Identificación Tributaria
                  </label>
                  <input
                    type="text"
                    value={instForm.nit}
                    onChange={e => setInstForm({ ...instForm, nit: e.target.value })}
                    placeholder="Ej: 899.999.034-1"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Comercial del Sistema (App)
                  </label>
                  <input
                    type="text"
                    value={instForm.systemName}
                    onChange={e => setInstForm({ ...instForm, systemName: e.target.value })}
                    placeholder="Ej: EduStock"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subtítulo / Misión del Sistema
                  </label>
                  <input
                    type="text"
                    value={instForm.systemSubtitle}
                    onChange={e => setInstForm({ ...instForm, systemSubtitle: e.target.value })}
                    placeholder="Ej: Gestión & Control Físico de Inventarios"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ícono del Logotipo (Google Material Symbol)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{instForm.logoIcon || 'account_balance'}</span>
                    </span>
                    <select
                      value={instForm.logoIcon}
                      onChange={e => setInstForm({ ...instForm, logoIcon: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="account_balance">🏛️ Edificio Institucional (account_balance)</option>
                      <option value="inventory_2">📦 Caja de Inventario (inventory_2)</option>
                      <option value="school">🎓 Educación / Universidad (school)</option>
                      <option value="precision_manufacturing">🤖 Robótica e Industria (precision_manufacturing)</option>
                      <option value="domain">🏢 Sede Corporativa (domain)</option>
                      <option value="lan">🌐 Redes y Cómputo (lan)</option>
                      <option value="science">🔬 Ciencia y Laboratorio (science)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Oficial de Notificaciones
                  </label>
                  <input
                    type="email"
                    value={instForm.email}
                    onChange={e => setInstForm({ ...instForm, email: e.target.value })}
                    placeholder="contacto@institucion.edu.co"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono & Conmutador
                  </label>
                  <input
                    type="text"
                    value={instForm.phone}
                    onChange={e => setInstForm({ ...instForm, phone: e.target.value })}
                    placeholder="+57 (604) 576-0000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección de la Sede
                  </label>
                  <input
                    type="text"
                    value={instForm.address}
                    onChange={e => setInstForm({ ...instForm, address: e.target.value })}
                    placeholder="Calle 51 # 57-70"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ciudad / Municipio
                  </label>
                  <input
                    type="text"
                    value={instForm.city}
                    onChange={e => setInstForm({ ...instForm, city: e.target.value })}
                    placeholder="Medellín, Colombia"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lema / Slogan Institucional
                </label>
                <input
                  type="text"
                  value={instForm.slogan}
                  onChange={e => setInstForm({ ...instForm, slogan: e.target.value })}
                  placeholder="Ej: Conocimiento y Oportunidad para Todos"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Responsable de Control de Inventario / Administrador
                </label>
                <input
                  type="text"
                  value={instForm.adminContact}
                  onChange={e => setInstForm({ ...instForm, adminContact: e.target.value })}
                  placeholder="Javier Pinto - Administrador Patrimonial"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Guardar Cambios Institucionales</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preview Column (1 Col) */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3">
                Vista Previa del Membrete Oficial
              </span>

              {/* Official Certificate Card Preview */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/40 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">{instForm.logoIcon || 'account_balance'}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {instForm.name || 'Nombre de la Institución'}
                </h3>
                <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 mt-0.5">
                  {instForm.centerName || 'Centro de Formación'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {instForm.regional || 'Regional'} • NIT {instForm.nit || 'NIT'}
                </span>

                <div className="w-full my-3 border-t border-slate-200 dark:border-white/10"></div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                  "{instForm.slogan || 'Lema de la institución'}"
                </div>

                <div className="mt-3 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 w-full">
                  📍 {instForm.address || 'Dirección'}, {instForm.city || 'Ciudad'}
                  <br />
                  ✉️ {instForm.email || 'correo@institucion.edu.co'}
                </div>
              </div>
            </div>

            {/* Application Branding Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                Identidad de la Aplicación
              </span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">{instForm.logoIcon || 'inventory_2'}</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {instForm.systemName || 'EduStock'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {instForm.shortName} • {instForm.systemSubtitle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AMBIENTES */}
      {activeTab === 'ambientes' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Personalización de Ambientes de Aprendizaje
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cambie el nombre de cada ambiente, edificio, capacidad o cree nuevos ambientes personalizados.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingEnv(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_home</span>
              <span>Crear Nuevo Ambiente</span>
            </button>
          </div>

          {/* List of Environments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {environments.map(env => {
              const assignedAssetsCount = assets.filter(a => a.environmentId === env.id).length;
              return (
                <div
                  key={env.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    {/* Top Row: Icon + Badge + Code */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-300 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[24px]">
                            {env.icon || 'meeting_room'}
                          </span>
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            ID: {env.id}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                            {env.codeName || env.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingEnv({ ...env })}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
                          title="Editar ambiente"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Desea eliminar el ambiente "${env.name}"? Los activos asignados serán trasladados al inventario sin asignar.`)) {
                              deleteEnvironment(env.id);
                            }
                          }}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
                          title="Eliminar ambiente"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Environment Name */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                      {env.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">apartment</span>
                      <span>{env.building} • {env.floor}</span>
                    </p>

                    {/* Instructor Info */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Instructor Custodio (Toma Física 6am/12m/6pm)
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-cyan-400">person</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {env.assignedInstructorName || 'Sin Asignar'}
                        </span>
                      </div>
                      {env.assignedInstructorEmail && (
                        <span className="text-[10px] text-slate-400 font-mono block pl-6">
                          {env.assignedInstructorEmail}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Bienes bajo custodia:
                    </span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md text-blue-700 dark:text-cyan-300">
                      {assignedAssetsCount} activos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal / Panel for Editing Environment */}
          {editingEnv && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">edit</span>
                    Editar Nombre y Parámetros del Ambiente
                  </h3>
                  <button
                    onClick={() => setEditingEnv(null)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleSaveEditEnv} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Completo del Ambiente *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEnv.name}
                      onChange={e => setEditingEnv({ ...editingEnv, name: e.target.value })}
                      placeholder="Ej: Ambiente 1 - Robótica y Automatización"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Código Corto / Nemónico
                      </label>
                      <input
                        type="text"
                        value={editingEnv.codeName}
                        onChange={e => setEditingEnv({ ...editingEnv, codeName: e.target.value })}
                        placeholder="Ej: Lab Robótica"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ícono
                      </label>
                      <select
                        value={editingEnv.icon}
                        onChange={e => setEditingEnv({ ...editingEnv, icon: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="precision_manufacturing">🤖 Robótica (precision_manufacturing)</option>
                        <option value="computer">💻 Cómputo (computer)</option>
                        <option value="lan">🌐 Redes y Servidores (lan)</option>
                        <option value="memory">⚡ Electrónica (memory)</option>
                        <option value="handyman">🔧 Taller Mecánico (handyman)</option>
                        <option value="school">📚 Aula Teórica (school)</option>
                        <option value="meeting_room">🚪 Ambiente General (meeting_room)</option>
                        <option value="science">🔬 Laboratorio Químico (science)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Edificio / Pabellón
                      </label>
                      <input
                        type="text"
                        value={editingEnv.building}
                        onChange={e => setEditingEnv({ ...editingEnv, building: e.target.value })}
                        placeholder="Ej: Pabellón Tecnológico B"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Piso / Nivel
                      </label>
                      <input
                        type="text"
                        value={editingEnv.floor}
                        onChange={e => setEditingEnv({ ...editingEnv, floor: e.target.value })}
                        placeholder="Ej: Piso 2"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Instructor Titular Responsable
                    </label>
                    <select
                      value={editingEnv.assignedInstructorId || ''}
                      onChange={e => {
                        const sel = users.find(u => u.id === e.target.value);
                        setEditingEnv({
                          ...editingEnv,
                          assignedInstructorId: e.target.value,
                          assignedInstructorName: sel?.name || '',
                          assignedInstructorEmail: sel?.email || ''
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">-- Sin Instructor Asignado --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.roleTitle} - {u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingEnv(null)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Guardar Ambiente</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Creating New Environment */}
          {isCreatingEnv && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">add_home</span>
                    Registrar Nuevo Ambiente de Aprendizaje
                  </h3>
                  <button
                    onClick={() => setIsCreatingEnv(false)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleCreateEnv} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre del Ambiente *
                    </label>
                    <input
                      type="text"
                      required
                      value={newEnvForm.name}
                      onChange={e => setNewEnvForm({ ...newEnvForm, name: e.target.value })}
                      placeholder="Ej: Laboratorio de Telecomunicaciones y Fibra Óptica"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Código / ID Opcional
                      </label>
                      <input
                        type="text"
                        value={newEnvForm.id}
                        onChange={e => setNewEnvForm({ ...newEnvForm, id: e.target.value })}
                        placeholder="Ej: amb-telecom (auto si vacío)"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ícono
                      </label>
                      <select
                        value={newEnvForm.icon}
                        onChange={e => setNewEnvForm({ ...newEnvForm, icon: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="meeting_room">🚪 Ambiente General (meeting_room)</option>
                        <option value="precision_manufacturing">🤖 Robótica (precision_manufacturing)</option>
                        <option value="computer">💻 Cómputo (computer)</option>
                        <option value="lan">🌐 Redes / Telecom (lan)</option>
                        <option value="memory">⚡ Electrónica (memory)</option>
                        <option value="handyman">🔧 Taller (handyman)</option>
                        <option value="school">📚 Aula (school)</option>
                        <option value="science">🔬 Laboratorio (science)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Edificio / Pabellón
                      </label>
                      <input
                        type="text"
                        value={newEnvForm.building}
                        onChange={e => setNewEnvForm({ ...newEnvForm, building: e.target.value })}
                        placeholder="Ej: Pabellón Tecnológico"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Piso / Nivel
                      </label>
                      <input
                        type="text"
                        value={newEnvForm.floor}
                        onChange={e => setNewEnvForm({ ...newEnvForm, floor: e.target.value })}
                        placeholder="Ej: Piso 3"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Instructor Titular Responsable
                    </label>
                    <select
                      value={newEnvForm.assignedInstructorId}
                      onChange={e => setNewEnvForm({ ...newEnvForm, assignedInstructorId: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">-- Sin Instructor Asignado --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.roleTitle} - {u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    ℹ️ Al crear el ambiente, se programarán automáticamente los horarios de toma física diaria (6:00 AM, 12:00 M y 6:00 PM).
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsCreatingEnv(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Crear Ambiente</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MODIFICAR CUALQUIER REGISTRO (ACTIVOS) */}
      {activeTab === 'activos' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Editor Maestro de Registros de Inventario
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modifique cualquier activo del sistema: seriales, placas, estados físicos, ambiente asignado, responsable o descripciones técnicas.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingAsset(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Registrar Nuevo Activo</span>
            </button>
          </div>

          {/* Search & Filter bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="relative w-full md:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                value={assetSearch}
                onChange={e => setAssetSearch(e.target.value)}
                placeholder="Buscar por placa, serial, nombre o puesto..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Ambiente:</span>
              <select
                value={assetEnvFilter}
                onChange={e => setAssetEnvFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">Todos los Ambientes ({assets.length})</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.name} ({assets.filter(a => a.environmentId === env.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table of Assets */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Placa / Serial</th>
                    <th className="py-3 px-4">Descripción del Activo</th>
                    <th className="py-3 px-4">Ambiente & Puesto</th>
                    <th className="py-3 px-4">Estado Físico</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  {filteredAssets.slice(0, 100).map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium">
                        <span className="font-bold text-blue-600 dark:text-cyan-400 block">
                          {asset.placa || asset.assetCode}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          SN: {asset.serial || asset.serialNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-semibold text-slate-900 dark:text-white block truncate">
                          {asset.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {asset.modelo || asset.description}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">
                          {asset.environmentName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {asset.station || 'Puesto General'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          asset.physicalStatus === 'operativo'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : asset.physicalStatus === 'mesa_servicio'
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300 border border-blue-500/20'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                        }`}>
                          {asset.physicalStatus.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                        {asset.responsiblePerson || 'Almacén Institucional'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingAsset({ ...asset })}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Editar todos los campos de este activo"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar activo ${asset.placa || asset.assetCode} permanentemente?`)) {
                                deleteAsset(asset.id);
                              }
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            title="Eliminar activo"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No se encontraron registros que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredAssets.length > 100 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
                Mostrando los primeros 100 de {filteredAssets.length} registros. Use el buscador para afinar la consulta.
              </div>
            )}
          </div>

          {/* Modal for Editing Asset */}
          {editingAsset && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">edit_note</span>
                    Personalizar Registro de Activo ({editingAsset.placa || editingAsset.assetCode})
                  </h3>
                  <button
                    onClick={() => setEditingAsset(null)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleSaveEditAsset} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Código de Placa Institucional *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingAsset.placa || editingAsset.assetCode}
                        onChange={e => setEditingAsset({
                          ...editingAsset,
                          placa: e.target.value,
                          assetCode: e.target.value
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Número de Serial de Fábrica *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingAsset.serial || editingAsset.serialNumber}
                        onChange={e => setEditingAsset({
                          ...editingAsset,
                          serial: e.target.value,
                          serialNumber: e.target.value
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre / Tipo de Bien *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingAsset.name}
                        onChange={e => setEditingAsset({ ...editingAsset, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Modelo Comercial
                      </label>
                      <input
                        type="text"
                        value={editingAsset.modelo || editingAsset.description}
                        onChange={e => setEditingAsset({
                          ...editingAsset,
                          modelo: e.target.value,
                          description: e.target.value
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ambiente de Ubicación
                      </label>
                      <select
                        value={editingAsset.environmentId}
                        onChange={e => {
                          const targetEnv = environments.find(env => env.id === e.target.value);
                          setEditingAsset({
                            ...editingAsset,
                            environmentId: e.target.value as EnvironmentId,
                            environmentName: targetEnv ? targetEnv.name : editingAsset.environmentName
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      >
                        {environments.map(env => (
                          <option key={env.id} value={env.id}>
                            {env.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Puesto / Estación de Trabajo
                      </label>
                      <input
                        type="text"
                        value={editingAsset.station || ''}
                        onChange={e => setEditingAsset({ ...editingAsset, station: e.target.value })}
                        placeholder="Ej: Puesto 08, Banco 2"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Estado Físico del Bien
                      </label>
                      <select
                        value={editingAsset.physicalStatus}
                        onChange={e => setEditingAsset({
                          ...editingAsset,
                          physicalStatus: e.target.value as AssetPhysicalStatus,
                          statusLabel: e.target.value.toUpperCase()
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="operativo">Operativo (En servicio)</option>
                        <option value="mesa_servicio">Mesa de Servicio (En revisión)</option>
                        <option value="con_dano">Con Daño Físico (Averiado)</option>
                        <option value="mantenimiento">Mantenimiento Preventivo</option>
                        <option value="decomisado">Decomisado / Baja</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Funcionario / Custodio Responsable
                      </label>
                      <input
                        type="text"
                        value={editingAsset.responsiblePerson || ''}
                        onChange={e => setEditingAsset({ ...editingAsset, responsiblePerson: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Valor de Ingreso / Costo Contable
                      </label>
                      <input
                        type="text"
                        value={editingAsset.valorIngreso || ''}
                        onChange={e => setEditingAsset({ ...editingAsset, valorIngreso: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ficha Técnica Oficial / Descripción Detallada
                      </label>
                      <textarea
                        rows={3}
                        value={editingAsset.descripcionActual || editingAsset.description}
                        onChange={e => setEditingAsset({
                          ...editingAsset,
                          descripcionActual: e.target.value,
                          description: e.target.value
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingAsset(null)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Guardar Registro</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Creating Asset */}
          {isCreatingAsset && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">add_circle</span>
                    Registrar Nuevo Bien / Activo en el Sistema
                  </h3>
                  <button
                    onClick={() => setIsCreatingAsset(false)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleCreateAsset} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Código de Placa / Identificador *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAssetForm.assetCode}
                        onChange={e => setNewAssetForm({
                          ...newAssetForm,
                          assetCode: e.target.value,
                          placa: e.target.value
                        })}
                        placeholder="Ej: 10104118899"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Número de Serial de Fábrica *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAssetForm.serialNumber}
                        onChange={e => setNewAssetForm({
                          ...newAssetForm,
                          serialNumber: e.target.value,
                          serial: e.target.value
                        })}
                        placeholder="Ej: 8CN4490XYZ"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre del Activo *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAssetForm.name}
                        onChange={e => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                        placeholder="Ej: COMPUTADOR PORTATIL DELL LATITUDE 5420"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ambiente de Destino
                      </label>
                      <select
                        value={newAssetForm.environmentId}
                        onChange={e => setNewAssetForm({ ...newAssetForm, environmentId: e.target.value as EnvironmentId })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      >
                        {environments.map(env => (
                          <option key={env.id} value={env.id}>
                            {env.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Puesto / Estación
                      </label>
                      <input
                        type="text"
                        value={newAssetForm.station}
                        onChange={e => setNewAssetForm({ ...newAssetForm, station: e.target.value })}
                        placeholder="Ej: Puesto 05"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Categoría
                      </label>
                      <select
                        value={newAssetForm.category}
                        onChange={e => setNewAssetForm({ ...newAssetForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Valor de Ingreso
                      </label>
                      <input
                        type="text"
                        value={newAssetForm.valorIngreso}
                        onChange={e => setNewAssetForm({ ...newAssetForm, valorIngreso: e.target.value })}
                        placeholder="$ 2.500.000,00"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ficha Técnica y Observaciones
                      </label>
                      <textarea
                        rows={2}
                        value={newAssetForm.descripcionActual}
                        onChange={e => setNewAssetForm({ ...newAssetForm, descripcionActual: e.target.value })}
                        placeholder="Especificaciones, procesador, memoria o detalles de inventario..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsCreatingAsset(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Crear Activo</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CATEGORÍAS & USUARIOS */}
      {activeTab === 'categorias_usuarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">category</span>
                    Categorías de Activos
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Personalice los tipos de bienes (cómputo, robótica, etc.)
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingCategory(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Nueva Categoría</span>
                </button>
              </div>

              <div className="space-y-3">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">{cat.icon || 'devices_other'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {cat.code} • {cat.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-white/10"
                        title="Editar categoría"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-white/10"
                        title="Eliminar categoría"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users / Instructors Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">people</span>
                  Usuarios e Instructores del Sistema
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Edite nombres de funcionarios, correos y roles institucionales
                </p>
              </div>
              <button
                onClick={() => onNavigate('usuarios')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1"
              >
                <span>Gestor RBAC</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-3">
              {users.map(user => (
                <div
                  key={user.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        {user.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {user.email} • {user.roleTitle}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingUser({ ...user })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-white/10"
                    title="Editar usuario"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal for Editing User */}
          {editingUser && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Editar Usuario / Instructor
                  </h3>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateUser(editingUser.id, editingUser);
                  setEditingUser(null);
                }} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingUser.name}
                      onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={editingUser.email}
                      onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo Institucional
                    </label>
                    <input
                      type="text"
                      value={editingUser.roleTitle}
                      onChange={e => setEditingUser({ ...editingUser, roleTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Creating Category */}
          {isCreatingCategory && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Nueva Categoría de Activos
                  </h3>
                  <button
                    onClick={() => setIsCreatingCategory(false)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  createCategory(newCatForm);
                  setIsCreatingCategory(false);
                  setNewCatForm({ name: '', code: '', description: '', icon: 'devices_other' });
                }} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatForm.name}
                      onChange={e => setNewCatForm({ ...newCatForm, name: e.target.value })}
                      placeholder="Ej: Equipos Audiovisuales"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Código
                    </label>
                    <input
                      type="text"
                      value={newCatForm.code}
                      onChange={e => setNewCatForm({ ...newCatForm, code: e.target.value })}
                      placeholder="Ej: CAT-AUDIO"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={newCatForm.description}
                      onChange={e => setNewCatForm({ ...newCatForm, description: e.target.value })}
                      placeholder="Proyectores, micrófonos y pantallas"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RESPALDO & RESTAURACIÓN */}
      {activeTab === 'respaldo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">cloud_download</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Exportar Copia de Seguridad JSON Completa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Descargue todos los datos configurados: perfil institucional personalizado, todos los ambientes y sus nombres, todos los activos de inventario, categorías, usuarios y cronogramas de toma física.
              </p>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Registros de Activos:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{assets.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Ambientes de Aprendizaje:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{environments.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Categorías Definidas:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{categories.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Usuarios / Instructores:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{users.length}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleDownloadBackup}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Descargar Archivo de Respaldo .JSON</span>
              </button>
            </div>
          </div>

          {/* Import Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Restaurar o Cargar Copia de Seguridad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Pegue el contenido JSON previamente exportado para recuperar o migrar toda la configuración y registros al instante.
              </p>

              <div className="mt-4">
                <textarea
                  rows={5}
                  value={backupJsonInput}
                  onChange={e => setBackupJsonInput(e.target.value)}
                  placeholder="Pegue aquí el contenido JSON exportado..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {importStatus && (
                <div className="mt-2 text-xs font-semibold p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {importStatus}
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                onClick={handleRestoreFromJson}
                disabled={!backupJsonInput.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">restore</span>
                <span>Restaurar Datos desde JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
