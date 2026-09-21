import React, { useState } from 'react';
import { FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { StepNotice } from './StepNotice';
import { ClientFormData } from '../../types';

interface Step3Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

export const Step3Institutional: React.FC<Step3Props> = ({ data, onChange }) => {
  const [showMvv, setShowMvv] = useState(
    Boolean(data.mission || data.vision || data.values)
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700/80 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-400" />
          3. Textos & História do seu Negócio
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Conte um pouco sobre sua empresa, como começou e o que você faz.
        </p>
      </div>

      <StepNotice message="Não tem textos prontos ou bonitos? Fique tranquilo(a)! Escreva com suas próprias palavras ou deixe em branco. O Mateus vai estruturar e redigir textos profissionais para o seu site." />

      <div className="space-y-5">
        {/* Slogan */}
        <Input
          label="Slogan ou Frase que você gosta (Opcional)"
          placeholder="Ex: A sua melhor escolha na cidade / Cuidando do seu bem-estar"
          optional
          value={data.slogan}
          onChange={(e) => onChange('slogan', e.target.value)}
          helperText="Uma frase curta que resuma o que você faz, se tiver."
        />

        {/* Sobre Mim / Sobre a Empresa */}
        <Textarea
          label="Conte um pouco sobre você ou sua empresa (Opcional)"
          rows={5}
          placeholder="Ex: Começamos em 2020 com o sonho de atender os clientes de forma diferenciada... (escreva do jeito que preferir)"
          optional
          value={data.aboutMe}
          onChange={(e) => onChange('aboutMe', e.target.value)}
          helperText="Escreva livremente, como se estivesse conversando comigo no WhatsApp. Eu vou ajustar e deixar elegante para o site!"
        />

        {/* Diferenciais */}
        <Textarea
          label="Quais são os seus pontos fortes? (Opcional)"
          rows={3}
          placeholder="Ex: Atendimento rápido, pontualidade, anos de experiência, produtos de qualidade, etc."
          optional
          value={data.differentials}
          onChange={(e) => onChange('differentials', e.target.value)}
          helperText="Por que as pessoas escolhem o seu serviço?"
        />

        {/* Botão de Expansão para Missão, Visão e Valores */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowMvv(!showMvv)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Missão, Visão e Valores (Opcional - Clique para {showMvv ? 'ocultar' : 'adicionar se tiver'})
            </span>
            {showMvv ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showMvv && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-700">
              <Textarea
                label="Missão (Opcional)"
                rows={3}
                placeholder="Qual é o propósito do seu trabalho?"
                optional
                value={data.mission}
                onChange={(e) => onChange('mission', e.target.value)}
              />

              <Textarea
                label="Visão (Opcional)"
                rows={3}
                placeholder="Onde seu negócio quer chegar?"
                optional
                value={data.vision}
                onChange={(e) => onChange('vision', e.target.value)}
              />

              <Textarea
                label="Valores (Opcional)"
                rows={3}
                placeholder="Ex: Honestidade, qualidade, respeito..."
                optional
                value={data.values}
                onChange={(e) => onChange('values', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
