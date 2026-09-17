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
    totalCapacity: 455,
    assignedCount: 373,
    occupancyPercentage: 82,
    categoryBreakdown: { computo: 180, robotica: 125, electronica: 98, herramientas: 52 }
  },
  {
    id: 'amb2',
    name: 'Ambiente 2: Aula Cómputo & Redes',
    codeName: 'Aula Cómputo & Redes',
    building: 'Pabellón Central A',
    floor: 'Piso 1',
    icon: 'lan',
    totalCapacity: 620,
    assignedCount: 520,
    occupancyPercentage: 84,
    categoryBreakdown: { computo: 310, robotica: 35, electronica: 65, herramientas: 110 }
  },
  {
    id: 'amb3',
    name: 'Ambiente 3: Taller de Electrónica',
    codeName: 'Taller de Electrónica',
    building: 'Pabellón Industrial C',
    floor: 'Planta Baja',
    icon: 'memory',
    totalCapacity: 450,
    assignedCount: 408,
    occupancyPercentage: 91,
    categoryBreakdown: { computo: 85, robotica: 90, electronica: 185, herramientas: 48 }
  },
  {
    id: 'service',
    name: 'Mesa de Servicio & Diagnóstico',
    codeName: 'Mesa de Servicio',
    building: 'Nivel 2 Soporte',
    floor: 'Banco #03',
    icon: 'support_agent',
    totalCapacity: 60,
    assignedCount: 38,
    occupancyPercentage: 63,
    categoryBreakdown: { computo: 14, robotica: 11, electronica: 11, herramientas: 2 }
  },
  {
    id: 'damaged',
    name: 'Almacén de Dañados / Bajas',
    codeName: 'Almacén de Dañados',
    building: 'Sótano Técnico',
    floor: 'Estante D',
    icon: 'warning',
    totalCapacity: 50,
    assignedCount: 26,
    occupancyPercentage: 52,
    categoryBreakdown: { computo: 9, robotica: 7, electronica: 8, herramientas: 2 }
  }
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-1',
    code: 'CAT-CMP-01',
    name: 'Equipos de Cómputo',
    description: 'Laptops Dell Latitude, Workstations HP, Mini PCs',
    icon: 'laptop_chromebook',
    amb1: 160,
    amb2: 210,
    amb3: 85,
    mesa: 14,
    dano: 9,
    total: 478,
    operationalPercentage: 95.2,
    status: 'ok'
  },
  {
    id: 'cat-2',
    code: 'CAT-MON-02',
    name: 'Monitores & Pantallas',
    description: 'Monitores IPS 24", Pantallas Interactivas 65"',
    icon: 'monitor',
    amb1: 95,
    amb2: 180,
    amb3: 40,
    mesa: 6,
    dano: 4,
    total: 325,
    operationalPercentage: 96.9,
    status: 'ok'
  },
  {
    id: 'cat-3',
    code: 'CAT-ROB-03',
    name: 'Kits de Robótica',
    description: 'Arduino Mega, ESP32, Dobot, Servomotores',
    icon: 'smart_toy',
    amb1: 145,
    amb2: 35,
    amb3: 90,
    mesa: 11,
    dano: 7,
    total: 288,
    operationalPercentage: 93.7,
    status: 'warning'
  },
  {
    id: 'cat-4',
    code: 'CAT-INS-04',
    name: 'Instrumentación & Medición',
    description: 'Osciloscopios Rigol/Tektronix, Fuentes Reguladas',
    icon: 'speed',
    amb1: 30,
    amb2: 15,
    amb3: 135,
    mesa: 5,
    dano: 4,
    total: 189,
    operationalPercentage: 95.2,
    status: 'ok'
  },
  {
    id: 'cat-5',
    code: 'CAT-NET-05',
    name: 'Periféricos & Conectividad',
    description: 'Switches Gigabit Cisco, Routers, Patch Panels',
    icon: 'router',
    amb1: 60,
    amb2: 80,
    amb3: 58,
    mesa: 2,
    dano: 2,
    total: 202,
    operationalPercentage: 98.0,
    status: 'ok'
  }
];

