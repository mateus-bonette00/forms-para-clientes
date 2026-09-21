import React from 'react';
import {
  CheckCircle2,
  Lock,
  UserCheck,
  Check,
  Sparkles,
  Camera
} from 'lucide-react';

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
      {/* Developer Branding & Trust Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-6">
        {/* Logo Mateus */}
        <div className="mb-5 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <img
            src="/logo-branca-mateus.png"
            alt="Mateus Bonette"
            className="h-16 sm:h-24 md:h-28 w-auto max-w-[280px] sm:max-w-sm object-contain drop-shadow-xl"
          />
        </div>

        {/* Profile Badge & Trust Greeting */}
        <div className="inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-slate-700 shadow-2xl mb-4">
          <div className="relative">
            <img
              src="/profile-2.jpg"
              alt="Mateus Bonette"
              className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shadow-md ring-2 ring-teal-500/25"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow" title="Online" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white leading-tight">Mateus Bonette</h3>
              <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />
            </div>
            <p className="text-xs text-slate-300 font-medium">Desenvolvedor do seu Projeto</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mt-1">
          Coleta de Informações & Fotos{' '}
          <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent underline decoration-teal-500/40">
            para o Seu Site
          </span>
        </h1>

        {/* Super Friendly Reassurance Banner for Laypeople */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900/90 to-teal-950/70 border-2 border-teal-500/40 shadow-xl text-left max-w-2xl w-full">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Fique super tranquilo(a): você NÃO precisa ter tudo pronto!
              </h4>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                <strong>Só preencha o que você já tiver em mãos.</strong> O que você não tiver ou não souber agora, pode deixar em branco e pular. Qualquer detalhe que você me mandar já me ajuda muito a adiantar o seu site!
              </p>
            </div>
          </div>
        </div>

        {/* Security & Confidentiality Trust Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mt-4">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-teal-500/40 flex items-center justify-center gap-2 text-xs font-semibold text-teal-200 shadow-sm">
            <Lock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Ambiente 100% Seguro</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-200 shadow-sm">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Acesso Exclusivo de Mateus</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center gap-2 text-xs font-semibold text-cyan-200 shadow-sm">
            <Camera className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Quanto mais fotos, melhor!</span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 max-w-4xl mx-auto shadow-2xl border-2 border-slate-700/80">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-200 mb-3">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            Etapa {currentStep + 1} de {totalSteps}:{' '}
            <strong className="text-teal-300 font-bold">{steps[currentStep].title}</strong>
          </span>
          <span className="text-teal-300 font-mono bg-teal-950/90 px-3 py-1 rounded-lg border border-teal-500/40 text-xs font-bold shadow-sm">
            {progress}% concluído
          </span>
        </div>

        {/* Progress line */}
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
