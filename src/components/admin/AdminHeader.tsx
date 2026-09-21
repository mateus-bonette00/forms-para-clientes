import React from 'react';
import { LogOut, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">Painel de Briefings</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Central de Materiais dos Clientes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            Abrir Formulário do Cliente
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-400"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

