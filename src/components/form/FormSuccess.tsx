import React from 'react';
import { Sparkles, ArrowLeft, HeartHandshake, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface FormSuccessProps {
  clientName: string;
  onReset: () => void;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ clientName, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl border-2 border-teal-500/40 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Developer Trust Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src="/profile-2.jpg"
              alt="Mateus Bonette"
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-400 shadow-xl ring-4 ring-teal-500/20"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold border-2 border-slate-900 shadow">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Mateus Bonette</h4>
            <p className="text-xs text-teal-300 font-medium">Material Recebido com Sucesso</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Envio Concluído & Seguro
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Muito obrigado, {clientName}!
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Recebi todas as suas informações e suas fotos em <strong>qualidade máxima original</strong>!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border-2 border-slate-700 text-xs text-slate-300 max-w-md mx-auto space-y-2.5 text-left shadow-lg">
          <div className="text-white font-bold flex items-center gap-2 text-sm">
            <HeartHandshake className="w-4 h-4 text-teal-400" /> O que acontece agora?
          </div>
          <p className="leading-relaxed">
            Eu (Mateus) já estou com o seu briefing em mãos e vou iniciar a estrutura do seu site. Qualquer dúvida ou alinhamento pontual, entrarei em contato diretamente pelo seu WhatsApp.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onReset}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Enviar outro formulário
          </Button>
        </div>
      </div>
    </div>
  );
};
