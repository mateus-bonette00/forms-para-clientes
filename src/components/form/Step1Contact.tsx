import React from 'react';
import { User, Building2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import { Input } from '../ui/Input';
import { ClientFormData } from '../../types';

interface Step1Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
  errors?: Record<string, string>;
}

export const Step1Contact: React.FC<Step1Props> = ({ data, onChange, errors = {} }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-teal-400" />
          1. Identificação & Informações de Contato
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Informe seus dados básicos e os canais de contato que devem aparecer no seu site.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nome do Cliente */}
        <div className="md:col-span-1">
          <Input
            label="Seu Nome Completo"
            placeholder="Ex: Mateus Silva"
            required
            value={data.clientName}
            onChange={(e) => onChange('clientName', e.target.value)}
            error={errors.clientName}
            leftIcon={<User className="w-4 h-4" />}
            helperText="Nome do responsável pelo projeto."
          />
        </div>

        {/* Nome da Empresa */}
        <div className="md:col-span-1">
          <Input
            label="Nome da Empresa / Projeto"
            placeholder="Ex: Silva & Associados, Clínica Vida, etc."
            optional
            value={data.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            leftIcon={<Building2 className="w-4 h-4" />}
            helperText="Como a marca deve ser chamada no site."
          />
        </div>

        {/* WhatsApp */}
        <div className="md:col-span-1">
          <Input
            label="WhatsApp de Atendimento"
            placeholder="Ex: (11) 98765-4321"
            optional
            value={data.whatsapp}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            helperText="Número para botões de contato direto no site."
          />
        </div>

        {/* E-mail */}
        <div className="md:col-span-1">
          <Input
            label="E-mail Principal"
            type="email"
            placeholder="Ex: contato@suaempresa.com.br"
            optional
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="E-mail para formulários e rodapé."
          />
        </div>

        {/* Instagram */}
        <div className="md:col-span-1">
          <Input
            label="Instagram"
            placeholder="Ex: @suaempresa ou link completo"
            optional
            value={data.instagram}
            onChange={(e) => onChange('instagram', e.target.value)}
            leftIcon={<InstagramIcon className="w-4 h-4" />}
            helperText="Perfil para links de redes sociais."
          />
        </div>

        {/* Horário de Funcionamento */}
        <div className="md:col-span-1">
          <Input
            label="Horário de Atendimento / Funcionamento"
            placeholder="Ex: Seg a Sex das 08h às 18h / Sáb das 09h às 13h"
            optional
            value={data.businessHours}
            onChange={(e) => onChange('businessHours', e.target.value)}
            leftIcon={<Clock className="w-4 h-4" />}
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <Input
            label="Endereço Físico (se aplicável)"
            placeholder="Ex: Av. Paulista, 1000, Sala 50 - São Paulo/SP"
            optional
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            leftIcon={<MapPin className="w-4 h-4" />}
            helperText="Se você atende no local ou deseja mapa no site."
          />
        </div>
      </div>
    </div>
  );
};
