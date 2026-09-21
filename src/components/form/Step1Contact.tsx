import React from 'react';
import { User, Building2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import { Input } from '../ui/Input';
import { StepNotice } from './StepNotice';
import { ClientFormData } from '../../types';

interface Step1Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
  errors?: Record<string, string>;
}

export const Step1Contact: React.FC<Step1Props> = ({ data, onChange, errors = {} }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-700/80 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-teal-400" />
          1. Seus Dados & Contato
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Diga quem você é e os canais de contato que você quer colocar no seu site.
        </p>
      </div>

      <StepNotice message="Apenas o seu Nome é necessário para identificar seu projeto! Os outros campos (empresa, WhatsApp, Instagram, endereço) você preenche só se tiver e quiser." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nome do Cliente */}
        <div className="md:col-span-1">
          <Input
            label="Seu Nome Completo"
            placeholder="Ex: Maria Souza ou João Silva"
            required
            value={data.clientName}
            onChange={(e) => onChange('clientName', e.target.value)}
            error={errors.clientName}
            leftIcon={<User className="w-4 h-4" />}
            helperText="Seu nome para o Mateus saber de quem é este formulário."
          />
        </div>

        {/* Nome da Empresa */}
        <div className="md:col-span-1">
          <Input
            label="Nome da sua Empresa ou Negócio"
            placeholder="Ex: Padaria Central, Dr. Silva, etc."
            optional
            value={data.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            leftIcon={<Building2 className="w-4 h-4" />}
            helperText="O nome da sua marca como você quer que apareça no site."
          />
        </div>

        {/* WhatsApp */}
        <div className="md:col-span-1">
          <Input
            label="WhatsApp para contato"
            placeholder="Ex: (11) 99999-8888"
            optional
            value={data.whatsapp}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            helperText="Número onde seus clientes vão clicar para te chamar."
          />
        </div>

        {/* E-mail */}
        <div className="md:col-span-1">
          <Input
            label="E-mail"
            type="email"
            placeholder="Ex: seuemail@gmail.com"
            optional
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="Seu e-mail de contato (opcional)."
          />
        </div>

        {/* Instagram */}
        <div className="md:col-span-1">
          <Input
            label="Instagram do Negócio"
            placeholder="Ex: @suaempresa"
            optional
            value={data.instagram}
            onChange={(e) => onChange('instagram', e.target.value)}
            leftIcon={<InstagramIcon className="w-4 h-4" />}
            helperText="Para colocarmos o link da sua rede social no site."
          />
        </div>

        {/* Horário de Funcionamento */}
        <div className="md:col-span-1">
          <Input
            label="Horário de Atendimento"
            placeholder="Ex: Segunda a Sexta das 8h às 18h"
            optional
            value={data.businessHours}
            onChange={(e) => onChange('businessHours', e.target.value)}
            leftIcon={<Clock className="w-4 h-4" />}
            helperText="Seus dias e horários de funcionamento (se tiver)."
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <Input
            label="Endereço ou Cidade"
            placeholder="Ex: Rua das Flores, 123 - Centro ou apenas Cidade/Estado"
            optional
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            leftIcon={<MapPin className="w-4 h-4" />}
            helperText="Se você atende presencialmente ou quer que o cliente saiba onde você fica."
          />
        </div>
      </div>
    </div>
  );
};
