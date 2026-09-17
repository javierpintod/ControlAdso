export type UserRole = 'admin' | 'consulta' | 'tecnico';

export type EnvironmentId = 'all' | 'amb1' | 'amb2' | 'amb3' | 'service' | 'damaged' | 'unassigned' | (string & {});

export interface InstitutionProfile {
  name: string;             // e.g. "SENA - Servicio Nacional de Aprendizaje"
  shortName: string;        // e.g. "SENA"
  centerName: string;       // e.g. "Centro de Servicios y Gestión Empresarial"
  regional: string;         // e.g. "Regional Antioquia"
  nit: string;              // e.g. "899.999.034-1"
  address: string;          // e.g. "Calle 51 # 57-70"
  city: string;             // e.g. "Medellín, Colombia"
  phone: string;            // e.g. "+57 (604) 576-0000"
  email: string;            // e.g. "contacto@sena.edu.co"
  website: string;          // e.g. "www.sena.edu.co"
  slogan: string;           // e.g. "Conocimiento y Oportunidad para Todos los Colombianos"
  adminContact: string;     // e.g. "Javier Pinto - Administrador de Inventarios"
  systemName: string;       // e.g. "EduStock"
  systemSubtitle: string;   // e.g. "Sistema de Gestión y Control Físico de Inventarios"
  logoIcon: string;         // e.g. "account_balance"
}

export type CampusId = 'central' | 'norte' | 'sur';

export type MovementType = 'IN' | 'OUT' | 'TRANSFER';

export type TicketResolutionType = 'REPARAR_RETORNAR' | 'GARANTIA_EXTERNA' | 'BAJA';

export type AssetPhysicalStatus = 
  | 'operativo' 
  | 'mesa_servicio' 
  | 'con_dano' 
  | 'mantenimiento' 
  | 'decomisado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  authorizedEnvironments: string[];
  lastLogin: string;
  ipAddress: string;
  activeSession: boolean;
  status: 'active' | 'suspended';
  avatar?: string;
}

export interface Environment {
  id: EnvironmentId;
  name: string;
  codeName: string;
  building: string;
  floor: string;
  icon: string;
  totalCapacity: number;
  assignedCount: number;
  occupancyPercentage: number;
  assignedInstructorId?: string;
  assignedInstructorName?: string;
  assignedInstructorEmail?: string;
  categoryBreakdown: {
    computo: number;
    robotica: number;
    electronica: number;
    herramientas: number;
  };
}

export type ShiftType = '06:00' | '12:00' | '18:00';

export interface PhysicalInventorySchedule {
  id: string;
  environmentId: EnvironmentId;
  environmentName: string;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  shiftLabel: string;
  deadlineTime: string; // e.g. "06:30 AM", "12:30 PM", "06:30 PM"
  status: 'PENDIENTE' | 'COMPLETADA' | 'NO_REALIZADA';
  totalItems: number;
  verifiedCount: number;
  missingCount: number;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  alertSent: boolean;
  alertSentAt?: string;
}

export interface AdminEmailAlert {
  id: string;
  scheduleId: string;
  environmentId: EnvironmentId;
  environmentName: string;
  instructorName: string;
  instructorEmail: string;
  adminEmail: string;
  shift: ShiftType;
  shiftLabel: string;
  date: string;
  scheduledTime: string;
  deadlineTime: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'ENVIADO' | 'PENDIENTE';
}

export interface ProductCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  amb1: number;
  amb2: number;
  amb3: number;
  mesa: number;
  dano: number;
  total: number;
  operationalPercentage: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface SerialAsset {
  id: string;
  // Campos Oficiales del Registro Institucional de Inventario
  regional?: string;          // Ej: "41"
  centroCosto?: string;       // Ej: "952710", "101041"
  modulo?: string;            // Ej: "INVE"
  modelo?: string;            // Ej: "PROBOOK 445R G6", "CS-24A"
  consecutivo?: string;       // Ej: "297419"
  descripcion?: string;       // Ej: "COMPUTADOR PORTATIL", "AIRE ACONDICIONADO"
  descripcionActual?: string; // Ficha técnica completa del bien
  tipo?: string;              // Ej: "4"
  placa?: string;             // Ej: "95271024071" (Placa SENA)
  serial?: string;            // Ej: "5CD0037S7T"
  fechaAdquisicion?: string;  // Ej: "08/06/2020"
  valorIngreso?: string;      // Ej: "$1.766.042,14"

  // Mapeo Central del Sistema
  serialNumber: string;
  assetCode: string;
  name: string;
  description: string;
  category: string;
  environmentId: EnvironmentId;
  environmentName: string;
  station: string;
  physicalStatus: AssetPhysicalStatus;
  statusLabel: string;
  responsiblePerson: string;
  assignedDate: string;
  warrantyUntil: string;
  barcode: string;
  qrToken: string;
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    connectivity?: string;
    notes?: string;
  };
  photoUrl: string;
  historyTimeline: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    author: string;
    type: 'assignment' | 'maintenance' | 'transfer' | 'registration' | 'damage';
  }[];
}

export interface InventoryMovement {
  id: string;
  folio: string;
  type: MovementType;
  productId?: string;
  productName: string;
  assetCode?: string;
  serialNumber?: string;
  originEnvironmentId?: EnvironmentId;
  originEnvironmentName?: string;
  destinationEnvironmentId?: EnvironmentId;
  destinationEnvironmentName: string;
  quantity: number;
  notes: string;
  userName: string;
  userRole: string;
  userEmail: string;
  timestamp: string;
  cryptoHash: string;
  qrVerificationToken: string;
  status: 'COMPLETADO' | 'PENDIENTE' | 'RECHAZADO';
}

export interface ServiceDeskTicket {
  id: string;
  ticketNumber: string; // e.g. #TK-4091
  folio?: string;
  title?: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  serialNumber: string;
  priority: 'critica' | 'alta' | 'media' | 'baja';
  priorityLabel: string;
  status: 'taller_diagnostico' | 'en_reparacion' | 'espera_repuesto' | 'resuelto' | 'garantia_externa';
  statusLabel: string;
  slaHoursLeft: number;
  totalSlaHours: number;
  originEnvironment: string;
  environmentName?: string;
  currentCustodyLocation: string;
  receivedBy: string;
  reporterName: string;
  reporterDate: string;
  createdAt?: string;
  declaredSymptom: string;
  diagnosticNotes?: string;
  repairCostEstimate?: string;
  technicianName?: string;
  evidencePhotoUrl: string;
  evidencePhotoGps: string;
  evidenceSize: string;
  timelineSteps: {
    stepNumber: number;
    title: string;
    time: string;
    assignedTo: string;
    status: 'completed' | 'current' | 'pending';
    note?: string;
  }[];
  technicalNotes: {
    id: string;
    author: string;
    authorInitials: string;
    timeAgo: string;
    content: string;
  }[];
}

export interface AuditItem {
  id: string;
  serialNumber: string;
  assetCode: string;
  name: string;
  station: string;
  sheetNumber: string;
  category: string;
  status: 'verified' | 'pending' | 'mismatch';
  verifiedAt?: string;
  verifiedBy?: string;
  discrepancyNote?: string;
}

export interface AuditSession {
  isActive: boolean;
  environmentId: EnvironmentId;
  environmentName: string;
  building: string;
  totalItems: number;
  verifiedCount: number;
  pendingCount: number;
  mismatchCount: number;
  startedAt: string;
  auditorName: string;
  items: AuditItem[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  subMessage?: string;
  icon?: string;
}
