import { 
  ProductCategory, 
  SerialAsset, 
  InventoryMovement, 
  ServiceDeskTicket, 
  User, 
  AuditSession,
  Environment 
} from '../types';
import { INITIAL_INSTITUTIONAL_ASSETS } from './institutionalAssets';

export const INITIAL_ENVIRONMENTS: Environment[] = [
  {
    id: 'amb1',
    name: 'Ambiente 1: Lab Robótica e IA',
    codeName: 'Lab Robótica & IA',
    building: 'Pabellón Tecnológico B',
    floor: 'Piso 2',
    icon: 'precision_manufacturing',
    totalCapacity: 30,
    assignedCount: 19,
    occupancyPercentage: 63,
    categoryBreakdown: { computo: 8, robotica: 4, electronica: 2, herramientas: 5 }
  },
  {
    id: 'amb2',
    name: 'Ambiente 2: Aula Cómputo & Redes',
    codeName: 'Aula Cómputo & Redes',
    building: 'Pabellón Central A',
    floor: 'Piso 1',
    icon: 'lan',
    totalCapacity: 35,
    assignedCount: 25,
    occupancyPercentage: 71,
    categoryBreakdown: { computo: 18, robotica: 0, electronica: 5, herramientas: 2 }
  },
  {
    id: 'amb3',
    name: 'Ambiente 3: Taller de Electrónica',
    codeName: 'Taller de Electrónica',
    building: 'Pabellón Industrial C',
    floor: 'Planta Baja',
    icon: 'memory',
    totalCapacity: 20,
    assignedCount: 11,
    occupancyPercentage: 55,
    categoryBreakdown: { computo: 0, robotica: 0, electronica: 9, herramientas: 2 }
  },
  {
    id: 'service',
    name: 'Mesa de Servicio & Diagnóstico',
    codeName: 'Mesa de Servicio',
    building: 'Nivel 2 Soporte',
    floor: 'Banco #02',
    icon: 'support_agent',
    totalCapacity: 10,
    assignedCount: 4,
    occupancyPercentage: 40,
    categoryBreakdown: { computo: 3, robotica: 0, electronica: 1, herramientas: 0 }
  },
  {
    id: 'damaged',
    name: 'Almacén de Dañados / Bajas',
    codeName: 'Almacén de Dañados',
    building: 'Sótano Técnico',
    floor: 'Estante D',
    icon: 'warning',
    totalCapacity: 10,
    assignedCount: 2,
    occupancyPercentage: 20,
    categoryBreakdown: { computo: 1, robotica: 0, electronica: 1, herramientas: 0 }
  }
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-port',
    code: 'CAT-PORT-01',
    name: 'Computadores Portátiles',
    description: 'HP ProBook 445R G6 Ryzen 7, Dell Precision 3551 Xeon, MacBook Pro Core i9',
    icon: 'laptop_chromebook',
    amb1: 8,
    amb2: 7,
    amb3: 0,
    mesa: 1,
    dano: 1,
    total: 18,
    operationalPercentage: 88.9,
    status: 'ok'
  },
  {
    id: 'cat-aio',
    code: 'CAT-AIO-02',
    name: 'Computadores All-In-One (AIO)',
    description: 'HP Pro One 440 G9 i7 (2025), Dell OptiPlex 7470AIO, HP Pro One 400',
    icon: 'desktop_windows',
    amb1: 0,
    amb2: 6,
    amb3: 0,
    mesa: 1,
    dano: 0,
    total: 12,
    operationalPercentage: 91.7,
    status: 'ok'
  },
  {
    id: 'cat-cpu',
    code: 'CAT-CPU-03',
    name: 'Workstations & CPUs Desktop',
    description: 'Dell Precision 3440 Core i7 2TB Workstations',
    icon: 'developer_board',
    amb1: 0,
    amb2: 5,
    amb3: 0,
    mesa: 1,
    dano: 0,
    total: 6,
    operationalPercentage: 83.3,
    status: 'ok'
  },
  {
    id: 'cat-mon',
    code: 'CAT-MON-04',
    name: 'Monitores & Pantallas Interactivas',
    description: 'Dell P2219H 21.5", Samsung MD55C 55", One Screen Gráfica Interactiva',
    icon: 'monitor',
    amb1: 1,
    amb2: 4,
    amb3: 0,
    mesa: 0,
    dano: 0,
    total: 5,
    operationalPercentage: 100.0,
    status: 'ok'
  },
  {
    id: 'cat-clim',
    code: 'CAT-CLIM-05',
    name: 'Climatización & Aires Acondicionados',
    description: 'Piso Techo LAC060 60000 BTU, Mini Split CS-24A 24000 BTU',
    icon: 'mode_fan',
    amb1: 1,
    amb2: 1,
    amb3: 2,
    mesa: 0,
    dano: 1,
    total: 5,
    operationalPercentage: 80.0,
    status: 'warning'
  },
  {
    id: 'cat-tab',
    code: 'CAT-TAB-06',
    name: 'Tabletas Digitalizadoras & Tablets',
    description: 'Wacom One DTC133 13.3", Samsung Galaxy Tab 2 P5110',
    icon: 'tablet_mac',
    amb1: 0,
    amb2: 0,
    amb3: 4,
    mesa: 0,
    dano: 0,
    total: 4,
    operationalPercentage: 100.0,
    status: 'ok'
  },
  {
    id: 'cat-sim',
    code: 'CAT-SIM-07',
    name: 'Realidad Virtual, Simulación & Gaming',
    description: 'HP OMEN Plataforma Simulación, HP OMEN CPU Gamer, Casco VR HTC Vive, Xbox One',
    icon: 'sports_esports',
    amb1: 4,
    amb2: 0,
    amb3: 0,
    mesa: 0,
    dano: 0,
    total: 4,
    operationalPercentage: 100.0,
    status: 'ok'
  },
  {
    id: 'cat-per',
    code: 'CAT-PER-08',
    name: 'Biometría & Lectores de Código de Barras',
    description: 'Escáneres de Huella Digital 4500 USB, Lectores Symbol LS2208 Láser',
    icon: 'fingerprint',
    amb1: 0,
    amb2: 0,
    amb3: 3,
    mesa: 1,
    dano: 0,
    total: 4,
    operationalPercentage: 75.0,
    status: 'ok'
  },
  {
    id: 'cat-mob',
    code: 'CAT-MOB-09',
    name: 'Mobiliario Institucional',
    description: 'Sillas Ergonómicas y Apilables, Mesas de Trabajo, Lockers Metálicos, Tableros',
    icon: 'chair',
    amb1: 5,
    amb2: 2,
    amb3: 0,
    mesa: 0,
    dano: 0,
    total: 8,
    operationalPercentage: 100.0,
    status: 'ok'
  },
  {
    id: 'cat-pwr',
    code: 'CAT-PWR-10',
    name: 'Potencia (UPS) & Impresión Láser',
    description: 'UPS Servidores 5400VA UPO22-RT AX 5400, Impresora Láser B730',
    icon: 'bolt',
    amb1: 0,
    amb2: 0,
    amb3: 2,
    mesa: 0,
    dano: 0,
    total: 2,
    operationalPercentage: 100.0,
    status: 'ok'
  }
];

