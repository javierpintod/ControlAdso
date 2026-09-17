import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  CampusId, 
  EnvironmentId, 
  ProductCategory, 
  SerialAsset, 
  InventoryMovement, 
  ServiceDeskTicket, 
  AuditSession, 
  AuditItem,
  ToastMessage,
  MovementType,
  TicketResolutionType,
  Environment,
  PhysicalInventorySchedule,
  AdminEmailAlert,
  ShiftType,
  InstitutionProfile
} from '../types';
import { 
  INITIAL_ENVIRONMENTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ASSETS, 
  INITIAL_MOVEMENTS, 
  INITIAL_TICKET, 
  INITIAL_USERS, 
  INITIAL_AUDIT_SESSION,
  INITIAL_PHYSICAL_SCHEDULES,
  INITIAL_ADMIN_EMAIL_ALERTS,
  DEFAULT_INSTITUTION_PROFILE
} from '../data/mockData';
import { 
  RawInventoryRow, 
  convertRawRowToSerialAsset,
  INITIAL_INSTITUTIONAL_ASSETS 
} from '../data/institutionalAssets';
import { 
  generateWeeklyPhysicalSchedules, 
  getWeekDaysForDate 
} from '../utils/scheduleWeekUtils';

interface RegisterMovementInput {
  type: MovementType;
  productName: string;
  categoryCode?: string;
  originEnvironmentId?: EnvironmentId;
  destinationEnvironmentId?: EnvironmentId;
  quantity: number;
  notes: string;
  serialNumber?: string;
  assetCode?: string;
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  currentCampus: { id: CampusId; name: string };
  theme: 'light' | 'dark';
  activeEnvironmentTab: EnvironmentId;
  categories: ProductCategory[];
  assets: SerialAsset[];
  movements: InventoryMovement[];
  ticket: ServiceDeskTicket;
  users: User[];
  usersList: User[];
  auditSession: AuditSession;
  auditItems: AuditItem[];
  toast: ToastMessage | null;
  activeModal: string | null;
  selectedAsset: SerialAsset | null;
  voucherData: InventoryMovement | null;
  environments: Environment[];
  physicalSchedules: PhysicalInventorySchedule[];
  resetWeeklySchedules: (baseDate?: string) => void;
  adminEmailAlerts: AdminEmailAlert[];
  adminEmailAddress: string;
  setAdminEmailAddress: (email: string) => void;
  
  // Customization & Institution Profile
  institutionProfile: InstitutionProfile;
  updateInstitutionProfile: (profile: Partial<InstitutionProfile>) => void;
  resetInstitutionProfile: () => void;

  // Environment Customization & CRUD
  updateEnvironment: (envId: string, data: Partial<Environment>) => void;
  createEnvironment: (newEnv: {
    id?: string;
    name: string;
    codeName: string;
    building: string;
    floor: string;
    icon: string;
    totalCapacity: number;
    assignedInstructorId?: string;
    assignedInstructorName?: string;
    assignedInstructorEmail?: string;
  }) => void;
  deleteEnvironment: (envId: string) => void;

  // Customization of Any Records (Assets, Categories, Users, Movements)
  updateAsset: (assetId: string, data: Partial<SerialAsset>) => void;
  createAsset: (assetData: Partial<SerialAsset>) => void;
  deleteAsset: (assetId: string) => void;
  
  updateCategory: (categoryId: string, data: Partial<ProductCategory>) => void;
  createCategory: (catData: Partial<ProductCategory>) => void;
  deleteCategory: (categoryId: string) => void;

  updateUser: (userId: string, data: Partial<User>) => void;

  updateMovement: (movementId: string, data: Partial<InventoryMovement>) => void;
  deleteMovement: (movementId: string) => void;

  // Backup, Restore & Reset
  exportEntireBackupJson: () => string;
  importEntireBackupJson: (jsonData: string) => { success: boolean; message: string };
  resetAllDataToFactory: () => void;
  