export const INITIAL_ASSETS: SerialAsset[] = [
  {
    id: 'ast-001',
    serialNumber: 'SN-8842-LAP',
    assetCode: 'EDU-ACT-0492',
    name: 'Laptop Dell Latitude 5540 (#04)',
    description: 'Intel Core i7 13th Gen • 16GB RAM • 512GB SSD NVMe',
    category: 'Equipos de Cómputo',
    environmentId: 'amb1',
    environmentName: 'Ambiente 1: Lab Robótica e IA',
    station: 'Estación de Trabajo #04 (Pabellón B, Piso 2)',
    physicalStatus: 'operativo',
    statusLabel: 'Operativo en Uso',
    responsiblePerson: 'Ing. Lucía Vargas Méndez',
    assignedDate: '12 Ene 2024',
    warrantyUntil: 'Nov 2026',
    barcode: '750100492810',
    qrToken: 'VEF-894-LPT-2025',
    specs: {
      processor: 'Intel Core i7 1370P 14-Core',
      ram: '16 GB DDR5 4800MHz',
      storage: '512 GB PCIe M.2 SSD',
      connectivity: 'Wi-Fi 6E, Thunderbolt 4, Gigabit Ethernet',
      notes: 'Configurado con ROS 2 Humble y Ubuntu 22.04 LTS dual boot'
    },
    photoUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    historyTimeline: [
      {
        id: 'hist-1',
        title: 'Asignación a Docente en Lab Robótica',
        date: '12 Ene 2024',
        time: '10:42 AM',
        description: 'Entregado en custodia a la Ing. Lucía Vargas Méndez para banco de IA. Ambiente 1, Rack A-2.',
        author: 'Carlos Mendoza (Admin)',
        type: 'assignment'
      },
      {
        id: 'hist-2',
        title: 'Mantenimiento Preventivo & BIOS',
        date: '05 Dic 2023',
        time: '14:15 PM',
        description: 'Actualización de firmware UEFI y limpieza ultrasónica de disipador. Ticket #MS-4892 cerrado conforme.',
        author: 'Laura Santos (Técnico)',
        type: 'maintenance'
      },
      {
        id: 'hist-3',
        title: 'Transferencia Inter-Ambientes',
        date: '14 Ago 2023',
        time: '09:00 AM',
        description: 'Reubicado desde Almacén Central de Cómputo hacia Ambiente 1 para preparación de semestre lectivo.',
        author: 'Carlos Mendoza (Admin)',
        type: 'transfer'
      },
      {
        id: 'hist-4',
        title: 'Alta & Etiquetado QR Inicial',
        date: '03 Mar 2023',
        time: '11:20 AM',
        description: 'Recepción formal por orden de compra OC-8921. Generación de código QR y barra GS1-128.',
        author: 'Carlos Mendoza (Admin)',
        type: 'registration'
      }
    ]
  },
  {
    id: 'ast-002',
    serialNumber: 'SN-9012-OSC',
    assetCode: 'EDU-ACT-0610',
    name: 'Osciloscopio Digital Rigol DS1054Z',
    description: '50 MHz (actualizable 100MHz) • 4 Canales Analógicos',
    category: 'Instrumentación & Medición',
    environmentId: 'amb3',
    environmentName: 'Ambiente 3: Taller de Electrónica',
    station: 'Banco de Mediciones #3',
    physicalStatus: 'con_dano',
    statusLabel: 'Con Daño / Faltante',
    responsiblePerson: 'Prof. Alex Arana',
    assignedDate: '04 Oct 2023',
    warrantyUntil: 'Ago 2025',
    barcode: '750100610221',
    qrToken: 'VEF-610-OSC-2025',
    specs: {
      processor: 'UltraVision Chipset',
      storage: '24 Mpts memoria profunda',
      connectivity: 'USB Host & Device, LAN LXI',
      notes: 'Reportado cortocircuito de entrada en CH1 tras sobrevoltaje de fuente'
    },
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    historyTimeline: [
      {
        id: 'hist-5',
        title: 'Salida por Daño Crítico',
        date: '17 Sep 2026',
        time: '08:45 AM',
        description: 'Retiro preventivo en Ambiente 3 por falla de aislamiento eléctrico en canal primario.',
        author: 'Ing. Lucía Vargas (Docente)',
        type: 'damage'
      }
    ]
  },
  {
    id: 'ast-003',
    serialNumber: 'SN-3319-IMP',
    assetCode: 'EDU-ACT-0312',
    name: 'Impresora 3D Creality Ender 3 V3',
    description: 'FDM Direct Extrusion • Cama Magnética 220x220mm',
    category: 'Kits de Robótica',
    environmentId: 'service',
    environmentName: 'Mesa de Servicio',
    station: 'Banco Técnico de Diagnóstico #02',
    physicalStatus: 'mesa_servicio',
    statusLabel: 'En Mesa de Servicio',
    responsiblePerson: 'Téc. Roberto Gómez',
    assignedDate: '15 Mar 2024',
    warrantyUntil: 'Mar 2025',
    barcode: '750100312994',
    qrToken: 'VEF-312-3DP-2025',
    specs: {
      notes: 'Extrusor obstruido y termistor de cama caliente en cortocircuito'
    },
    photoUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    historyTimeline: [
      {
        id: 'hist-6',
        title: 'Ingreso a Mesa de Servicio',
        date: '16 Sep 2026',
        time: '14:20 PM',
        description: 'Apertura de Ticket #TK-4092 por falla térmica.',
        author: 'Roberto Gómez (Técnico)',
        type: 'maintenance'
      }
    ]
  },
  {
    id: 'ast-004',
    serialNumber: 'SN-5521-PI5',
    assetCode: 'EDU-ACT-0045',
    name: 'Kit Raspberry Pi 5 Lab (8GB)',
    description: 'Cortex-A76 2.4GHz • 8GB LPDDR4X • NVMe PCIe HAT',
    category: 'Kits de Robótica',
    environmentId: 'amb2',
    environmentName: 'Ambiente 2: Aula Cómputo & Redes',
    station: 'Estación #14 (Piso 1)',
    physicalStatus: 'operativo',
    statusLabel: 'Operativo en Uso',
    responsiblePerson: 'Prof. Ricardo Salinas',
    assignedDate: '16 Sep 2026',
    warrantyUntil: 'Sep 2027',
    barcode: '750100045182',
    qrToken: 'VEF-045-PI5-2025',
    specs: {
      notes: 'Lote nuevo incorporado mediante recepción #ALTA-104'
    },
    photoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    historyTimeline: [
      {
        id: 'hist-7',
        title: 'Alta de Lote y Asignación',
        date: '16 Sep 2026',
        time: '16:30 PM',
        description: 'Ingreso al inventario activo de Ambiente 2 bajo Guía #88192.',
        author: 'Carlos Mendoza (Admin)',
        type: 'registration'
      }
    ]
  },
  {
    id: 'ast-005',
    serialNumber: 'SN-1109-MON',
    assetCode: 'EDU-ACT-0742',
    name: 'Monitor Dell 27" P2722H',
    description: 'Full HD 1080p IPS • Hub USB 3.2 • Pivote ergonómico',
    category: 'Monitores & Pantallas',
    environmentId: 'amb3',
    environmentName: 'Ambiente 3: Taller de Electrónica',
    station: 'Mesa A-01',
    physicalStatus: 'operativo',
    statusLabel: 'Operativo en Uso',
    responsiblePerson: 'Prof. Alex Arana',
    assignedDate: '19 Nov 2023',
    warrantyUntil: 'Dic 2026',
    barcode: '750100742119',
    qrToken: 'VEF-742-MON-2025',
    specs: {
      connectivity: 'DisplayPort, HDMI, VGA, 4x USB-A'
    },
    photoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    historyTimeline: []
  },
  {
    id: 'ast-006',
    serialNumber: 'SN-9012-ROB',
    assetCode: 'EDU-ACT-0105',
    name: 'Brazo Robótico Dobot Magician',
    description: 'Brazo articulado 4-DOF • Precisión 0.2mm • Garra & Ventosa',
    category: 'Kits de Robótica',
    environmentId: 'amb1',
    environmentName: 'Ambiente 1: Lab Robótica e IA',
    station: 'Banco de Robótica 1 (Pabellón B)',
    physicalStatus: 'operativo',
    statusLabel: 'Operativo en Uso',
    responsiblePerson: 'Ing. Lucía Vargas Méndez',
    assignedDate: '10 Feb 2024',
    warrantyUntil: 'Feb 2026',
    barcode: '750100105882',
    qrToken: 'VEF-105-DOB-2025',
    specs: {
      notes: 'Equipado con kit de visión artificial y módulo de grabado láser'
    },
    photoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    historyTimeline: []
  },
  ...INITIAL_INSTITUTIONAL_ASSETS
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-001',
    folio: '#ACT-TRF-2025-0894',
    type: 'TRANSFER',
    productName: 'Dell Latitude 5540 (#04)',
    assetCode: 'EDU-ACT-0492',
    serialNumber: 'SN-8842-LAP',
    originEnvironmentId: 'amb1',
    originEnvironmentName: 'Ambiente 1: Lab Robótica e IA',
    destinationEnvironmentId: 'amb2',
    destinationEnvironmentName: 'Ambiente 2: Aula Cómputo & Redes',
    quantity: 1,
    notes: 'Reubicación Curricular - Taller de Programación Avanzada 2025-1',
    userName: 'Carlos Mendoza',
    userRole: 'Administrador (Admin)',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: '2025-02-28 10:45:12',
    cryptoHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    qrVerificationToken: 'VEF-894-LPT-2025',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-002',
    folio: '#TRF-8821',
    type: 'TRANSFER',
    productName: '5 Laptops Dell Latitude 5420',
    originEnvironmentId: 'amb1',
    originEnvironmentName: 'Ambiente 1: Lab Robótica e IA',
    destinationEnvironmentId: 'service',
    destinationEnvironmentName: 'Mesa de Servicio',
    quantity: 5,
    notes: 'Transferencia preventiva por mantenimiento programado de ventiladores',
    userName: 'Carlos Mendoza',
    userRole: 'Administrador (Admin)',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: 'Hace 18 min',
    cryptoHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    qrVerificationToken: 'VEF-8821-TRF',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-003',
    folio: '#INC-4109',
    type: 'OUT',
    productName: '1 Osciloscopio Digital Rigol DS1054Z',
    assetCode: 'EDU-ACT-0610',
    serialNumber: 'SN-7721-OSC',
    originEnvironmentId: 'amb3',
    originEnvironmentName: 'Ambiente 3: Taller de Electrónica',
    destinationEnvironmentId: 'damaged',
    destinationEnvironmentName: 'Almacén de Dañados',
    quantity: 1,
    notes: 'Salida por daño crítico: cortocircuito de canal primario CH1 tras prueba',
    userName: 'Ing. Lucía Vargas',
    userRole: 'Docente Titular',
    userEmail: 'lucia.vargas@edustock.edu',
    timestamp: 'Hace 2 horas',
    cryptoHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    qrVerificationToken: 'VEF-4109-INC',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-004',
    folio: '#ALTA-2930',
    type: 'IN',
    productName: '10 Kits de Robótica Arduino Mega',
    destinationEnvironmentId: 'amb2',
    destinationEnvironmentName: 'Ambiente 2: Aula Cómputo & Redes',
    quantity: 10,
    notes: 'Alta de lote nuevo de kits para robótica móvil',
    userName: 'Carlos Mendoza',
    userRole: 'Administrador (Admin)',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: 'Ayer',
    cryptoHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    qrVerificationToken: 'VEF-2930-ALTA',
    status: 'COMPLETADO'
  },
  {
    id: 'mov-005',
    folio: '#ALTA-104',
    type: 'IN',
    productName: '10 Kits Oficiales Raspberry Pi 5 8GB',
    destinationEnvironmentId: 'amb3',
    destinationEnvironmentName: 'Ambiente 3: Taller de Electrónica',
    quantity: 10,
    notes: 'Guía de Despacho #88192 - Nuevos kits de microcontroladores',
    userName: 'Carlos Mendoza',
    userRole: 'Administrador (Admin)',
    userEmail: 'carlos.mendoza@edustock.edu',
    timestamp: 'Ayer 16:30',
    cryptoHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    qrVerificationToken: 'VEF-104-ALTA',
    status: 'COMPLETADO'
  }
];

