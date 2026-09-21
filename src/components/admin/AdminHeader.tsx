import React from 'react';
import { LogOut, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="border-b-2 border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        <div className="flex items-center gap-3.5">
          <img
            src="/profile-2.jpg"
            alt="Mateus Bonette"
            className="w-10 h-10 rounded-full object-cover border-2 border-teal-400 shadow-md ring-2 ring-teal-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white leading-none">Painel de Briefings</h1>
              <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30">
                Mateus Bonette
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Central de Materiais & Fotos HD</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white hover:text-teal-300 bg-slate-900 border-2 border-slate-700 hover:border-teal-500/50 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            Abrir Formulário do Cliente
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-300 hover:bg-rose-500/10"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
