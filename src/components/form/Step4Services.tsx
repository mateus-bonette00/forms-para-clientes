import React from 'react';
import { Briefcase } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { StepNotice } from './StepNotice';
import { ClientFormData } from '../../types';

interface Step4Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

export const Step4Services: React.FC<Step4Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700/80 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-teal-400" />
          4. Seus Serviços ou Produtos
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Diga o que você vende ou os tipos de serviços que você presta para seus clientes.
        </p>
      </div>

      <StepNotice message="Só liste o que você lembrar agora de cabeça. Não precisa ser perfeito nem detalhado! Se preferir, pode até pular esta etapa e me mandar uma lista simples ou áudio no WhatsApp depois." />

      <div className="space-y-5">
        {/* Lista de Serviços / Produtos */}
        <Textarea
          label="Quais serviços ou produtos você oferece? (Opcional)"
          rows={6}
          placeholder={`Exemplo:\n- Venda de bolos e doces para festas\n- Atendimento clínico e consultas particulares\n- Manutenção preventiva e consertos gerais`}
          optional
          value={data.servicesList}
          onChange={(e) => onChange('servicesList', e.target.value)}
          helperText="Coloque os principais itens que você gostaria de ver divulgados no seu site."
        />

        {/* Público-Alvo */}
        <Textarea
          label="Quem costuma ser o seu cliente? (Opcional)"
          rows={3}
          placeholder="Ex: Famílias da região, mulheres de 25 a 45 anos, empresas, moradores do bairro..."
          optional
          value={data.targetAudience}
          onChange={(e) => onChange('targetAudience', e.target.value)}
          helperText="Isso me ajuda a deixar o design com a cara exata do público que compra de você."
        />
      </div>
    </div>
  );
};
