import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Environment, User } from '../../types';

interface AssignInstructorModalProps {
  environment: Environment | null;
  onClose: () => void;
}

export const AssignInstructorModal: React.FC<AssignInstructorModalProps> = ({ environment, onClose }) => {
  const { users, assignInstructorToEnvironment } = useApp();
  const [selectedUserId, setSelectedUserId] = useState(environment?.assignedInstructorId || '');

  if (!environment) return null;

  // Filter users that can be instructors (or all active users)
  const candidateUsers = users.filter((u: User) => u.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    assignInstructorToEnvironment(environment.id, selectedUserId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center border border-blue-500/20 shrink-0">
              <span className="material-symbols-outlined text-2xl">person_pin</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Asignar Instructor Responsable
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {environment.name} • {environment.building}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Current Assignment Card */}
        <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-blue-50/50 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Instructor Actualmente Asignado:
          </span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {environment.assignedInstructorName?.charAt(0) || 'I'}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                {environment.assignedInstructorName || 'Sin instructor asignado'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {environment.assignedInstructorEmail || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Selection Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Seleccionar Nuevo Instructor o Custodio Oficial:
            </label>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {candidateUsers.map(user => (
                <label
                  key={user.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    selectedUserId === user.id
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="instructor"
                      value={user.id}
                      checked={selectedUserId === user.id}
                      onChange={() => setSelectedUserId(user.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {user.email} • <span className="capitalize">{user.roleTitle || user.role}</span>
                      </div>
                    </div>
                  </div>
                  {environment.assignedInstructorId === user.id && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      Actual
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <span className="material-symbols-outlined text-base shrink-0 text-amber-600 dark:text-amber-400">info</span>
            <span>
              Al asignar el nuevo instructor, todas las tomas físicas de los turnos <strong>6:00 AM, 12:00 M y 6:00 PM</strong> pendientes de este ambiente quedarán bajo su responsabilidad obligatoria.
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedUserId}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Guardar Asignación</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
