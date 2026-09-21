import React from 'react';
import { Link2, MessageSquareQuote, HelpCircle, Send, CheckSquare, Sparkles } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
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
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-teal-400" />
          6. Referências, Depoimentos & Observações Finais
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Última etapa! Compartilhe sites de inspiração ou qualquer detalhe extra para o seu projeto.
        </p>
      </div>

      <div className="space-y-5">
        {/* Sites de Referência */}
        <Textarea
          label="Sites de Inspiração ou Concorrentes (Links)"
          rows={3}
          placeholder="Ex: https://exemplo.com.br (Gosto do estilo moderno e das cores deste site)"
          optional
          value={data.referenceLinks}
          onChange={(e) => onChange('referenceLinks', e.target.value)}
          helperText="Cole links de sites que você acha bonitos, mesmo de outros ramos de atividade."
        />

        {/* Depoimentos de Clientes */}
        <Textarea
          label="Depoimentos ou Avaliações de Clientes (Google, WhatsApp, etc.)"
          rows={4}
          placeholder={`Ex:\n"Excelente atendimento e rapidez na entrega!" - João Pereira\n"O melhor serviço da região, recomendo a todos." - Maria Souza`}
          optional
          value={data.testimonials}
          onChange={(e) => onChange('testimonials', e.target.value)}
          helperText="Depoimentos reais ajudam a gerar confiança e conversões no seu site."
        />

        {/* Observações Extras */}
        <Textarea
          label="Alguma observação, pedido especial ou detalhe que não foi citado?"
          rows={3}
          placeholder="Ex: Gostaria de ter um botão flutuante do WhatsApp em todas as páginas..."
          optional
          value={data.additionalNotes}
          onChange={(e) => onChange('additionalNotes', e.target.value)}
        />
      </div>

      {/* Recap & Submit Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Tudo pronto para enviar?</h3>
            <p className="text-xs text-slate-400">
              Seus textos e fotos em alta resolução serão encaminhados com segurança para nossa equipe.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full text-base"
            onClick={onSubmit}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-5 h-5" />}
          >
            {isSubmitting ? 'Enviando Briefing e Fotos...' : 'Finalizar e Enviar Material Completo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