// ÚNICA Y EXCLUSIVAMENTE LOS ACTIVOS INSTITUCIONALES PROPORCIONADOS POR EL USUARIO
export const INITIAL_ASSETS: SerialAsset[] = INITIAL_INSTITUTIONAL_ASSETS;

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-001',
    folio: '#MOV-SENA-2025-001',
    type: 'TRANSFER',
    productName: 'HP ProBook 445R G6 Ryzen 7 16GB 512GB SSD',
    assetCode: '95271024071',
    serialNumber: '5CD0037S7T',
    originEnvironmentId: 'amb1',
    originEnvironmentName: 'Ambiente 1: Lab Robótica e IA',
    destinationEnvironmentId: 'amb2',
    destinationEnvironmentName: 'Ambiente 2: Aula Cómputo & Redes',
    quantity: 1,
    notes: 'Reasignación temporal para sesión de desarrollo ADSO - Regional 41',
    userName: 'Carlos Mendoza',
    userRole: 'Administrador (Admin)',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: 'Hoy 09:15:30',
    cryptoHash: 'a89c2049e7b1a238fb012f4590c88b7123984eaf89104b2a8d11c01e765ba391',
    qrVerificationToken: 'QR-SENA-95271024071',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-002',
    folio: '#MOV-SENA-2025-002',
    type: 'TRANSFER',
    productName: 'Workstation Dell Precision 3440 Core i7 2TB',
    assetCode: '95271024606',
    serialNumber: '6LJYH63',
    originEnvironmentId: 'amb2',
    originEnvironmentName: 'Ambiente 2: Aula Cómputo & Redes',
    destinationEnvironmentId: 'service',
    destinationEnvironmentName: 'Mesa de Servicio & Diagnóstico',
    quantity: 1,
    notes: 'Ingreso a diagnóstico por sobretensión en fuente de poder conmutable',
    userName: 'Prof. Carlos Mendoza',
    userRole: 'Docente Titular',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: 'Ayer 15:40:10',
    cryptoHash: '7b293847ac012849e71029348bcad01293847102938471928347109283471029',
    qrVerificationToken: 'QR-SENA-95271024606',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-003',
    folio: '#MOV-SENA-2025-003',
    type: 'OUT',
    productName: 'Aire Acondicionado Mini Split 24000 BTU CS-24A',
    assetCode: '95271022765',
    serialNumber: '0426',
    originEnvironmentId: 'amb3',
    originEnvironmentName: 'Ambiente 3: Taller de Electrónica',
    destinationEnvironmentId: 'damaged',
    destinationEnvironmentName: 'Almacén de Dañados / Bajas',
    quantity: 1,
    notes: 'Baja técnica preventiva por fuga de refrigerante y compresor agarrotado. Consecutivo 232794.',
    userName: 'Prof. Alex Arana',
    userRole: 'Docente Titular',
    userEmail: 'alex.arana@edustock.edu',
    timestamp: 'Hace 2 días',
    cryptoHash: '9c81726354ab0192837465ef0192837465ab0192837465ef0192837465ab0192',
    qrVerificationToken: 'QR-SENA-95271022765',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-004',
    folio: '#ALTA-SENA-2025-010',
    type: 'IN',
    productName: 'Lote 5 PCs All-In-One HP Pro One 440 G9 i7 (2025)',
    assetCode: '10104118894',
    serialNumber: '8CN4490K77',
    destinationEnvironmentId: 'amb2',
    destinationEnvironmentName: 'Sin Asignar (Depósito General)',
    quantity: 5,
    notes: 'Recepción oficial de activos devolutivos SENA Centro de Costo 101041. Consecutivo 301857.',
    userName: 'Carlos Mendoza',
    userRole: 'Administrador (Admin)',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: '28 Feb 2025',
    cryptoHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    qrVerificationToken: 'QR-SENA-10104118894',
    status: 'COMPLETADO'
  }
];

