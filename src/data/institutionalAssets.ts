import { SerialAsset, EnvironmentId, AssetPhysicalStatus } from '../types';

export interface RawInventoryRow {
  regional: string;
  centroCosto: string;
  modulo: string;
  modelo: string;
  consecutivo: string;
  descripcion: string;
  descripcionActual: string;
  tipo: string;
  placa: string;
  serial: string;
  fechaAdquisicion: string;
  valorIngreso: string;
}

// Datos oficiales suministrados del inventario institucional (Centro de Costo 952710 y 101041)
export const RAW_INSTITUTIONAL_DATA: RawInventoryRow[] = [
  // Climatización
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "CS-24A", consecutivo: "232794", descripcion: "AIRE ACONDICIONADO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 24000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA MINI SPLIT", tipo: "4", placa: "95271022764", serial: "2019", fechaAdquisicion: "26/12/2018", valorIngreso: "$2.220.000,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "CS-24A", consecutivo: "232794", descripcion: "AIRE ACONDICIONADO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 24000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA MINI SPLIT", tipo: "4", placa: "95271022765", serial: "0426", fechaAdquisicion: "26/12/2018", valorIngreso: "$2.220.000,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "LAC060", consecutivo: "242892", descripcion: "AIRE ACONDICIONADO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO", tipo: "4", placa: "95271025486", serial: "3122G05688", fechaAdquisicion: "28/12/2023", valorIngreso: "$8.235.294,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "LAC060", consecutivo: "242892", descripcion: "AIRE ACONDICIONADO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO", tipo: "4", placa: "95271025485", serial: "3122C01766", fechaAdquisicion: "28/12/2023", valorIngreso: "$8.235.294,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "LAC060", consecutivo: "242892", descripcion: "AIRE ACONDICIONADO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO CAPACIDAD 60000 BTU UNIDAD DE MEDIDA UNIDAD CARACTERISTICA TIPO PISO TECHO", tipo: "4", placa: "95271025484", serial: "3122G05695", fechaAdquisicion: "28/12/2023", valorIngreso: "$8.235.294,00" },

  // Portátiles de Alto Desempeño
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024071", serial: "5CD0037S7T", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRESCISION 3551", consecutivo: "299274", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024828", serial: "8TF8DB3", fechaAdquisicion: "20/04/2021", valorIngreso: "$6.422.400,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRESCISION 3551", consecutivo: "299274", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024818", serial: "53N5DB3", fechaAdquisicion: "20/04/2021", valorIngreso: "$6.422.400,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRESCISION 3551", consecutivo: "299274", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024817", serial: "CFH1DB3", fechaAdquisicion: "20/04/2021", valorIngreso: "$6.422.400,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRESCISION 3551", consecutivo: "299274", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024816", serial: "DPT5DB3", fechaAdquisicion: "20/04/2021", valorIngreso: "$6.422.400,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRESCISION 3551", consecutivo: "299274", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024815", serial: "H9Z6DB3", fechaAdquisicion: "20/04/2021", valorIngreso: "$6.422.400,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRESCISION 3551", consecutivo: "299274", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR XEON DISCO DURO 1 TERABYTE MEMORIA 256 GB PANTALLA 15 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024814", serial: "1SRQFB3", fechaAdquisicion: "20/04/2021", valorIngreso: "$6.422.400,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "Z0Y05E/A", consecutivo: "298208", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I9 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 16 PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "101001130405", serial: "C02C24A7MD6T", fechaAdquisicion: "13/05/2020", valorIngreso: "$10.774.109,24" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024085", serial: "5CD0037SPZ", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024084", serial: "5CD0090Q5P", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024111", serial: "5CD0037S7S", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024105", serial: "5CD00385LG", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024099", serial: "5CD0037S7K", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024098", serial: "5CD0090Q5G", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024097", serial: "5CD0037S7G", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271023978", serial: "5CD0092F73", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271023979", serial: "5CD0090QTL", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PROBOOK 445R G6", consecutivo: "297419", descripcion: "COMPUTADOR PORTATIL", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7 DISCO DURO 512 GB MEMORIA RAM DE 16 GB PANTALLA 14\" PULGADAS UNIDAD LECTORA N.A.", tipo: "4", placa: "95271023980", serial: "5CD0092DZX", fechaAdquisicion: "08/06/2020", valorIngreso: "$1.766.042,14" },

  // Workstations Dell Precision 3440
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRECISION 3440", consecutivo: "298471", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024618", serial: "6LJB673", fechaAdquisicion: "30/11/2020", valorIngreso: "$5.764.590,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRECISION 3440", consecutivo: "298471", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024562", serial: "6LJ9673", fechaAdquisicion: "30/11/2020", valorIngreso: "$5.764.590,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRECISION 3440", consecutivo: "298471", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024610", serial: "6LJVH63", fechaAdquisicion: "30/11/2020", valorIngreso: "$5.764.590,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRECISION 3440", consecutivo: "298471", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024606", serial: "6LJYH63", fechaAdquisicion: "30/11/2020", valorIngreso: "$5.764.590,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRECISION 3440", consecutivo: "298471", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024602", serial: "6LJWH63", fechaAdquisicion: "30/11/2020", valorIngreso: "$5.764.590,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRECISION 3440", consecutivo: "298471", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA WORKSTATION PROCESADOR INTEL CORE I7 DISCO DURO 2 TERABYTE MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024598", serial: "6LJ8673", fechaAdquisicion: "30/11/2020", valorIngreso: "$5.764.590,00" },

  // AIO Todo-En-Uno OptiPlex 7470AIO
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "OPTIPLEX 7470AIO", consecutivo: "297485", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024477", serial: "34ZM853", fechaAdquisicion: "18/11/2020", valorIngreso: "$2.691.882,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "OPTIPLEX 7470AIO", consecutivo: "297485", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024478", serial: "34VFQ53", fechaAdquisicion: "18/11/2020", valorIngreso: "$2.691.882,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "OPTIPLEX 7470AIO", consecutivo: "297485", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024479", serial: "358DQ53", fechaAdquisicion: "18/11/2020", valorIngreso: "$2.691.882,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "OPTIPLEX 7470AIO", consecutivo: "297485", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7 DISCO DURO 1 TERABYTE MEMORIA RAM DE 32 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271024483", serial: "34VM853", fechaAdquisicion: "18/11/2020", valorIngreso: "$2.691.882,00" },

  // AIO Nuevos HP Pro One 440 G9 i7 (Centro de Costo 101041 - 2025)
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "PC AIO HP PRO ONE 440 G9 I7 B5CR9LS", consecutivo: "301857", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;", tipo: "4", placa: "10104118894", serial: "8CN4490K77", fechaAdquisicion: "28/02/2025", valorIngreso: "$3.373.931,00" },
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "PC AIO HP PRO ONE 440 G9 I7 B5CR9LS", consecutivo: "301857", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;", tipo: "4", placa: "10104118895", serial: "8CN4490K85", fechaAdquisicion: "28/02/2025", valorIngreso: "$3.373.931,00" },
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "PC AIO HP PRO ONE 440 G9 I7 B5CR9LS", consecutivo: "301857", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;", tipo: "4", placa: "10104118896", serial: "8CN4490K89", fechaAdquisicion: "28/02/2025", valorIngreso: "$3.373.931,00" },
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "PC AIO HP PRO ONE 440 G9 I7 B5CR9LS", consecutivo: "301857", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;", tipo: "4", placa: "10104118897", serial: "8CN4490KCY", fechaAdquisicion: "28/02/2025", valorIngreso: "$3.373.931,00" },
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "PC AIO HP PRO ONE 440 G9 I7 B5CR9LS", consecutivo: "301857", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "CPU INTEGRADA CON MONITOR;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;DISCO DURO=512 GB;MEMORIA=16 GB;PANTALLA=23.8 PULGADAS;PROCESADOR=INTEL CORE I7;TECNOLOGIA=N.A.;UNIDAD LECTORA=N.A.;", tipo: "4", placa: "10104118898", serial: "8CN4490KD5", fechaAdquisicion: "28/02/2025", valorIngreso: "$3.373.931,00" },

  // AIO HP Pro One 400
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRO ONE 400", consecutivo: "289196", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271022889", serial: "8CG8493CDH", fechaAdquisicion: "31/12/2018", valorIngreso: "$4.302.170,88" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRO ONE 400", consecutivo: "289196", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271022890", serial: "8CG8493CBV", fechaAdquisicion: "31/12/2018", valorIngreso: "$4.302.170,88" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "PRO ONE 400", consecutivo: "289196", descripcion: "CPU INTEGRADA CON MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR INTEL CORE I7-8550U DE 8TH GENERACION DISCO DURO 1 TERABYTE MEMORIA 16 GB PANTALLA 23.8 PULGADAS TECNOLOGIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "95271022891", serial: "8CG8493CC3", fechaAdquisicion: "31/12/2018", valorIngreso: "$4.302.170,88" },

  // Monitores Dell P2219H
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "P2219H", consecutivo: "284008", descripcion: "MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.", tipo: "4", placa: "95271024563", serial: "CN04D9T1QDC0004QA52U", fechaAdquisicion: "30/11/2020", valorIngreso: "$1.108.575,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "P2219H", consecutivo: "284008", descripcion: "MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.", tipo: "4", placa: "95271024567", serial: "CN04D9T1QDC0003V68HB", fechaAdquisicion: "30/11/2020", valorIngreso: "$1.108.575,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "P2219H", consecutivo: "284008", descripcion: "MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO 21.5 PULGADAS UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA N.A.", tipo: "4", placa: "95271024571", serial: "CN04D9T1QDC0008A1PSI", fechaAdquisicion: "30/11/2020", valorIngreso: "$1.108.575,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "MD55C", consecutivo: "275786", descripcion: "MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO 55 PULGADAS UNIDAD DE MEDIDA UNIDAD TECNOLOGIA LED INDUSTRIAL", tipo: "4", placa: "952715603", serial: "Z7H0HCDDB00830Y", fechaAdquisicion: "27/12/2013", valorIngreso: "$3.785.047,86" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "ONE SCREEN", consecutivo: "273258", descripcion: "MONITOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD TECNOLOGIA PANTALLA GRAFICA INTERACTIVA", tipo: "4", placa: "952721722", serial: "KYSD103D05090083", fechaAdquisicion: "23/12/2017", valorIngreso: "$18.900.000,00" },

  // Tabletas Wacom y Tablets
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "DTC133", consecutivo: "298765", descripcion: "TABLETA DIGITALIZADORA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. PANTALLA 13.3\" PULGADAS TECNOLOGIA WACOM ONE", tipo: "4", placa: "101001134771", serial: "0HW0171007879", fechaAdquisicion: "17/12/2020", valorIngreso: "$1.691.960,50" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "DTC133", consecutivo: "298765", descripcion: "TABLETA DIGITALIZADORA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. PANTALLA 13.3\" PULGADAS TECNOLOGIA WACOM ONE", tipo: "4", placa: "101001134994", serial: "0IW0171000365", fechaAdquisicion: "17/12/2020", valorIngreso: "$1.691.960,50" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "DTC133", consecutivo: "298765", descripcion: "TABLETA DIGITALIZADORA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. PANTALLA 13.3\" PULGADAS TECNOLOGIA WACOM ONE", tipo: "4", placa: "101001135008", serial: "0IW0171000379", fechaAdquisicion: "17/12/2020", valorIngreso: "$1.691.960,50" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "GALAXY TAB 2 P5110", consecutivo: "273255", descripcion: "TABLET", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO 10.1 PULGADAS UNIDAD DE MEDIDA UNIDAD MEMORIA 16 GB", tipo: "4", placa: "1001102292", serial: "R32C603KKQD", fechaAdquisicion: "28/12/2012", valorIngreso: "$729.900,00" },

  // Plataformas Especiales & Simulación / VR
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "OMEN", consecutivo: "287898", descripcion: "PLATAFORMAS DE SIMULACION", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA ESTACION DE TRABAJO GAMER MATERIAL N.A.", tipo: "4", placa: "952721694", serial: "5CC7420003", fechaAdquisicion: "23/12/2017", valorIngreso: "$42.450.000,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "OMEN", consecutivo: "287899", descripcion: "CPU", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA COMPUTADOR GAMER PROCESADOR N.A. DISCO DURO N.A. MEMORIA N.A. UNIDAD LECTORA N.A.", tipo: "4", placa: "952721695", serial: "5CC7420004", fechaAdquisicion: "23/12/2017", valorIngreso: "$6.600.000,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "287605", descripcion: "SIMULADOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE CASCO DE REALIDAD VIRTUAL HTC VIVE / OCULUS", tipo: "4", placa: "952721703", serial: "VR-SENA-001", fechaAdquisicion: "23/12/2017", valorIngreso: "$4.200.000,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "XBOX ONE", consecutivo: "248127", descripcion: "CONSOLA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA CONSOLA DESARROLLO VIDEOJUEGOS", tipo: "4", placa: "952720898", serial: "197907272816", fechaAdquisicion: "06/12/2017", valorIngreso: "$1.950.000,00" },

  // Periféricos y Biometría
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "4500", consecutivo: "235395", descripcion: "ESCANER", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE HUELLA DIGITAL CON INTERFASE TECNOLOGIA USB", tipo: "4", placa: "95276104", serial: "A400E066773", fechaAdquisicion: "09/09/2010", valorIngreso: "$277.240,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "4500", consecutivo: "235395", descripcion: "ESCANER", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE HUELLA DIGITAL CON INTERFASE TECNOLOGIA USB", tipo: "4", placa: "95276105", serial: "A400E066775", fechaAdquisicion: "09/09/2010", valorIngreso: "$277.240,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "SYMBOLLS2208", consecutivo: "235304", descripcion: "LECTOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO USO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE CODIGO DE BARRAS LASER", tipo: "4", placa: "95276126", serial: "Y6EWG6", fechaAdquisicion: "09/09/2010", valorIngreso: "$370.968,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "SYMBOLLS2208", consecutivo: "235304", descripcion: "LECTOR", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO USO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE CODIGO DE BARRAS LASER", tipo: "4", placa: "95276128", serial: "Y6GWGF", fechaAdquisicion: "09/09/2010", valorIngreso: "$370.968,00" },

  // Mobiliario Institucional y Aulas
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "234792", descripcion: "SILLA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA APILABLE MATERIAL N.A. SISTEMA N.A.", tipo: "4", placa: "95271026663", serial: "SIL-APL-01", fechaAdquisicion: "23/10/2025", valorIngreso: "$97.371,65" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "234792", descripcion: "SILLA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA APILABLE MATERIAL N.A. SISTEMA N.A.", tipo: "4", placa: "95271026665", serial: "SIL-APL-02", fechaAdquisicion: "23/10/2025", valorIngreso: "$97.371,65" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "304353", descripcion: "SILLA", descripcionActual: "SILLA;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;CARACTERISTICA=ERGONOMICA GIRATORIA, CON BRAZOS GRADUABLES, ESPALDAR EN MALLA;CLASE=N.A.;COLOR=N.A.;MATERIAL=N.A.;SISTEMA=N.A.;", tipo: "4", placa: "95271028147", serial: "SIL-ERG-01", fechaAdquisicion: "15/04/2026", valorIngreso: "$515.126,05" },
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "N/A", consecutivo: "299707", descripcion: "SILLA", descripcionActual: "SILLA;TIPO ELEMENTO=DEVOLUTIVO SENA;UNIDAD DE MEDIDA=UNIDAD;CARACTERISTICA=GIRATORIA, EN MALLA RESPALDO MEDIO;CLASE=N.A.;COLOR=N.A.;MATERIAL=N.A.;SISTEMA=N.A.;", tipo: "4", placa: "10104118696", serial: "SIL-MAL-01", fechaAdquisicion: "17/12/2021", valorIngreso: "$601.092,44" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "239923", descripcion: "ESCRITORIO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CLASE N.A. CARACTERISTICA N.A. MATERIAL N.A.", tipo: "4", placa: "95271028282", serial: "ESC-001", fechaAdquisicion: "11/05/2026", valorIngreso: "$852.942,18" },
  { regional: "41", centroCosto: "101041", modulo: "INVE", modelo: "N/A", consecutivo: "284047", descripcion: "LOCKER", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA DE 4 PUESTOS MATERIAL METALICO", tipo: "4", placa: "10104118826", serial: "LCK-001", fechaAdquisicion: "17/12/2021", valorIngreso: "$973.109,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "273247", descripcion: "TABLERO", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO TAMAÑO N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA BORRABLE MATERIAL ACRILICO", tipo: "4", placa: "95271028029", serial: "TAB-001", fechaAdquisicion: "15/04/2026", valorIngreso: "$225.210,08" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "N/A", consecutivo: "000574", descripcion: "MESA", descripcionActual: "TIPO ELEMENTO=ELEMENTO DEVOLUTIVO;USO=PARA TRABAJO;UNIDAD DE MEDIDA=UNIDAD;", tipo: "4", placa: "95273317", serial: "MES-001", fechaAdquisicion: "12/03/2009", valorIngreso: "$1.473.200,00" },

  // Equipos de Potencia & Impresión
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "UPO22-RT AX 5400 WAL", consecutivo: "287866", descripcion: "UPS", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO CAPACIDAD N.A. UNIDAD DE MEDIDA UNIDAD CARACTERISTICA PARA SERVIDORES VOLTAJE N.A.", tipo: "4", placa: "952720897", serial: "170315-0621068", fechaAdquisicion: "06/12/2017", valorIngreso: "$7.500.000,00" },
  { regional: "41", centroCosto: "952710", modulo: "INVE", modelo: "B730", consecutivo: "277680", descripcion: "IMPRESORA", descripcionActual: "TIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD CARACTERISTICA N.A. TECNOLOGIA LASER MONOCROMATICA", tipo: "4", placa: "952720423", serial: "AS1B061028A0", fechaAdquisicion: "15/05/2013", valorIngreso: "$2.900.000,00" }
];