export const INITIAL_TICKET: ServiceDeskTicket = {
  id: 'tk-4091',
  ticketNumber: '#TK-4091',
  folio: '#TKT-2025-0042',
  title: 'Ticket #TKT-2025-0042 • Daño en Monitor / Puesto 14',
  assetId: 'ast-001',
  assetName: 'Dell OptiPlex 7090 & Monitor Dell P2419H',
  assetCode: 'EDU-OPT-089',
  serialNumber: 'SN-9921-OPT',
  priority: 'critica',
  priorityLabel: 'Crítica (P1)',
  status: 'taller_diagnostico',
  statusLabel: 'En Taller / Diagnóstico',
  slaHoursLeft: 34,
  totalSlaHours: 48,
  originEnvironment: 'Ambiente 2: Aula Cómputo & Redes',
  environmentName: 'Ambiente 2: Aula Cómputo & Redes (Puesto 14)',
  currentCustodyLocation: 'Taller Central Nivel 2 — Banco #03',
  receivedBy: 'Ing. Roberto Gómez (Recepción)',
  reporterName: 'Prof. Javier Rivas',
  reporterDate: '28 Feb 2025, 09:30 AM',
  createdAt: '28 Feb 2025, 09:30 AM',
  declaredSymptom: 'Pantalla parpadea con líneas horizontales tras encendido y sobrecalentamiento acelerado en zona de ventilador inferior.',
  diagnosticNotes: 'Panel LCD fracturado con derrame de cristales líquidos por impacto mecánico contundente.',
  repairCostEstimate: '$145.00 USD (Reemplazo de Panel OEM)',
  technicianName: 'Tec. Marcos Peña',
  evidencePhotoUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
  evidencePhotoGps: 'Campus Central - Aula 2 (Lat: 4.6097, Long: -74.0817)',
  evidenceSize: '3.2 MB',
  timelineSteps: [
    {
      stepNumber: 1,
      title: 'Ticket Creado & Foto Subida',
      time: '09:30 AM',
      assignedTo: 'Ing. Lucía Vargas Méndez • Lab Robótica',
      status: 'completed'
    },
    {
      stepNumber: 2,
      title: 'Recibido en Taller y Precintado',
      time: '10:15 AM',
      assignedTo: 'Ing. Roberto Gómez • Precinto #T-882',
      status: 'completed'
    },
    {
      stepNumber: 3,
      title: 'Diagnóstico de Hardware',
      time: '11:00 AM',
      assignedTo: 'Tec. Marcos Peña',
      status: 'current',
      note: 'En curso - Análisis de líneas LVDS y GPU'
    },
    {
      stepNumber: 4,
      title: 'Reparación / Reemplazo Flex & Pasta',
      time: 'Pendiente',
      assignedTo: 'En espera de confirmación de repuestos',
      status: 'pending'
    },
    {
      stepNumber: 5,
      title: 'Pruebas QA & Devolución a Lab Robótica',
      time: 'Pendiente',
      assignedTo: 'Retorno formal y reactivación en inventario',
      status: 'pending'
    }
  ],
  technicalNotes: [
    {
      id: 'note-1',
      author: 'Tec. Marcos Peña',
      authorInitials: 'MP',
      timeAgo: 'Hace 45 min',
      content: '“Se detecta cable flex de pantalla desgastado y acumulación severa de polvo en disipador térmico. Se solicita repuesto ref. FLX-DELL-5540 a almacén de partes para proseguir.”'
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
  totalItems: 24,
  verifiedCount: 18,
  pendingCount: 5,
  mismatchCount: 1,
  startedAt: '10:00 AM',
  auditorName: 'Carlos Mendoza (Admin)',
  items: [
    {
      id: 'aud-1',
      serialNumber: 'SN-8842-LAP',
      assetCode: 'EDU-ACT-0492',
      name: 'Laptop Dell Latitude 5540',
      station: 'Puesto #04 • Bloque Central',
      sheetNumber: '01',
      category: 'Equipos de Cómputo',
      status: 'verified',
      verifiedAt: '10:42 AM',
      verifiedBy: 'Carlos Mendoza'
    },
    {
      id: 'aud-2',
      serialNumber: 'SN-3319-IMP',
      assetCode: 'EDU-ACT-0312',
      name: 'Estación de Soldadura Weller WE1010',
      station: 'Mesa 2 de Prototipado',
      sheetNumber: '02',
      category: 'Kits de Robótica',
      status: 'verified',
      verifiedAt: '10:38 AM',
      verifiedBy: 'Carlos Mendoza'
    },
    {
      id: 'aud-3',
      serialNumber: 'SN-9012-ROB',
      assetCode: 'EDU-ACT-0105',
      name: 'Brazo Robótico Dobot Magician',
      station: 'Banco de Robótica 1',
      sheetNumber: '21',
      category: 'Kits de Robótica',
      status: 'pending'
    },
    {
      id: 'aud-4',
      serialNumber: 'SN-4421-MON',
      assetCode: 'EDU-ACT-0881',
      name: 'Monitor Dell UltraSharp 24"',
      station: 'Puesto #04 • Monitor Secundario',
      sheetNumber: '08',
      category: 'Monitores & Pantallas',
      status: 'pending'
    },
    {
      id: 'aud-5',
      serialNumber: 'SN-7721-OSC',
      assetCode: 'EDU-ACT-0610',
      name: 'Osciloscopio Digital Rigol DS1054Z',
      station: 'Banco de Mediciones #3',
      sheetNumber: '14',
      category: 'Instrumentación & Medición',
      status: 'mismatch',
      discrepancyNote: 'No localizado en Banco de Mediciones #3. Posible préstamo a Ambiente 2 sin boleta de salida.'
    }
  ]
};
