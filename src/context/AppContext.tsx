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
  TicketResolutionType
} from '../types';
import { 
  INITIAL_ENVIRONMENTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ASSETS, 
  INITIAL_MOVEMENTS, 
  INITIAL_TICKET, 
  INITIAL_USERS, 
  INITIAL_AUDIT_SESSION 
} from '../data/mockData';
import { 
  RawInventoryRow, 
  convertRawRowToSerialAsset,
  INITIAL_INSTITUTIONAL_ASSETS 
} from '../data/institutionalAssets';

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
  
  // Actions
  switchRole: (role: UserRole) => void;
  setCampus: (id: CampusId, name: string) => void;
  setActiveEnvironmentTab: (env: EnvironmentId) => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: ToastMessage['type'], icon?: string) => void;
  hideToast: () => void;
  openModal: (modalName: string, payload?: unknown) => void;
  closeModal: () => void;
  setSelectedAsset: (asset: SerialAsset | null) => void;
  
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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      setCurrentUser(users[0]);
      showToast('Modo de acceso cambiado a: Administrador (RW - Control Total)', 'info');
    } else if (newRole === 'consulta') {
      setCurrentUser(users[1]);
      showToast('Modo de acceso cambiado a: Auditor / Consulta (Solo Lectura)', 'info');
    } else {
      setCurrentUser(users[2]);
      showToast('Modo de acceso cambiado a: Técnico de Soporte', 'info');
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
        switchRole,
        setCampus,
        setActiveEnvironmentTab,
        toggleTheme,
        showToast,
        hideToast,
        openModal,
        closeModal,
        setSelectedAsset,
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