export const INITIAL_TICKET: ServiceDeskTicket = {
  id: 'tk-sena-24606',
  ticketNumber: '#TK-9527-24606',
  folio: '#TKT-SENA-2025-018',
  title: 'Ticket #TKT-SENA-2025-018 • Dell Precision 3440 / Falla de Encendido',
  assetId: 'ast-inst-95271024606',
  assetName: 'CPU Dell Precision 3440 Workstation Core i7 2TB HDD',
  assetCode: '95271024606',
  serialNumber: '6LJYH63',
  priority: 'critica',
  priorityLabel: 'Crítica (P1)',
  status: 'taller_diagnostico',
  statusLabel: 'En Taller / Diagnóstico',
  slaHoursLeft: 28,
  totalSlaHours: 48,
  originEnvironment: 'Ambiente 2: Aula Cómputo & Redes',
  environmentName: 'Ambiente 2: Aula Cómputo & Redes (Puesto 12)',
  currentCustodyLocation: 'Mesa de Servicio Técnico — Banco de Diagnóstico #02',
  receivedBy: 'Ing. Roberto Gómez (Recepción TI)',
  reporterName: 'Prof. Carlos Mendoza',
  reporterDate: '01 Mar 2025, 08:45 AM',
  createdAt: '01 Mar 2025, 08:45 AM',
  declaredSymptom: 'Equipo no enciende tras tormenta eléctrica. LED frontal parpadea en código ámbar 2-4 (Falla de fuente de poder / riel de 12V).',
  diagnosticNotes: 'Fuente de poder de 260W 80 Plus Platinum dañada por pico de voltaje. Se requiere reemplazo de módulo de alimentación interna.',
  repairCostEstimate: '$380.000 COP (Fuente OEM Dell)',
  technicianName: 'Tec. Marcos Peña',
  evidencePhotoUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
  evidencePhotoGps: 'Centro de Costos 952710 - Aula 2 (Piso 1)',
  evidenceSize: '2.8 MB',
  timelineSteps: [
    {
      stepNumber: 1,
      title: 'Ticket Creado & Recepcionado en Taller',
      time: '08:45 AM',
      assignedTo: 'Prof. Carlos Mendoza • Aula Cómputo',
      status: 'completed'
    },
    {
      stepNumber: 2,
      title: 'Precintado e Ingreso a Custodia Técnica',
      time: '09:30 AM',
      assignedTo: 'Ing. Roberto Gómez • Precinto SENA #T-440',
      status: 'completed'
    },
    {
      stepNumber: 3,
      title: 'Diagnóstico de Fuente de Poder & Placa Madre',
      time: '11:15 AM',
      assignedTo: 'Tec. Marcos Peña',
      status: 'current',
      note: 'En curso - Banco de pruebas con fuente regulada'
    },
    {
      stepNumber: 4,
      title: 'Instalación de Repuesto OEM & Limpieza',
      time: 'Pendiente',
      assignedTo: 'En espera de despacho de almacén',
      status: 'pending'
    },
    {
      stepNumber: 5,
      title: 'Pruebas de Estrés & Retorno a Aula Cómputo',
      time: 'Pendiente',
      assignedTo: 'Reincorporación formal a Ambiente 2',
      status: 'pending'
    }
  ],
  technicalNotes: [
    {
      id: 'note-1',
      author: 'Tec. Marcos Peña',
      authorInitials: 'MP',
      timeAgo: 'Hace 30 min',
      content: '“Se confirma que la placa madre y procesador Intel Core i7 están intactos. El daño se restringió a la etapa primaria de la fuente de poder conmutable de 260W. Solicitado repuesto a almacén central.”'
    }
  ]
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@edustock.edu',
    role: 'admin',
    roleTitle: 'Administrador (Admin)',
    authorizedEnvironments: ['Todos (Global)'],
    lastLogin: 'Sesión Actual • cPanel MySQL',
    ipAddress: '192.168.1.104',
    activeSession: true,
    status: 'active'
  },
  {
    id: 'usr-2',
    name: 'Ing. Lucía Vargas',
    email: 'lucia.vargas@edustock.edu',
    role: 'consulta',
    roleTitle: 'Auditor / Consulta (RO)',
    authorizedEnvironments: ['Amb. 1', 'Amb. 3'],
    lastLogin: 'Ayer 18:20',
    ipAddress: '190.84.112.4 • Chrome Win',
    activeSession: false,
    status: 'active'
  },
  {
    id: 'usr-3',
    name: 'Téc. Laura Santos',
    email: 'laura.santos@edustock.edu',
    role: 'tecnico',
    roleTitle: 'Técnico Mesa Servicio',
    authorizedEnvironments: ['Mesa Serv.', 'Amb. 3'],
    lastLogin: 'En línea',
    ipAddress: '192.168.1.58 • Safari Mac',
    activeSession: true,
    status: 'active'
  },
  {
    id: 'usr-4',
    name: 'Prof. Ricardo Salinas',
    email: 'ricardo.salinas@edustock.edu',
    role: 'consulta',
    roleTitle: 'Auditor / Consulta (RO)',
    authorizedEnvironments: ['Amb. 2 Cómputo'],
    lastLogin: 'Hace 3 días',
    ipAddress: '186.31.8.22 • Edge',
    activeSession: false,
    status: 'active'
  },
  {
    id: 'usr-5',
    name: 'Roberto Gómez',
    email: 'roberto.gomez@edustock.edu',
    role: 'tecnico',
    roleTitle: 'Técnico Taller',
    authorizedEnvironments: ['Amb. 1', 'Mesa Serv.'],
    lastLogin: 'Hoy 09:14',
    ipAddress: '192.168.1.77 • Firefox',
    activeSession: true,
    status: 'active'
  },
  {
    id: 'usr-6',
    name: 'Dr. Fernando Silva',
    email: 'fernando.silva@edustock.edu',
    role: 'consulta',
    roleTitle: 'Auditor Externo (RO)',
    authorizedEnvironments: ['Todos (Auditoría)'],
    lastLogin: 'Hace 42 días',
    ipAddress: '181.12.90.11',
    activeSession: false,
    status: 'suspended'
  }
];