// Helper para convertir los datos crudos en la entidad SerialAsset del sistema
export function convertRawRowToSerialAsset(
  row: RawInventoryRow, 
  index: number,
  defaultEnvId?: EnvironmentId
): SerialAsset {
  const modelClean = row.modelo && row.modelo !== '.' && row.modelo !== 'N/A' ? row.modelo : '';
  const fullName = modelClean ? `${row.descripcion} ${modelClean}` : row.descripcion;
  
  // Asignación inteligente por defecto o permitir que el usuario asigne
  let envId: EnvironmentId = defaultEnvId || 'unassigned';
  let envName = 'Sin Asignar (Pendiente Reubicación)';
  let station = 'Depósito General de Inventario';
  let responsible = 'Por asignar en ambiente';

  if (!defaultEnvId) {
    // Si no se fuerza un ambiente, distribuimos lógicamente algunos para la demo y dejamos otros pendientes
    if (row.descripcion.includes('PORTATIL') || row.modelo.includes('PROBOOK')) {
      if (index % 3 === 0) {
        envId = 'amb1';
        envName = 'Ambiente 1: Lab Robótica e IA';
        station = `Estación Móvil IA #${(index % 12) + 1}`;
        responsible = 'Ing. Lucía Vargas Méndez';
      } else if (index % 3 === 1) {
        envId = 'amb2';
        envName = 'Ambiente 2: Aula Cómputo & Redes';
        station = `Puesto Alumno #${(index % 25) + 1}`;
        responsible = 'Prof. Carlos Mendoza';
      } else {
        envId = 'unassigned';
      }
    } else if (row.descripcion.includes('CPU INTEGRADA') || row.modelo.includes('OPTIPLEX') || row.modelo.includes('PRO ONE')) {
      if (index % 2 === 0) {
        envId = 'amb2';
        envName = 'Ambiente 2: Aula Cómputo & Redes';
        station = `Puesto Aula #${(index % 30) + 1}`;
        responsible = 'Prof. Carlos Mendoza';
      } else {
        envId = 'unassigned';
      }
    } else if (row.descripcion.includes('PLATAFORMAS') || row.descripcion.includes('SIMULADOR') || row.modelo.includes('OMEN')) {
      envId = 'amb1';
      envName = 'Ambiente 1: Lab Robótica e IA';
      station = 'Zona Inmersiva RV/Simulación';
      responsible = 'Ing. Lucía Vargas Méndez';
    } else if (row.descripcion.includes('AIRE') || row.descripcion.includes('UPS')) {
      envId = 'amb3';
      envName = 'Ambiente 3: Taller de Electrónica';
      station = 'Sala de Potencia y Climatización';
      responsible = 'Prof. Alex Arana';
    } else {
      // Dejar como pendiente para que el usuario demuestre la asignación a ambientes
      envId = 'unassigned';
    }
  }

  // Detectar categoría
  let category = 'Equipos de Cómputo';
  let photo = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80';

  if (row.descripcion.includes('AIRE')) {
    category = 'Climatización & Planta';
    photo = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80';
  } else if (row.descripcion.includes('SILLA') || row.descripcion.includes('MESA') || row.descripcion.includes('ESCRITORIO') || row.descripcion.includes('LOCKER')) {
    category = 'Mobiliario Institucional';
    photo = 'https://images.unsplash.com/photo-1580481077195-c3288b584061?auto=format&fit=crop&w=600&q=80';
  } else if (row.descripcion.includes('MONITOR') || row.descripcion.includes('TELEVISOR')) {
    category = 'Monitores & Pantallas';
    photo = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80';
  } else if (row.descripcion.includes('TABLET') || row.descripcion.includes('DIGITALIZADORA')) {
    category = 'Tablets & Digitalizadoras';
    photo = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80';
  } else if (row.descripcion.includes('SIMULADOR') || row.descripcion.includes('PLATAFORMAS') || row.modelo.includes('XBOX')) {
    category = 'Realidad Virtual & Simulación';
    photo = 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=600&q=80';
  } else if (row.descripcion.includes('ESCANER') || row.descripcion.includes('LECTOR')) {
    category = 'Biometría & Periféricos';
    photo = 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=600&q=80';
  }

  const cleanSerial = row.serial && row.serial !== '.' && row.serial !== 'N/A' && row.serial !== 'SS' 
    ? row.serial 
    : `SENA-SN-${row.placa}`;

  return {
    id: `ast-inst-${row.placa}`,
    regional: row.regional,
    centroCosto: row.centroCosto,
    modulo: row.modulo,
    modelo: row.modelo,
    consecutivo: row.consecutivo,
    descripcion: row.descripcion,
    descripcionActual: row.descripcionActual,
    tipo: row.tipo,
    placa: row.placa,
    serial: cleanSerial,
    fechaAdquisicion: row.fechaAdquisicion,
    valorIngreso: row.valorIngreso,

    // Core
    serialNumber: cleanSerial,
    assetCode: row.placa,
    name: fullName,
    description: row.descripcionActual,
    category,
    environmentId: envId,
    environmentName: envName,
    station,
    physicalStatus: 'operativo',
    statusLabel: envId === 'unassigned' ? 'Pendiente Asignación' : 'Operativo en Uso',
    responsiblePerson: responsible,
    assignedDate: row.fechaAdquisicion,
    warrantyUntil: 'Nov 2026',
    barcode: row.placa,
    qrToken: `QR-SENA-${row.placa}`,
    specs: {
      notes: row.descripcionActual
    },
    photoUrl: photo,
    historyTimeline: [
      {
        id: `h-init-${row.placa}`,
        title: 'Registro de Inventario Institucional',
        date: row.fechaAdquisicion,
        time: '08:00 AM',
        description: `Ingreso oficial por módulo ${row.modulo}. Placa: ${row.placa}, Consecutivo: ${row.consecutivo}, Valor: ${row.valorIngreso}.`,
        author: 'Almacén General SENA',
        type: 'registration'
      }
    ]
  };
}

