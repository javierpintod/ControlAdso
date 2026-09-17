import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const NewUserModal: React.FC = () => {
  const { activeModal, closeModal, addNewUser, currentRole } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('consulta');
  const [tempPassword, setTempPassword] = useState('EduStock2025#');
  const [envAmb1, setEnvAmb1] = useState(true);
  const [envAmb2, setEnvAmb2] = useState(true);
  const [envAmb3, setEnvAmb3] = useState(false);
  const [envDesk, setEnvDesk] = useState(false);
  const [requirePasswordReset, setRequirePasswordReset] = useState(true);

  if (activeModal !== 'new-user') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const authorizedEnvironments: string[] = [];
    if (role === 'admin') {
      authorizedEnvironments.push('Todos (Global)');
    } else {
      if (envAmb1) authorizedEnvironments.push('Amb. 1');
      if (envAmb2) authorizedEnvironments.push('Amb. 2');
      if (envAmb3) authorizedEnvironments.push('Amb. 3');
      if (envDesk) authorizedEnvironments.push('Mesa Serv.');
    }

    const roleTitles: Record<UserRole, string> = {
      admin: 'Administrador (Admin)',
      consulta: 'Auditor / Consulta (RO)',
      tecnico: 'Técnico de Soporte'
    };

    addNewUser({
      name,
      email,
      role,
      roleTitle: roleTitles[role],
      authorizedEnvironments,
      status: 'active'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Registrar Nuevo Usuario Institucional
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Autenticación segura vinculada al directorio académico (RBAC)
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Nombres y Apellidos *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Dra. Carmen Morales"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Correo Electrónico Oficial *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="carmen.morales@edustock.edu"
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Rol Institucional *
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="consulta">Auditor / Consulta (Solo Lectura)</option>
                <option value="admin">Administrador (Control Total RW)</option>
                <option value="tecnico">Técnico de Soporte Taller</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Contraseña Temporal Inicial *
              </label>
              <input
                type="password"
                required
                value={tempPassword}
                onChange={e => setTempPassword(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Environment Assignment */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Asignación de Ambientes Físicos Autorizados
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-white/5">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={role === 'admin' ? true : envAmb1}
                  disabled={role === 'admin'}
                  onChange={e => setEnvAmb1(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Ambiente 1 (Robótica)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={role === 'admin' ? true : envAmb2}
                  disabled={role === 'admin'}
                  onChange={e => setEnvAmb2(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Ambiente 2 (Cómputo)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={role === 'admin' ? true : envAmb3}
                  disabled={role === 'admin'}
                  onChange={e => setEnvAmb3(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Ambiente 3 (Electrónica)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={role === 'admin' ? true : envDesk}
                  disabled={role === 'admin'}
                  onChange={e => setEnvDesk(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Mesa de Servicio</span>
              </label>
            </div>
          </div>

          {/* Security policy note */}
          <label className="flex items-start gap-2 text-slate-500 dark:text-slate-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={requirePasswordReset}
              onChange={e => setRequirePasswordReset(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5"
            />
            <span className="leading-relaxed">
              Requerir cambio de contraseña forzoso en el primer inicio de sesión y emitir JWT con expiración estricta de 12h (Cookie HttpOnly SameSite=Strict).
            </span>
          </label>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md flex items-center gap-1.5 transition-transform active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Crear Usuario y Enviar Acceso</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
