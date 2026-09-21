import React, { useState } from 'react';
import { FileText, Sparkles, ChevronDown, ChevronUp, Target, Eye, Heart } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
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
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-400" />
          3. Textos Institucionais & Conteúdo
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Conte a história do seu negócio e o que faz sua empresa ser única.
        </p>
      </div>

      <div className="space-y-5">
        {/* Slogan */}
        <Input
          label="Slogan ou Frase de Impacto"
          placeholder="Ex: Transformando ideias em resultados digitais de alta performance."
          optional
          value={data.slogan}
          onChange={(e) => onChange('slogan', e.target.value)}
          helperText="Frase que resume seu propósito ou proposta de valor principal."
        />

        {/* Sobre Mim / Sobre a Empresa */}
        <Textarea
          label="Texto 'Sobre Mim' ou 'Sobre a Empresa'"
          rows={5}
          placeholder="Ex: Fundada em 2018, nossa empresa nasceu com o objetivo de oferecer soluções completas e humanizadas..."
          optional
          value={data.aboutMe}
          onChange={(e) => onChange('aboutMe', e.target.value)}
          helperText="Escreva livremente. Ajustaremos o tom de voz e a estrutura para o layout do site."
        />

        {/* Diferenciais */}
        <Textarea
          label="Principais Diferenciais do seu Negócio"
          rows={3}
          placeholder="Ex: Atendimento 24h, mais de 10 anos de experiência, garantia de satisfação, tecnologia de ponta..."
          optional
          value={data.differentials}
          onChange={(e) => onChange('differentials', e.target.value)}
          helperText="Por que os clientes devem escolher você em vez da concorrência?"
        />

        {/* Botão de Expansão para Missão, Visão e Valores */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowMvv(!showMvv)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Missão, Visão e Valores (Clique para {showMvv ? 'ocultar' : 'adicionar'})
            </span>
            {showMvv ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showMvv && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <Textarea
                label="Missão"
                rows={3}
                placeholder="Qual é a razão de existir da sua empresa?"
                optional
                value={data.mission}
                onChange={(e) => onChange('mission', e.target.value)}
              />

              <Textarea
                label="Visão"
                rows={3}
                placeholder="Onde a empresa quer chegar no futuro?"
                optional
                value={data.vision}
                onChange={(e) => onChange('vision', e.target.value)}
              />

              <Textarea
                label="Valores"
                rows={3}
                placeholder="Ex: Ética, transparência, inovação, empatia..."
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

