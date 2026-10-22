import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_ACCOUNTS } from '../../lib/authService';

export const LoginModal: React.FC = () => {
  const { activeModal, closeModal, loginWithJwt, showToast } = useApp();

  const [email, setEmail] = useState('carlos.mendoza@edustock.edu');
  const [password, setPassword] = useState('Admin123*');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (activeModal !== 'login') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await loginWithJwt(email, password);
      if (result.success) {
        showToast(result.message, 'success', 'verified_user');
        closeModal();
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage('Ocurrió un error inesperado al procesar la autenticación JWT.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center ring-4 ring-blue-500/10">
              <span className="material-symbols-outlined text-[26px]">lock</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300">
                  AUTENTICACIÓN JWT RFC-7519
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white leading-tight mt-0.5">
                Acceso de Administrador
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                La información es pública, pero las opciones de Admin requieren Token JWT firmado.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-rose-500 shrink-0 mt-0.5">
                error
              </span>
              <div className="flex-1">
                <span className="font-semibold block">Error de autenticación:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Correo Electrónico Institucional
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@edustock.edu"
                  className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Contraseña de Seguridad
                </label>
                <span className="text-[11px] text-slate-400">
                  HMAC-SHA256 Protegido
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px]">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-10 pr-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Cryptographic token indicator note */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-emerald-500">
                shield
              </span>
              <span>
                Al ingresar se emitirá un <strong>Token JWT firmado</strong> que otorgará acceso temporal de lectura/escritura (Admin RW).
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Generando y validando firma JWT...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Ingresar como Administrador (JWT)</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Credenciales de Prueba Rápida (1 Clic)
              </span>
              <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-medium">
                Haz clic para autocompletar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemoAccount(acc.email, acc.defaultPassword)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    acc.role === 'admin'
                      ? 'border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {acc.name}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      acc.role === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {acc.role.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {acc.email}
                  </span>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Clave: <strong className="font-mono text-slate-600 dark:text-slate-300">{acc.defaultPassword}</strong></span>
                    <span className="text-blue-600 dark:text-cyan-400 font-semibold flex items-center gap-0.5">
                      Rellenar
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>ControlAdso • SENA CTMA</span>
          <button 
            type="button" 
            onClick={closeModal}
            className="text-slate-600 dark:text-slate-300 hover:underline font-semibold"
          >
            Continuar en modo Consulta (Lectura)
          </button>
        </div>
      </div>
    </div>
  );
};