// Genera la lista inicial combinada de activos oficiales
export const INITIAL_INSTITUTIONAL_ASSETS: SerialAsset[] = RAW_INSTITUTIONAL_DATA.map((row, idx) => 
  convertRawRowToSerialAsset(row, idx)
);

// Parser para importar texto tabulado o CSV pegado por el usuario
export function parseTSVInventory(tsvText: string): RawInventoryRow[] {
  const lines = tsvText.trim().split('\n');
  const rows: RawInventoryRow[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    // Ignorar encabezados si vienen incluidos
    if (line.includes('Centro de Costo') || line.includes('Regional')) continue;

    // Detectar separador por tabulación o punto y coma o coma
    const parts = line.includes('\t') ? line.split('\t') : line.split(';');
    if (parts.length >= 10) {
      rows.push({
        regional: parts[0]?.trim() || '41',
        centroCosto: parts[1]?.trim() || '952710',
        modulo: parts[2]?.trim() || 'INVE',
        modelo: parts[3]?.trim() || 'N/A',
        consecutivo: parts[4]?.trim() || '000000',
        descripcion: parts[5]?.trim() || 'ACTIVO',
        descripcionActual: parts[6]?.trim() || '',
        tipo: parts[7]?.trim() || '4',
        placa: parts[8]?.trim() || `PL-${Date.now()}`,
        serial: parts[9]?.trim() || 'SN-NA',
        fechaAdquisicion: parts[10]?.trim() || new Date().toLocaleDateString('es-ES'),
        valorIngreso: parts[11]?.trim() || '$0,00'
      });
    }
  }

  return rows;
}
