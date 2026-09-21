import React from 'react';
import { Briefcase, Users, HelpCircle } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { ClientFormData } from '../../types';

interface Step4Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

export const Step4Services: React.FC<Step4Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-teal-400" />
          4. Serviços, Produtos & Público-Alvo
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Descreva quais soluções sua empresa oferece e para quem você vende.
        </p>
      </div>

      <div className="space-y-5">
        {/* Lista de Serviços / Produtos */}
        <Textarea
          label="Lista de Serviços ou Produtos Principais"
          rows={6}
          placeholder={`Ex:\n1. Consultoria Estratégica: Diagnóstico completo e plano de ação personalizado.\n2. Treinamento de Equipe: Workshops práticos presenciais ou remotos.\n3. Suporte Mensal Dedicado: Acompanhamento contínuo e relatórios periódicos.`}
          optional
          value={data.servicesList}
          onChange={(e) => onChange('servicesList', e.target.value)}
          helperText="Liste cada serviço/produto com um breve resumo de como funciona e seus benefícios."
        />

        {/* Público-Alvo */}
        <Textarea
          label="Quem é o seu Público-Alvo / Cliente Ideal?"
          rows={3}
          placeholder="Ex: Pequenos e médios empresários do setor de comércio, profissionais liberais, clínicas médicas..."
          optional
          value={data.targetAudience}
          onChange={(e) => onChange('targetAudience', e.target.value)}
          helperText="Isso nos ajuda a direcionar a linguagem visual e textual do site."
        />
      </div>
    </div>
  );
};

