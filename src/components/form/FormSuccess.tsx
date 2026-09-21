import React from 'react';
import { CheckCircle2, Sparkles, Send, ArrowLeft, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/Button';

interface FormSuccessProps {
  clientName: string;
  onReset: () => void;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ clientName, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl border border-teal-500/30 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 mx-auto shadow-xl shadow-teal-500/30 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-teal-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Envio Concluído com Sucesso
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Obrigado, {clientName}!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Recebemos todas as suas informações e suas fotos em <strong>qualidade máxima original</strong> com sucesso!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto space-y-2 text-left">
          <div className="text-slate-200 font-semibold flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-teal-400" /> O que acontece agora?
          </div>
          <p>
            Nossa equipe já está analisando o material para iniciar a estrutura do seu site. Entraremos em contato via WhatsApp caso seja necessário algum alinhamento.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
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