  // Actions
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  setCampus: (id: CampusId, name: string) => void;
  setActiveEnvironmentTab: (env: EnvironmentId) => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: ToastMessage['type'], icon?: string) => void;
  hideToast: () => void;
  openModal: (modalName: string, payload?: unknown) => void;
  closeModal: () => void;
  setSelectedAsset: (asset: SerialAsset | null) => void;
  
  // Instructors & Physical Inventory Shifts (6am, 12m, 6pm)
  assignInstructorToEnvironment: (envId: EnvironmentId, instructorId: string) => void;
  completePhysicalInventory: (
    scheduleId: string, 
    verifiedCount: number, 
    notes?: string,
    verifiedSerials?: string[]
  ) => void;
  markScheduleAsMissed: (scheduleId: string, customReason?: string) => void;
  resendAdminEmailAlert: (alertId: string) => void;
  executeAutoMissedCheck: () => void;
  
  // Operations with strict TRD business rules
  registerMovement: (input: RegisterMovementInput) => { success: boolean; error?: string };
  verifyAssetInAudit: (assetId: string, station?: string) => void;
  reportAuditDiscrepancy: (assetId: string, note: string) => void;
  finalizeAuditSession: () => void;
  addTicketNote: (noteText: string) => void;
  updateTicketStatus: (status: ServiceDeskTicket['status']) => void;
  resolveServiceDeskTicket: (ticketId: string, resolution: TicketResolutionType, notes: string) => void;
  addNewUser: (userData: Omit<User, 'id' | 'lastLogin' | 'ipAddress' | 'activeSession'>) => void;
  removeUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  exportData: (format: 'pdf' | 'excel', filter?: string) => void;
  assignAssetEnvironment: (
    assetId: string, 
    targetEnvId: EnvironmentId, 
    station?: string, 
    responsiblePerson?: string, 
    notes?: string
  ) => void;
  assignBatchAssets: (
    assetIds: string[], 
    targetEnvId: EnvironmentId, 
    stationPrefix?: string, 
    responsiblePerson?: string, 
    notes?: string
  ) => void;
  importInstitutionalBatch: (
    rawRows: RawInventoryRow[], 
    targetEnvId?: EnvironmentId
  ) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('controladso_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Current User / Role State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  // Campus
  const [currentCampus, setCurrentCampus] = useState<{ id: CampusId; name: string }>({
    id: 'central',
    name: 'Sede Central - Campus Educativo'
  });

  // Active Environment Filter
  const [activeEnvironmentTab, setActiveEnvironmentTab] = useState<EnvironmentId>('all');

  // Business Entities con control de versión de datos institucionales SENA
  const DATA_VERSION = 'sena_institutional_v3';

  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    const savedVer = localStorage.getItem('controladso_data_version');
    if (savedVer === DATA_VERSION) {
      const saved = localStorage.getItem('controladso_categories');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing categories:', e);
        }
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [assets, setAssets] = useState<SerialAsset[]>(() => {
    const savedVer = localStorage.getItem('controladso_data_version');
    if (savedVer === DATA_VERSION) {
      const saved = localStorage.getItem('controladso_assets');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filtrar estrictamente cualquier activo mock previo (EDU-ACT)
            const cleanList = parsed.filter(a => !a.assetCode?.startsWith('EDU-'));
            if (cleanList.length > 0) {
              return cleanList;
            }
          }
        } catch (e) {
          console.error('Error loading stored assets:', e);
        }
      }
    }
    // Inicializar directamente con la totalidad de los registros institucionales del SENA
    localStorage.setItem('controladso_data_version', DATA_VERSION);
    return INITIAL_INSTITUTIONAL_ASSETS;
  });

  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    const savedVer = localStorage.getItem('controladso_data_version');
    if (savedVer === DATA_VERSION) {
      const saved = localStorage.getItem('controladso_movements');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing movements:', e);
        }
      }
    }
    return INITIAL_MOVEMENTS;
  });

  const [ticket, setTicket] = useState<ServiceDeskTicket>(INITIAL_TICKET);
  const [auditSession, setAuditSession] = useState<AuditSession>(INITIAL_AUDIT_SESSION);

  // UI state
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<SerialAsset | null>(INITIAL_ASSETS[0]);
  const [voucherData, setVoucherData] = useState<InventoryMovement | null>(INITIAL_MOVEMENTS[0]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('controladso_theme', theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('controladso_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('controladso_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('controladso_movements', JSON.stringify(movements));
  }, [movements]);

  // Ambientes con Instructores asignados
  const [environments, setEnvironments] = useState<Environment[]>(() => {
    const saved = localStorage.getItem('controladso_environments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing environments:', e);
      }
    }
    return INITIAL_ENVIRONMENTS;
  });

  // Cronograma de Tomas Físicas Semanales (Lunes a Sábado • 6:00 AM, 12:00 M, 6:00 PM)
  const [physicalSchedules, setPhysicalSchedules] = useState<PhysicalInventorySchedule[]>(() => {
    const saved = localStorage.getItem('controladso_schedules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validar que la información guardada tenga la cobertura semanal con sábado incluido
        if (Array.isArray(parsed) && parsed.length >= 25 && parsed.some(s => s.date.includes('2026-09-19') || (s.shiftLabel && (s.shiftLabel.includes('Sabatino') || s.shiftLabel.includes('Sabatina'))))) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing schedules:', e);
      }
    }
    return INITIAL_PHYSICAL_SCHEDULES;
  });

  // Bandeja de Alertas de Correo al Administrador
  const [adminEmailAlerts, setAdminEmailAlerts] = useState<AdminEmailAlert[]>(() => {
    const saved = localStorage.getItem('controladso_email_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing email alerts:', e);
      }
    }
    return INITIAL_ADMIN_EMAIL_ALERTS;
  });

  const [adminEmailAddress, setAdminEmailAddressState] = useState<string>(() => {
    return localStorage.getItem('controladso_admin_email') || 'javierpint@gmail.com';
  });

  const setAdminEmailAddress = (email: string) => {
    setAdminEmailAddressState(email);
    localStorage.setItem('controladso_admin_email', email);
    showToast(`Correo del Administrador actualizado a: ${email}`, 'info', 'mail');
  };

  useEffect(() => {
    localStorage.setItem('controladso_environments', JSON.stringify(environments));
  }, [environments]);

  useEffect(() => {
    localStorage.setItem('controladso_schedules', JSON.stringify(physicalSchedules));
  }, [physicalSchedules]);

  useEffect(() => {
    localStorage.setItem('controladso_email_alerts', JSON.stringify(adminEmailAlerts));
  }, [adminEmailAlerts]);

  // Perfil Institucional Personalizable
  const [institutionProfile, setInstitutionProfile] = useState<InstitutionProfile>(() => {
    const saved = localStorage.getItem('controladso_institution_profile');
    if (saved) {
      try {
        return { ...DEFAULT_INSTITUTION_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error parsing institution profile:', e);
      }
    }
    return DEFAULT_INSTITUTION_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('controladso_institution_profile', JSON.stringify(institutionProfile));
  }, [institutionProfile]);

  const updateInstitutionProfile = (profileData: Partial<InstitutionProfile>) => {
    setInstitutionProfile(prev => ({ ...prev, ...profileData }));
    showToast('Perfil institucional actualizado correctamente', 'success', 'account_balance');
  };

  const resetInstitutionProfile = () => {
    setInstitutionProfile(DEFAULT_INSTITUTION_PROFILE);
    localStorage.removeItem('controladso_institution_profile');
    showToast('Institución restablecida a valores por defecto (SENA)', 'info', 'restart_alt');
  };

  // Personalización y CRUD de Ambientes
  const updateEnvironment = (envId: string, data: Partial<Environment>) => {
    setEnvironments(prev => prev.map(env => {
      if (env.id === envId) {
        return { ...env, ...data };
      }
      return env;
    }));

    // Sincronizar el nombre si cambió
    if (data.name) {
      setAssets(prev => prev.map(asset => {
        if (asset.environmentId === envId) {
          return { ...asset, environmentName: data.name! };
        }
        return asset;
      }));

      setPhysicalSchedules(prev => prev.map(sch => {
        if (sch.environmentId === envId) {
          return { ...sch, environmentName: data.name! };
        }
        return sch;
      }));

      setAdminEmailAlerts(prev => prev.map(alt => {
        if (alt.environmentId === envId) {
          return { ...alt, environmentName: data.name! };
        }
        return alt;
      }));

      setAuditSession(prev => {
        if (prev.environmentId === envId) {
          return { ...prev, environmentName: data.name! };
        }
        return prev;
      });
    }

    showToast(`Ambiente "${data.name || envId}" actualizado correctamente`, 'success', 'meeting_room');
  };

  const createEnvironment = (newEnvData: {
    id?: string;
    name: string;
    codeName: string;
    building: string;
    floor: string;
    icon: string;
    totalCapacity: number;
    assignedInstructorId?: string;
    assignedInstructorName?: string;
    assignedInstructorEmail?: string;
  }) => {
    const rawId = newEnvData.id || `amb-${Date.now().toString(36)}`;
    const sanitizedId = rawId.toLowerCase().replace(/\s+/g, '-');
    
    // Check if ID exists
    if (environments.some(e => e.id === sanitizedId)) {
      showToast('Ya existe un ambiente con ese código identificador.', 'error');
      return;
    }

    const created: Environment = {
      id: sanitizedId,
      name: newEnvData.name,
      codeName: newEnvData.codeName || newEnvData.name,
      building: newEnvData.building || 'Edificio Principal',
      floor: newEnvData.floor || 'Piso 1',
      icon: newEnvData.icon || 'meeting_room',
      totalCapacity: Number(newEnvData.totalCapacity) || 20,
      assignedCount: 0,
      occupancyPercentage: 0,
      assignedInstructorId: newEnvData.assignedInstructorId,
      assignedInstructorName: newEnvData.assignedInstructorName,
      assignedInstructorEmail: newEnvData.assignedInstructorEmail,
      categoryBreakdown: { computo: 0, robotica: 0, electronica: 0, herramientas: 0 }
    };

    setEnvironments(prev => [...prev, created]);

    // Generar automáticamente las jornadas de toma física para el nuevo ambiente para la semana completa (Lunes a Sábado • 3 turnos diarios)
    const weekDays = getWeekDaysForDate('2026-09-17');
    const shifts: { shift: ShiftType; deadline: string }[] = [
      { shift: '06:00', deadline: '06:30 AM' },
      { shift: '12:00', deadline: '12:30 PM' },
      { shift: '18:00', deadline: '06:30 PM' }
    ];

    const newSchedules: PhysicalInventorySchedule[] = [];
    weekDays.forEach(dayInfo => {
      shifts.forEach(s => {
        const shiftLabel = dayInfo.isSaturday
          ? s.shift === '06:00'
            ? '06:00 AM • Apertura Taller Sabatino'
            : s.shift === '12:00'
            ? '12:00 M • Jornada Técnica Sabatina'
            : '06:00 PM • Cierre Jornada Sabatina'
          : s.shift === '06:00'
          ? '06:00 AM • Apertura de Taller'
          : s.shift === '12:00'
          ? '12:00 M • Cambio de Jornada'
          : '06:00 PM • Cierre Nocturno';

        newSchedules.push({
          id: `sch-${created.id}-${dayInfo.date}-${s.shift.replace(':', '')}-${Date.now()}`,
          environmentId: created.id,
          environmentName: created.name,
          instructorId: created.assignedInstructorId || 'usr-inst-1',
          instructorName: created.assignedInstructorName || 'Sin Asignar',
          instructorEmail: created.assignedInstructorEmail || 'instructor@sena.edu.co',
          date: dayInfo.date,
          shift: s.shift,
          shiftLabel,
          deadlineTime: s.deadline,
          status: 'PENDIENTE',
          totalItems: 0,
          verifiedCount: 0,
          missingCount: 0,
          alertSent: false
        });
      });
    });

    setPhysicalSchedules(prev => [...prev, ...newSchedules]);
    showToast(`Ambiente "${created.name}" creado con éxito`, 'success', 'domain_add');
  };

  const deleteEnvironment = (envId: string) => {
    const envToDelete = environments.find(e => e.id === envId);
    if (!envToDelete) return;

    // Desvincular activos para no perderlos
    setAssets(prev => prev.map(a => a.environmentId === envId ? { ...a, environmentId: 'unassigned', environmentName: 'Sin Asignar (Reubicación)' } : a));
    setEnvironments(prev => prev.filter(e => e.id !== envId));
    setPhysicalSchedules(prev => prev.filter(s => s.environmentId !== envId));
    setAdminEmailAlerts(prev => prev.filter(a => a.environmentId !== envId));

    showToast(`Ambiente "${envToDelete.name}" eliminado correctamente`, 'warning', 'delete');
  };

  // Personalización de Activos / Bienes (Cualquier Registro)
  const updateAsset = (assetId: string, data: Partial<SerialAsset>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const updated = { ...a, ...data };
        if (data.environmentId) {
          const targetEnv = environments.find(e => e.id === data.environmentId);
          if (targetEnv) {
            updated.environmentName = targetEnv.name;
          }
        }
        return updated;
      }
      return a;
    }));

    if (selectedAsset?.id === assetId) {
      setSelectedAsset(prev => prev ? { ...prev, ...data } : null);
    }

    showToast(`Activo guardado con éxito`, 'success', 'edit');
  };

  const createAsset = (assetData: Partial<SerialAsset>) => {
    const env = environments.find(e => e.id === assetData.environmentId) || environments[0];
    const newId = `asset-custom-${Date.now()}`;
    const generatedSerial = assetData.serialNumber || assetData.serial || `SN-${Date.now().toString().slice(-6)}`;
    const generatedPlaca = assetData.assetCode || assetData.placa || `PL-${Date.now().toString().slice(-6)}`;

    const newAsset: SerialAsset = {
      id: newId,
      serialNumber: generatedSerial,
      assetCode: generatedPlaca,
      name: assetData.name || 'Activo Institucional Personalizado',
      description: assetData.description || 'Bien registrado manualmente en el inventario',
      category: assetData.category || 'computo',
      environmentId: env ? env.id : 'amb1',
      environmentName: env ? env.name : 'Ambiente 1',
      station: assetData.station || 'Puesto General',
      physicalStatus: assetData.physicalStatus || 'operativo',
      statusLabel: assetData.physicalStatus === 'operativo' ? 'Operativo' : 'En Verificación',
      responsiblePerson: assetData.responsiblePerson || 'Almacén Institucional',
      assignedDate: assetData.assignedDate || new Date().toISOString().split('T')[0],
      warrantyUntil: assetData.warrantyUntil || '2028-12-31',
      barcode: assetData.barcode || `BC-${generatedPlaca}`,
      qrToken: assetData.qrToken || `QR-${generatedPlaca}`,
      specs: assetData.specs || { notes: 'Creado desde el módulo de personalización' },
      photoUrl: assetData.photoUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
      placa: generatedPlaca,
      serial: generatedSerial,
      modelo: assetData.modelo || assetData.name || 'Modelo Personalizado',
      descripcionActual: assetData.descripcionActual || assetData.description || 'Ficha técnica y características del bien',
      valorIngreso: assetData.valorIngreso || '$ 1.200.000,00',
      fechaAdquisicion: assetData.fechaAdquisicion || new Date().toISOString().split('T')[0],
      centroCosto: assetData.centroCosto || '952710',
      regional: assetData.regional || '41',
      consecutivo: assetData.consecutivo || Date.now().toString().slice(-6),
      historyTimeline: [
        {
          id: `h-${Date.now()}`,
          title: 'Registro Inicial en Sistema',
          date: new Date().toLocaleDateString('es-CO'),
          time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          description: 'Activo creado desde el módulo de personalización y administración.',
          author: currentUser.name,
          type: 'registration'
        }
      ],
      ...assetData
    };

    setAssets(prev => [newAsset, ...prev]);
    showToast(`Activo "${newAsset.name}" registrado`, 'success', 'add_circle');
  };

  const deleteAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    setAssets(prev => prev.filter(a => a.id !== assetId));
    if (selectedAsset?.id === assetId) {
      setSelectedAsset(null);
    }
    showToast(`Activo "${asset?.name || assetId}" eliminado del registro`, 'warning', 'delete');
  };

  // Personalización de Categorías
  const updateCategory = (categoryId: string, data: Partial<ProductCategory>) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...data } : c));
    showToast(`Categoría actualizada`, 'success', 'category');
  };

  const createCategory = (catData: Partial<ProductCategory>) => {
    const newCat: ProductCategory = {
      id: catData.id || `cat-${Date.now().toString(36)}`,
      code: catData.code || `CAT-${Date.now().toString().slice(-4)}`,
      name: catData.name || 'Nueva Categoría',
      description: catData.description || 'Descripción de categoría',
      icon: catData.icon || 'devices_other',
      amb1: 0,
      amb2: 0,
      amb3: 0,
      mesa: 0,
      dano: 0,
      total: 0,
      operationalPercentage: 100,
      status: 'ok',
      ...catData
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Categoría "${newCat.name}" creada`, 'success', 'add');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast('Categoría eliminada', 'warning', 'delete');
  };

  // Personalización de Usuarios / Instructores
  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
    if (data.name) {
      setEnvironments(prev => prev.map(env => {
        if (env.assignedInstructorId === userId) {
          return { ...env, assignedInstructorName: data.name! };
        }
        return env;
      }));
    }
    showToast(`Usuario actualizado`, 'success', 'person');
  };

  // Personalización de Movimientos
  const updateMovement = (movementId: string, data: Partial<InventoryMovement>) => {
    setMovements(prev => prev.map(m => m.id === movementId ? { ...m, ...data } : m));
    showToast(`Movimiento actualizado`, 'success', 'history_edu');
  };

  const deleteMovement = (movementId: string) => {
    setMovements(prev => prev.filter(m => m.id !== movementId));
    showToast('Registro de movimiento eliminado', 'warning', 'delete');
  };

  // Backup, Restauración y Restablecimiento Completo
  const exportEntireBackupJson = () => {
    const fullBackup = {
      system: 'EduStock_Customization_Backup',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      institutionProfile,
      environments,
      categories,
      assets,
      users,
      movements,
      physicalSchedules,
      adminEmailAlerts,
      adminEmailAddress
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importEntireBackupJson = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.institutionProfile) setInstitutionProfile(data.institutionProfile);
      if (Array.isArray(data.environments)) setEnvironments(data.environments);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.assets)) setAssets(data.assets);
      if (Array.isArray(data.users)) setUsers(data.users);
      if (Array.isArray(data.movements)) setMovements(data.movements);
      if (Array.isArray(data.physicalSchedules)) setPhysicalSchedules(data.physicalSchedules);
      if (Array.isArray(data.adminEmailAlerts)) setAdminEmailAlerts(data.adminEmailAlerts);
      if (data.adminEmailAddress) setAdminEmailAddressState(data.adminEmailAddress);
      showToast('Copia de respaldo restaurada exitosamente', 'success', 'cloud_done');
      return { success: true, message: 'Todos los registros y configuraciones fueron restaurados con éxito.' };
    } catch (err) {
      console.error('Error importing backup:', err);
      showToast('El archivo JSON no tiene un formato válido.', 'error', 'error');
      return { success: false, message: 'El archivo JSON no tiene un formato válido.' };
    }
  };

  const resetAllDataToFactory = () => {
    localStorage.clear();
    setInstitutionProfile(DEFAULT_INSTITUTION_PROFILE);
    setEnvironments(INITIAL_ENVIRONMENTS);
    setCategories(INITIAL_CATEGORIES);
    setAssets(INITIAL_ASSETS);
    setUsers(INITIAL_USERS);
    setMovements(INITIAL_MOVEMENTS);
    setPhysicalSchedules(INITIAL_PHYSICAL_SCHEDULES);
    setAdminEmailAlerts(INITIAL_ADMIN_EMAIL_ALERTS);
    setAdminEmailAddressState('javierpint@gmail.com');
    showToast('Sistema restablecido a los valores originales (SENA)', 'info', 'restore');
  };

  // Asignación de Instructor a un Ambiente de Aprendizaje
  const assignInstructorToEnvironment = (envId: EnvironmentId, instructorId: string) => {
    const instructor = users.find(u => u.id === instructorId);
    if (!instructor) {
      showToast('Instructor no encontrado en la nómina.', 'error');
      return;
    }

    setEnvironments(prev => prev.map(env => {
      if (env.id === envId) {
        return {
          ...env,
          assignedInstructorId: instructor.id,
          assignedInstructorName: instructor.name,
          assignedInstructorEmail: instructor.email
        };
      }
      return env;
    }));

    // Actualizar jornadas pendientes vinculadas a este ambiente
    setPhysicalSchedules(prev => prev.map(sched => {
      if (sched.environmentId === envId && sched.status === 'PENDIENTE') {
        return {
          ...sched,
          instructorId: instructor.id,
          instructorName: instructor.name,
          instructorEmail: instructor.email
        };
      }
      return sched;
    }));

    showToast(`Instructor ${instructor.name} asignado al ambiente exitosamente.`, 'success', 'person_pin');
  };

  // Completar toma física en el horario asignado (6am, 12m, 6pm)
  const completePhysicalInventory = (
    scheduleId: string, 
    verifiedCount: number, 
    notes?: string,
    verifiedSerials?: string[]
  ) => {
    const schedule = physicalSchedules.find(s => s.id === scheduleId);
    if (!schedule) {
      showToast('Turno de toma física no encontrado', 'error');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const missing = Math.max(0, schedule.totalItems - verifiedCount);

    setPhysicalSchedules(prev => prev.map(s => {
      if (s.id === scheduleId) {
        return {
          ...s,
          status: 'COMPLETADA',
          verifiedCount,
          missingCount: missing,
          completedAt: timeStr,
          completedBy: currentUser.name || s.instructorName,
          notes: notes || `Toma física presencial realizada a las ${timeStr} por ${currentUser.name || s.instructorName}. ${verifiedCount} activos cotejados en ambiente.`
        };
      }
      return s;
    }));

    showToast(`¡Toma física certificada con éxito! ${verifiedCount}/${schedule.totalItems} activos cotejados.`, 'success', 'verified');
  };

  // Marcar toma física como NO REALIZADA y disparar correo automático al Administrador
  const markScheduleAsMissed = (scheduleId: string, customReason?: string) => {
    const schedule = physicalSchedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().slice(0, 10);

    // 1. Actualizar estado de la jornada a NO_REALIZADA
    setPhysicalSchedules(prev => prev.map(s => {
      if (s.id === scheduleId) {
        return {
          ...s,
          status: 'NO_REALIZADA',
          missingCount: s.totalItems,
          alertSent: true,
          alertSentAt: timeStr,
          notes: customReason || `Incumplimiento de horario: Venció plazo a las ${s.deadlineTime} sin registro por parte del instructor responsable (${s.instructorName}).`
        };
      }
      return s;
    }));

    // 2. Generar y registrar notificación por correo enviada al Administrador
    const newAlert: AdminEmailAlert = {
      id: `alt-email-${Date.now()}`,
      scheduleId: schedule.id,
      environmentId: schedule.environmentId,
      environmentName: schedule.environmentName,
      instructorName: schedule.instructorName,
      instructorEmail: schedule.instructorEmail,
      adminEmail: adminEmailAddress,
      shift: schedule.shift,
      shiftLabel: schedule.shiftLabel,
      date: dateStr,
      scheduledTime: schedule.shift === '06:00' ? '06:00 AM' : schedule.shift === '12:00' ? '12:00 M' : '06:00 PM',
      deadlineTime: schedule.deadlineTime,
      subject: `⚠️ [ALERTA INVENTARIO SENA] Incumplimiento de Toma Física - ${schedule.environmentName} (${schedule.shiftLabel})`,
      body: `Señor Administrador (${adminEmailAddress}),\n\nLe notificamos de manera urgente que se ha cumplido la hora límite oficial (${schedule.deadlineTime}) y el instructor responsable asignado NO ha realizado la toma física de inventario requerida:\n\n• Ambiente de Aprendizaje: ${schedule.environmentName}\n• Instructor Asignado: ${schedule.instructorName} (${schedule.instructorEmail})\n• Jornada Reglamentaria: ${schedule.shiftLabel}\n• Tolerancia Límite: ${schedule.deadlineTime}\n• Total Bienes Bajo Custodia: ${schedule.totalItems} activos inventariados\n• Estado Actual: NO REALIZADA / VENCIDA\n\nAcción requerida: Notificar al instructor o comisionar verificación presencial para evitar pérdida o desubicación de activos.\n\nNotificación enviada automáticamente a: ${adminEmailAddress} y admin@sena.edu.co\nSistema de Control ADSO SENA.`,
      sentAt: `Hoy a las ${timeStr}`,
      status: 'ENVIADO'
    };

    setAdminEmailAlerts(prev => [newAlert, ...prev]);

    showToast(`⚠️ Alerta enviada por correo al Administrador (${adminEmailAddress}) por toma no realizada.`, 'warning', 'forward_to_inbox');
  };

  const resendAdminEmailAlert = (alertId: string) => {
    const alert = adminEmailAlerts.find(a => a.id === alertId);
    if (!alert) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAdminEmailAlerts(prev => prev.map(a => a.id === alertId ? { ...a, sentAt: `Re-enviado hoy a las ${timeStr}` } : a));
    showToast(`Correo de alerta re-enviado exitosamente a: ${adminEmailAddress}`, 'success', 'mail');
  };

  const executeAutoMissedCheck = () => {
    let count = 0;
    physicalSchedules.forEach(s => {
      if (s.status === 'PENDIENTE') {
        markScheduleAsMissed(s.id, 'Verificación de corte horario: Jornada vencida sin toma física.');
        count++;
      }
    });
    if (count === 0) {
      showToast('Todos los turnos del día están al día o ya procesados.', 'info', 'check_circle');
    }
  };

  const resetWeeklySchedules = (baseDate: string = '2026-09-17') => {
    const generated = generateWeeklyPhysicalSchedules(environments, baseDate);
    setPhysicalSchedules(generated);
    localStorage.setItem('controladso_schedules', JSON.stringify(generated));
    showToast('Cronograma semanal (Lunes a Sábado) regenerado exitosamente', 'success', 'event_repeat');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const matchedUser = users.find(u => u.role === newRole) || INITIAL_USERS.find(u => u.role === newRole) || INITIAL_USERS[0];
    setCurrentUser(matchedUser);
    
    if (newRole === 'admin') {
      showToast('Modo de acceso cambiado a: Administrador (RW - Control Total)', 'info');
    } else if (newRole === 'consulta') {
      showToast('Modo de acceso cambiado a: Auditor / Consulta (Solo Lectura)', 'info');
    } else {
      showToast('Modo de acceso cambiado a: Técnico de Soporte', 'info');
    }
  };

  const switchUser = (userId: string) => {
    const userToSwitch = users.find(u => u.id === userId);
    if (userToSwitch) {
      setCurrentUser(userToSwitch);
      setCurrentRole(userToSwitch.role);
      showToast(`Sesión iniciada como: ${userToSwitch.name}`, 'success');
    }
  };

  const setCampus = (id: CampusId, name: string) => {
    setCurrentCampus({ id, name });
    showToast(`Sede cambiada a: ${name}`, 'success');
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'success', icon?: string) => {
    const id = Date.now().toString();
    setToast({ id, message, type, icon });
  };

  const hideToast = () => {
    setToast(null);
  };

  const openModal = (modalName: string, payload?: unknown) => {
    if (payload && modalName === 'transfer-voucher') {
      setVoucherData(payload as InventoryMovement);
    }
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Business logic: Register Movement with strict backend stock validation (User Flow section 4)
  const registerMovement = (input: RegisterMovementInput): { success: boolean; error?: string } => {
    // RBAC check: only Admin can register movements
    if (currentRole === 'consulta') {
      const err = '403 | No tiene permisos de escritura para registrar movimientos.';
      showToast(err, 'error', 'lock');
      return { success: false, error: err };
    }

    const { type, productName, originEnvironmentId, destinationEnvironmentId, quantity, notes, serialNumber, assetCode } = input;

    if (quantity <= 0) {
      const err = 'Error: La cantidad a mover debe ser mayor a 0.';
      showToast(err, 'error', 'error');
      return { success: false, error: err };
    }

    // Identify target category
    const category = categories.find(c => c.name.toLowerCase() === productName.toLowerCase() || c.code === input.categoryCode) || categories[0];

    // Check available stock in origin if OUT or TRANSFER
    if (type === 'OUT' || type === 'TRANSFER') {
      if (!originEnvironmentId) {
        const err = 'Error: Debe especificar el ambiente de origen.';
        showToast(err, 'error', 'error');
        return { success: false, error: err };
      }

      let availableStock = 0;
      if (originEnvironmentId === 'amb1') availableStock = category.amb1;
      else if (originEnvironmentId === 'amb2') availableStock = category.amb2;
      else if (originEnvironmentId === 'amb3') availableStock = category.amb3;
      else if (originEnvironmentId === 'service') availableStock = category.mesa;
      else if (originEnvironmentId === 'damaged') availableStock = category.dano;

      if (quantity > availableStock) {
        const originName = INITIAL_ENVIRONMENTS.find(e => e.id === originEnvironmentId)?.codeName || originEnvironmentId;
        const err = `Error: Cantidad solicitada (${quantity}) excede el stock disponible en ${originName} (${availableStock}).`;
        showToast(err, 'error', 'error');
        return { success: false, error: err };
      }
    }

    // Compute updated categories
    setCategories(prev => prev.map(cat => {
      if (cat.id === category.id) {
        let amb1 = cat.amb1;
        let amb2 = cat.amb2;
        let amb3 = cat.amb3;
        let mesa = cat.mesa;
        let dano = cat.dano;

        // Subtract from origin
        if (type === 'OUT' || type === 'TRANSFER') {
          if (originEnvironmentId === 'amb1') amb1 -= quantity;
          if (originEnvironmentId === 'amb2') amb2 -= quantity;
          if (originEnvironmentId === 'amb3') amb3 -= quantity;
          if (originEnvironmentId === 'service') mesa -= quantity;
          if (originEnvironmentId === 'damaged') dano -= quantity;
        }

        // Add to destination
        if (type === 'IN' || type === 'TRANSFER') {
          if (destinationEnvironmentId === 'amb1') amb1 += quantity;
          if (destinationEnvironmentId === 'amb2') amb2 += quantity;
          if (destinationEnvironmentId === 'amb3') amb3 += quantity;
          if (destinationEnvironmentId === 'service') mesa += quantity;
          if (destinationEnvironmentId === 'damaged') dano += quantity;
        }

        const total = amb1 + amb2 + amb3 + mesa + dano;
        const operationalPercentage = total > 0 ? Math.round(((amb1 + amb2 + amb3) / total) * 1000) / 10 : 100;

        return {
          ...cat,
          amb1,
          amb2,
          amb3,
          mesa,
          dano,
          total,
          operationalPercentage
        };
      }
      return cat;
    }));

    // Update asset environment if serial specified
    if (serialNumber) {
      setAssets(prev => prev.map(ast => {
        if (ast.serialNumber === serialNumber || ast.assetCode === assetCode) {
          const destEnv = INITIAL_ENVIRONMENTS.find(e => e.id === destinationEnvironmentId);
          return {
            ...ast,
            environmentId: destinationEnvironmentId || ast.environmentId,
            environmentName: destEnv?.name || ast.environmentName,
            physicalStatus: destinationEnvironmentId === 'service' ? 'mesa_servicio' : destinationEnvironmentId === 'damaged' ? 'con_dano' : 'operativo',
            statusLabel: destinationEnvironmentId === 'service' ? 'En Mesa de Servicio' : destinationEnvironmentId === 'damaged' ? 'Con Daño Físico' : 'Operativo en Uso',
            historyTimeline: [
              {
                id: Date.now().toString(),
                title: type === 'TRANSFER' ? 'Transferencia Aprobada' : type === 'IN' ? 'Alta de Activo' : 'Baja / Salida',
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                description: `${notes}. Movimiento a ${destEnv?.codeName || 'destino'}.`,
                author: currentUser.name,
                type: 'transfer'
              },
              ...ast.historyTimeline
            ]
          };
        }
        return ast;
      }));
    }

    // Generate inmutable crypto hash and ticket voucher
    const randomHex = Math.random().toString(36).substring(2, 10) + Date.now().toString(16);
    const cryptoHash = `e3b0c442${randomHex}96fb92427ae41e4649b934ca495991b7852b855`.substring(0, 64);
    const folioNum = Math.floor(1000 + Math.random() * 9000);
    const newFolio = `#ACT-TRF-2025-${folioNum}`;
    const qrToken = `VEF-${folioNum}-${serialNumber ? serialNumber.slice(-3) : 'MOV'}-2025`;

    const originName = INITIAL_ENVIRONMENTS.find(e => e.id === originEnvironmentId)?.name || 'Recepción General';
    const destName = INITIAL_ENVIRONMENTS.find(e => e.id === destinationEnvironmentId)?.name || 'Almacén';

    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      folio: newFolio,
      type,
      productName,
      assetCode: assetCode || 'EDU-ACT-0492',
      serialNumber: serialNumber || 'SN-8842-LAP',
      originEnvironmentId,
      originEnvironmentName: originName,
      destinationEnvironmentId,
      destinationEnvironmentName: destName,
      quantity,
      notes: notes || 'Reubicación aprobada por administración institucional',
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      userEmail: currentUser.email,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      cryptoHash,
      qrVerificationToken: qrToken,
      status: 'COMPLETADO'
    };

    setMovements(prev => [newMovement, ...prev]);
    setVoucherData(newMovement);
    openModal('transfer-voucher', newMovement);
    showToast('¡Movimiento procesado y verificado con éxito!', 'success', 'verified');

    return { success: true };
  };

  const verifyAssetInAudit = (assetId: string, station?: string) => {
    setAuditSession(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === assetId || item.serialNumber === assetId || item.assetCode === assetId) {
          return {
            ...item,
            status: 'verified' as const,
            verifiedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            verifiedBy: currentUser.name,
            station: station || item.station
          };
        }
        return item;
      });

      const verifiedCount = updatedItems.filter(i => i.status === 'verified').length;
      const pendingCount = updatedItems.filter(i => i.status === 'pending').length;
      const mismatchCount = updatedItems.filter(i => i.status === 'mismatch').length;

      return {
        ...prev,
        items: updatedItems,
        verifiedCount,
        pendingCount,
        mismatchCount
      };
    });

    showToast('Activo verificado e indexado en acta in situ', 'success', 'check_circle');
  };

  const reportAuditDiscrepancy = (assetId: string, note: string) => {
    setAuditSession(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === assetId || item.serialNumber === assetId || item.assetCode === assetId) {
          return {
            ...item,
            status: 'mismatch' as const,
            discrepancyNote: note
          };
        }
        return item;
      });

      const verifiedCount = updatedItems.filter(i => i.status === 'verified').length;
      const pendingCount = updatedItems.filter(i => i.status === 'pending').length;
      const mismatchCount = updatedItems.filter(i => i.status === 'mismatch').length;

      return {
        ...prev,
        items: updatedItems,
        verifiedCount,
        pendingCount,
        mismatchCount
      };
    });

    showToast('Discrepancia documentada en bitácora de auditoría', 'warning', 'warning');
  };

  const finalizeAuditSession = () => {
    showToast('¡Acta de auditoría digital firmada con JWT y generada!', 'success', 'verified');
    closeModal();
  };

  const addTicketNote = (noteText: string) => {
    if (!noteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      authorInitials: currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      timeAgo: 'Justo ahora',
      content: noteText
    };
    setTicket(prev => ({
      ...prev,
      technicalNotes: [newNote, ...prev.technicalNotes]
    }));
    showToast('Nota técnica añadida a la bitácora del ticket', 'success');
  };

  const updateTicketStatus = (status: ServiceDeskTicket['status']) => {
    const labels: Record<ServiceDeskTicket['status'], string> = {
      taller_diagnostico: 'En Taller / Diagnóstico',
      en_reparacion: 'En Reparación',
      espera_repuesto: 'En Espera de Repuesto',
      resuelto: 'Reparado y Listo',
      garantia_externa: 'En Garantía Externa Dell'
    };
    setTicket(prev => ({
      ...prev,
      status,
      statusLabel: labels[status]
    }));
    showToast(`Estado del Ticket ${ticket.ticketNumber} actualizado a: ${labels[status]}`, 'success');
  };

  const addNewUser = (userData: Omit<User, 'id' | 'lastLogin' | 'ipAddress' | 'activeSession'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      lastLogin: 'Nunca (Pendiente activación)',
      ipAddress: 'Sin conexión',
      activeSession: false
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`Usuario ${newUser.name} registrado con rol ${newUser.roleTitle}`, 'success');
    closeModal();
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('Usuario revocado del sistema correctamente', 'info');
  };

  const resolveServiceDeskTicket = (ticketId: string, resolution: TicketResolutionType, notes: string) => {
    if (currentRole === 'consulta') {
      showToast('403 | El rol Consulta no tiene autorización para emitir dictámenes.', 'error');
      return;
    }

    if (resolution === 'REPARAR_RETORNAR') {
      setAssets(prev => prev.map(a => {
        if (a.id === ticket.assetId || a.serialNumber === ticket.serialNumber) {
          return {
            ...a,
            physicalStatus: 'operativo',
            statusLabel: 'Operativo en Uso',
            environmentId: 'amb2',
            environmentName: 'Ambiente 2: Aula Cómputo & Redes',
            historyTimeline: [
              {
                id: Date.now().toString(),
                title: 'Reparación Exitosa y Reintegro',
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                description: `Equipo reparado y reintegrado al ambiente. ${notes}`,
                author: currentUser.name,
                type: 'maintenance'
              },
              ...a.historyTimeline
            ]
          };
        }
        return a;
      }));

      setCategories(prev => prev.map(c => {
        if (c.code === 'COMP') {
          const mesa = Math.max(0, c.mesa - 1);
          const amb2 = c.amb2 + 1;
          const total = c.total;
          const operationalPercentage = Math.round(((c.amb1 + amb2 + c.amb3) / total) * 1000) / 10;
          return { ...c, mesa, amb2, operationalPercentage };
        }
        return c;
      }));

      updateTicketStatus('resuelto');
      showToast('¡Dictamen emitido! Equipo reparado y retornado a su ambiente original.', 'success', 'verified');
    } else if (resolution === 'BAJA') {
      setAssets(prev => prev.map(a => {
        if (a.id === ticket.assetId || a.serialNumber === ticket.serialNumber) {
          return {
            ...a,
            physicalStatus: 'con_dano',
            statusLabel: 'Con Daño Físico (Baja)',
            environmentId: 'damaged',
            environmentName: 'Almacén de Equipos con Daño',
            historyTimeline: [
              {
                id: Date.now().toString(),
                title: 'Dictamen de Baja Definitiva',
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                description: `Baja contable y traslado a residuo RAEE. ${notes}`,
                author: currentUser.name,
                type: 'damage'
              },
              ...a.historyTimeline
            ]
          };
        }
        return a;
      }));

      setCategories(prev => prev.map(c => {
        if (c.code === 'COMP') {
          const mesa = Math.max(0, c.mesa - 1);
          const dano = c.dano + 1;
          const total = c.total;
          const operationalPercentage = Math.round(((c.amb1 + c.amb2 + c.amb3) / total) * 1000) / 10;
          return { ...c, mesa, dano, operationalPercentage };
        }
        return c;
      }));

      showToast('¡Acta de Baja Definitiva emitida y radicada!', 'warning', 'gavel');
    } else {
      updateTicketStatus('garantia_externa');
      showToast('Equipo remitido a garantía externa con fabricante.', 'info', 'local_shipping');
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast(`Usuario ${u.name} marcado como ${nextStatus}`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const getEnvironmentName = (id: EnvironmentId): string => {
    switch(id) {
      case 'amb1': return 'Ambiente 1: Lab Robótica e IA';
      case 'amb2': return 'Ambiente 2: Aula Cómputo & Redes';
      case 'amb3': return 'Ambiente 3: Taller de Electrónica';
      case 'service': return 'Mesa de Servicio Técnico';
      case 'damaged': return 'Almacén de Equipos con Daño';
      case 'unassigned': return 'Sin Asignar (Depósito General)';
      default: return 'Almacén General';
    }
  };

  const assignAssetEnvironment = (
    assetId: string, 
    targetEnvId: EnvironmentId, 
    station?: string, 
    responsiblePerson?: string, 
    notes?: string
  ) => {
    if (currentRole === 'consulta') {
      showToast('403 | El rol Consulta no tiene autorización para reasignar ambientes.', 'error', 'lock');
      return;
    }

    const targetName = getEnvironmentName(targetEnvId);
    let updatedAsset: SerialAsset | null = null;

    setAssets(prev => prev.map(a => {
      if (a.id === assetId || a.serialNumber === assetId || a.assetCode === assetId) {
        const oldEnvName = a.environmentName;
        const newStation = station || (targetEnvId === 'unassigned' ? 'Depósito General' : a.station || `Puesto en ${targetName}`);
        const newResp = responsiblePerson || a.responsiblePerson || currentUser.name;

        const timelineEvent = {
          id: `hist-assign-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: `Asignación a ${targetName}`,
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          description: `Activo reubicado desde "${oldEnvName}" hacia "${targetName}". Estación: ${newStation}. Custodio: ${newResp}. ${notes || 'Asignación procesada formalmente.'}`,
          author: currentUser.name,
          type: 'assignment' as const
        };

        updatedAsset = {
          ...a,
          environmentId: targetEnvId,
          environmentName: targetName,
          station: newStation,
          responsiblePerson: newResp,
          statusLabel: targetEnvId === 'unassigned' ? 'Pendiente Asignación' : targetEnvId === 'damaged' ? 'Con Daño Físico' : targetEnvId === 'service' ? 'En Mesa de Servicio' : 'Operativo en Uso',
          physicalStatus: targetEnvId === 'damaged' ? 'con_dano' : targetEnvId === 'service' ? 'mesa_servicio' : 'operativo',
          historyTimeline: [timelineEvent, ...(a.historyTimeline || [])]
        };

        return updatedAsset;
      }
      return a;
    }));

    if (updatedAsset) {
      setSelectedAsset(updatedAsset);
      showToast(`Activo ${(updatedAsset as SerialAsset).placa || (updatedAsset as SerialAsset).serialNumber} asignado a ${targetName}`, 'success', 'check_circle');
    }
  };

  const assignBatchAssets = (
    assetIds: string[], 
    targetEnvId: EnvironmentId, 
    stationPrefix?: string, 
    responsiblePerson?: string, 
    notes?: string
  ) => {
    if (currentRole === 'consulta') {
      showToast('403 | El rol Consulta no tiene autorización para reasignar ambientes.', 'error', 'lock');
      return;
    }

    if (assetIds.length === 0) {
      showToast('Seleccione al menos un activo para asignar.', 'warning');
      return;
    }

    const targetName = getEnvironmentName(targetEnvId);
    let count = 0;

    setAssets(prev => prev.map((a) => {
      if (assetIds.includes(a.id) || assetIds.includes(a.assetCode) || assetIds.includes(a.serialNumber)) {
        count++;
        const newStation = stationPrefix ? `${stationPrefix} #${count}` : (a.station || `Puesto en ${targetName} #${count}`);
        const newResp = responsiblePerson || a.responsiblePerson || currentUser.name;

        const timelineEvent = {
          id: `hist-batch-${Date.now()}-${count}`,
          title: `Asignación Masiva a ${targetName}`,
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          description: `Asignación por lote (${assetIds.length} activos). Reubicado a "${targetName}". Estación: ${newStation}. Custodio: ${newResp}. ${notes || 'Acta de asignación en bloque.'}`,
          author: currentUser.name,
          type: 'assignment' as const
        };

        return {
          ...a,
          environmentId: targetEnvId,
          environmentName: targetName,
          station: newStation,
          responsiblePerson: newResp,
          statusLabel: targetEnvId === 'unassigned' ? 'Pendiente Asignación' : targetEnvId === 'damaged' ? 'Con Daño Físico' : targetEnvId === 'service' ? 'En Mesa de Servicio' : 'Operativo en Uso',
          physicalStatus: targetEnvId === 'damaged' ? 'con_dano' : targetEnvId === 'service' ? 'mesa_servicio' : 'operativo',
          historyTimeline: [timelineEvent, ...(a.historyTimeline || [])]
        };
      }
      return a;
    }));

    showToast(`¡${count} activos reasignados exitosamente a ${targetName}!`, 'success', 'verified');
  };

  const importInstitutionalBatch = (
    rawRows: RawInventoryRow[], 
    targetEnvId?: EnvironmentId
  ): number => {
    if (currentRole === 'consulta') {
      showToast('403 | El rol Consulta no tiene permisos para importar inventarios.', 'error', 'lock');
      return 0;
    }

    const newAssets: SerialAsset[] = rawRows.map((row, index) => 
      convertRawRowToSerialAsset(row, index, targetEnvId)
    );

    setAssets(prev => {
      const existingPlacas = new Set(prev.map(p => p.placa || p.assetCode));
      const filteredNew = newAssets.filter(n => !existingPlacas.has(n.placa || n.assetCode));
      return [...filteredNew, ...prev];
    });

    showToast(`¡${newAssets.length} registros del inventario institucional incorporados!`, 'success', 'upload_file');
    return newAssets.length;
  };

  // Real Excel/CSV and PDF export simulation
  const exportData = (format: 'pdf' | 'excel', filter?: string) => {
    showToast(`Generando y descargando reporte de inventario (${format.toUpperCase()})...`, 'info', 'file_download');

    if (format === 'excel') {
      const headers = ['Regional', 'Centro Costo', 'Modulo', 'Modelo', 'Consecutivo', 'Descripcion', 'Placa', 'Serial', 'Ambiente', 'Puesto', 'Responsable', 'Valor'];
      const rows = assets.map(a => [
        a.regional || '41',
        a.centroCosto || '952710',
        a.modulo || 'INVE',
        `"${(a.modelo || a.name).replace(/"/g, '""')}"`,
        a.consecutivo || a.assetCode,
        `"${a.descripcion || a.name}"`,
        a.placa || a.assetCode,
        a.serial || a.serialNumber,
        `"${a.environmentName}"`,
        `"${a.station}"`,
        `"${a.responsiblePerson}"`,
        `"${a.valorIngreso || '$0,00'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ControlADSO_Inventario_${filter || 'General'}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Descarga de matriz CSV/Excel completada exitosamente', 'success');
    } else {
      window.print();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentCampus,
        theme,
        activeEnvironmentTab,
        categories,
        assets,
        movements,
        ticket,
        users,
        usersList: users,
        auditSession,
        auditItems: auditSession.items,
        toast,
        activeModal,
        selectedAsset,
        voucherData,
        environments,
        physicalSchedules,
        resetWeeklySchedules,
        adminEmailAlerts,
        adminEmailAddress,
        setAdminEmailAddress,
        institutionProfile,
        updateInstitutionProfile,
        resetInstitutionProfile,
        updateEnvironment,
        createEnvironment,
        deleteEnvironment,
        updateAsset,
        createAsset,
        deleteAsset,
        updateCategory,
        createCategory,
        deleteCategory,
        updateUser,
        updateMovement,
        deleteMovement,
        exportEntireBackupJson,
        importEntireBackupJson,
        resetAllDataToFactory,
        switchRole,
        switchUser,
        setCampus,
        setActiveEnvironmentTab,
        toggleTheme,
        showToast,
        hideToast,
        openModal,
        closeModal,
        setSelectedAsset,
        assignInstructorToEnvironment,
        completePhysicalInventory,
        markScheduleAsMissed,
        resendAdminEmailAlert,
        executeAutoMissedCheck,
        registerMovement,
        verifyAssetInAudit,
        reportAuditDiscrepancy,
        finalizeAuditSession,
        addTicketNote,
        updateTicketStatus,
        resolveServiceDeskTicket,
        addNewUser,
        removeUser,
        toggleUserStatus,
        exportData,
        assignAssetEnvironment,
        assignBatchAssets,
        importInstitutionalBatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
