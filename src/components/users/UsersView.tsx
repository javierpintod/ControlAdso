import React from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

interface UsersViewProps {
  onNavigate: (view: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ onNavigate }) => {
  const { 
    usersList, 
    openModal, 
    currentRole, 
    switchRole, 
    showToast,
    removeUser 
  } = useApp();

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
              SEC-RBAC-2025
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Módulo de Seguridad & Control de Acceso
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Gestión de Usuarios, Roles y Permisos (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Asignación de perfiles (Admin RW, Consulta RO), control de sesiones JWT y ambientes autorizados.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | El rol Consulta no puede registrar nuevos usuarios.', 'error');
              } else {
                openModal('new-user');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Registrar Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Role Testing Interactive Box */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Simulador de Rol Activo (Prueba en Vivo)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Alterna tu rol para verificar cómo el sistema bloquea botones de transferencia, bajas y altas para auditores.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10'
            }`}
          >
            Administrador (RW)
          </button>
          <button
            onClick={() => switchRole('consulta')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'consulta'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10'
            }`}
          >
            Auditor / Consulta (RO)
          </button>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 px-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
              Directorio de Usuarios del Sistema
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-[11px] font-bold">
              {usersList.length} Cuentas
            </span>
          </div>
          <span className="text-xs text-slate-400">Tokens firmados con HMAC SHA-256</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                <th className="px-5 py-3">Usuario Institucional</th>
                <th className="px-4 py-3">Rol & Privilegios</th>
                <th className="px-4 py-3">Ambientes Autorizados</th>
                <th className="px-4 py-3">Estado Cuenta</th>
                <th className="px-4 py-3">Última Sesión</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {usersList.map((u: User) => (
                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-300 flex items-center justify-center font-bold text-xs uppercase">
                        {u.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">{u.name}</span>
                        <span className="font-mono text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      u.role === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 border border-blue-300/40'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
                      {u.roleTitle}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {u.authorizedEnvironments.map((env: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                          {env}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Activo
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                    {u.lastLogin}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => showToast(`Editando permisos de ${u.name}...`, 'info')}
                        title="Modificar permisos"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (u.id === 'usr-1') {
                            showToast('No puedes eliminar al administrador principal del sistema.', 'warning');
                          } else {
                            removeUser(u.id);
                          }
                        }}
                        title="Revocar acceso"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        <span className="material-symbols-outlined text-[17px]">person_remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Privilege Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
              Perfil: Administrador (RW - Control Total)
            </h3>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[16px]">check</span>
              Alta, modificación y catalogación de nuevos activos y productos.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[16px]">check</span>
              Ejecución y certificación de transferencias entre ambientes físicos.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[16px]">check</span>
              Emisión de dictamen de baja definitiva y cierre de tickets técnicos.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[16px]">check</span>
              Gestión de cuentas institucionales y revocación de tokens JWT.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-[22px]">visibility</span>
            <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
              Perfil: Auditor / Consulta (RO - Solo Lectura)
            </h3>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[16px]">check</span>
              Visualización completa del Dashboard, existencias y bitácora de auditoría.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-[16px]">check</span>
              Exportación de actas e informes ejecutivos en formato PDF y Excel.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500 text-[16px]">close</span>
              Bloqueo estricto para transferir, eliminar o alterar stock físico (403 Forbidden).
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500 text-[16px]">close</span>
              Sin permisos para emitir bajas de activos o crear usuarios.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
