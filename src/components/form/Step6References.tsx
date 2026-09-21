import React from 'react';
import { Link2, Sparkles, Send } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { StepNotice } from './StepNotice';
import { ClientFormData } from '../../types';

interface Step6Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const Step6References: React.FC<Step6Props> = ({
  data,
  onChange,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700/80 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-teal-400" />
          6. Referências & Envio Final
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Última etapa! Se você viu algum site na internet que achou bonito, pode mandar o link aqui.
        </p>
      </div>

      <StepNotice message="Não conhece nenhum site de exemplo ou não tem depoimentos agora? Não precisa preencher nada aqui! Pode ir direto para o botão verde abaixo para finalizar e me enviar o que você preencheu." />

      <div className="space-y-5">
        {/* Sites de Referência */}
        <Textarea
          label="Sites que você gosta ou achou bonito (Opcional)"
          rows={3}
          placeholder="Ex: www.exemplo.com.br (Gosto do estilo moderno e limpo deste site)"
          optional
          value={data.referenceLinks}
          onChange={(e) => onChange('referenceLinks', e.target.value)}
          helperText="Cole aqui links ou nomes de sites que você achou legais na internet."
        />

        {/* Depoimentos de Clientes */}
        <Textarea
          label="Tem depoimentos ou avaliações de clientes? (Opcional)"
          rows={4}
          placeholder={`Ex:\n"Atendimento nota 10, recomendo!" - Maria\n"O melhor serviço da cidade." - Pedro`}
          optional
          value={data.testimonials}
          onChange={(e) => onChange('testimonials', e.target.value)}
          helperText="Mensagens que você recebeu no WhatsApp ou elogios no Google."
        />

        {/* Observações Extras */}
        <Textarea
          label="Quer me falar mais alguma coisa sobre seu projeto? (Opcional)"
          rows={3}
          placeholder="Ex: Quero um botão bem grande do WhatsApp, quero destacar meu endereço..."
          optional
          value={data.additionalNotes}
          onChange={(e) => onChange('additionalNotes', e.target.value)}
          helperText="Qualquer recado ou preferência sua para o Mateus."
        />
      </div>

      {/* Recap & Submit Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border-2 border-teal-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tudo pronto para enviar?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Eu (Mateus) vou receber suas informações e fotos para começar o planejamento do seu site!
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full text-base py-4 font-bold"
            onClick={onSubmit}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-5 h-5" />}
          >
            {isSubmitting ? 'Enviando informações para o Mateus...' : 'Finalizar e Enviar para o Mateus'}
          </Button>
        </div>
      </div>
    </div>
  );
};