export const INITIAL_AUDIT_SESSION: AuditSession = {
  isActive: true,
  environmentId: 'amb1',
  environmentName: 'Ambiente 1: Lab Robótica e IA',
  building: 'Pabellón B • Piso 2',
  totalItems: 19,
  verifiedCount: 15,
  pendingCount: 3,
  mismatchCount: 1,
  startedAt: '10:00 AM',
  auditorName: 'Carlos Mendoza (Admin)',
  items: [
    {
      id: 'aud-1',
      serialNumber: '5CD0037S7T',
      assetCode: '95271024071',
      name: 'HP ProBook 445R G6 Ryzen 7 16GB 512GB SSD',
      station: 'Estación Móvil IA #01',
      sheetNumber: '01',
      category: 'Computadores Portátiles',
      status: 'verified',
      verifiedAt: '10:42 AM',
      verifiedBy: 'Carlos Mendoza'
    },
    {
      id: 'aud-2',
      serialNumber: '5CC7420003',
      assetCode: '952721694',
      name: 'HP OMEN Plataformas de Simulación RV',
      station: 'Zona Inmersiva RV/Simulación',
      sheetNumber: '02',
      category: 'Realidad Virtual, Simulación & Gaming',
      status: 'verified',
      verifiedAt: '10:38 AM',
      verifiedBy: 'Carlos Mendoza'
    },
    {
      id: 'aud-3',
      serialNumber: 'Z7H0HCDDB00830Y',
      assetCode: '952715603',
      name: 'Pantalla Profesional Samsung MD55C 55" LED',
      station: 'Zona de Visualización Central',
      sheetNumber: '03',
      category: 'Monitores & Pantallas Interactivas',
      status: 'verified',
      verifiedAt: '10:30 AM',
      verifiedBy: 'Carlos Mendoza'
    },
    {
      id: 'aud-4',
      serialNumber: 'VR-SENA-001',
      assetCode: '952721703',
      name: 'Casco de Realidad Virtual HTC Vive Pro',
      station: 'Zona Inmersiva RV',
      sheetNumber: '04',
      category: 'Realidad Virtual, Simulación & Gaming',
      status: 'pending'
    },
    {
      id: 'aud-5',
      serialNumber: '3122G05688',
      assetCode: '95271025486',
      name: 'Aire Acondicionado LAC060 60000 BTU Piso Techo',
      station: 'Sala Técnica Climatización',
      sheetNumber: '05',
      category: 'Climatización & Aires Acondicionados',
      status: 'mismatch',
      discrepancyNote: 'Falta calcomanía QR con placa 95271025486 en la condensadora exterior. Se solicita re-impresión de etiqueta.'
    }
  ]
};
