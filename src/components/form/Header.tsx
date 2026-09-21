import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; desc: string }[];
  onStepClick: (stepIndex: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}) => {
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      {/* Brand & Intro */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Briefing & Envio de Materiais
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Vamos Criar o Seu <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Site Perfeito</span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          Preencha as informações abaixo e envie suas fotos em <strong>qualidade máxima original</strong>. 
          Não se preocupe se não tiver tudo pronto agora: preencha o que puder!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 max-w-4xl mx-auto shadow-lg">
        <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-3">
          <span>Etapa {currentStep + 1} de {totalSteps}: <strong className="text-teal-400 font-semibold">{steps[currentStep].title}</strong></span>
          <span className="text-slate-300 font-mono">{progress}% concluído</span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm shadow-teal-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots navigation */}
        <div className="grid grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onStepClick(idx)}
                className={`flex flex-col items-center text-center p-1.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-slate-800/60'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  ) : (
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                        isCurrent
                          ? 'bg-teal-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-[11px] font-medium truncate max-w-full">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

