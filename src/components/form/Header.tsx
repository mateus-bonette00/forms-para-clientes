import React from 'react';
import { Sparkles, CheckCircle2, FileText, Palette, Users, Briefcase, Camera, Link2 } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; desc: string }[];
  onStepClick: (stepIndex: number) => void;
}

const STEP_ICONS = [
  <FileText className="w-4 h-4" />,
  <Palette className="w-4 h-4" />,
  <Sparkles className="w-4 h-4" />,
  <Briefcase className="w-4 h-4" />,
  <Camera className="w-4 h-4" />,
  <Link2 className="w-4 h-4" />,
];

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-teal-300" />
          Briefing & Envio de Materiais em Alta Resolução
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Vamos Criar o Seu{' '}
          <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent underline decoration-teal-500/30">
            Site Profissional
          </span>
        </h1>
        <p className="text-slate-300 mt-3 text-sm sm:text-base leading-relaxed font-normal">
          Preencha as informações do seu projeto e envie suas fotos em <strong>qualidade máxima original</strong> (sem a compressão do WhatsApp).
        </p>
      </div>

      {/* Progress Card */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 max-w-4xl mx-auto shadow-2xl border-2 border-slate-700/60">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-200 mb-3">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            Etapa {currentStep + 1} de {totalSteps}:{' '}
            <strong className="text-teal-300 font-bold">{steps[currentStep].title}</strong>
          </span>
          <span className="text-teal-300 font-mono bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/30 text-xs font-bold">
            {progress}% concluído
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-teal-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step clickable items */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mt-5 pt-4 border-t border-slate-800">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onStepClick(idx)}
                className={`flex flex-col items-center text-center p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-teal-500/20 text-white border-2 border-teal-400 shadow-md shadow-teal-500/10'
                    : isCompleted
                    ? 'bg-slate-900/60 text-slate-200 border border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/40 text-slate-400 border border-slate-800/80 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-1.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isCurrent
                          ? 'bg-teal-400 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 text-slate-300 font-semibold'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold truncate max-w-full">
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
