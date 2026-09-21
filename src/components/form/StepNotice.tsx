import React from 'react';
import { Sparkles } from 'lucide-react';

interface StepNoticeProps {
  message?: string;
}

export const StepNotice: React.FC<StepNoticeProps> = ({
  message = 'Preencha somente se você tiver essas informações em mãos. Se não tiver agora, pode deixar em branco e clicar em Avançar que o Mateus te ajuda!',
}) => {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-950/40 border-2 border-teal-500/30 flex items-start sm:items-center gap-3 text-xs sm:text-sm text-teal-200 shadow-sm">
      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <p className="leading-relaxed">
        <strong className="text-white font-semibold">Só preencha se tiver:</strong> {message}
      </p>
    </div>
  );
};
