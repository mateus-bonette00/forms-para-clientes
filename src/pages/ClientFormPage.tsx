import React, { useState } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Lock, ShieldCheck } from 'lucide-react';
import { Header } from '../components/form/Header';
import { Step1Contact } from '../components/form/Step1Contact';
import { Step2Branding } from '../components/form/Step2Branding';
import { Step3Institutional } from '../components/form/Step3Institutional';
import { Step4Services } from '../components/form/Step4Services';
import { Step5Photos } from '../components/form/Step5Photos';
import { Step6References } from '../components/form/Step6References';
import { FormSuccess } from '../components/form/FormSuccess';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ClientFormData } from '../types';
import api from '../services/api';

const STEPS = [
  { title: 'Contato', desc: 'Identificação básica' },
  { title: 'Marca', desc: 'Logotipo e cores' },
  { title: 'Institucional', desc: 'Sobre e história' },
  { title: 'Serviços', desc: 'O que você oferece' },
  { title: 'Fotos HD', desc: 'Imagens em alta qualidade' },
  { title: 'Referências', desc: 'Inspirações e envio' },
];

const INITIAL_FORM_DATA: ClientFormData = {
  clientName: '',
  companyName: '',
  email: '',
  whatsapp: '',
  instagram: '',
  address: '',
  businessHours: '',
  colorPalette: '',
  aboutMe: '',
  history: '',
  mission: '',
  vision: '',
  values: '',
  slogan: '',
  differentials: '',
  targetAudience: '',
  servicesList: '',
  files: [],
  referenceLinks: '',
  testimonials: '',
  additionalNotes: '',
};

export const ClientFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ClientFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (field: keyof ClientFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.clientName.trim()) {
        newErrors.clientName = 'Por favor, informe seu nome para identificação.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.error('Por favor, preencha os campos obrigatórios destacados.');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!formData.clientName.trim()) {
      setCurrentStep(0);
      toast.error('O nome do cliente é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/submissions', formData);
      if (response.data?.success) {
        setIsSubmitted(true);
        toast.success('Formulário e fotos enviados com sucesso para Mateus Bonette!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error('Ocorreu um erro ao enviar o formulário.');
      }
    } catch (err: any) {
      console.error('Erro no envio:', err);
      const msg = err.response?.data?.error || 'Erro ao enviar dados. Tente novamente.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return <FormSuccess clientName={formData.clientName} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between">
      <div>
        <Header
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
          onStepClick={(idx) => {
            if (idx <= currentStep || validateCurrentStep()) {
              setCurrentStep(idx);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />

        <Card className="max-w-4xl mx-auto border-2 border-slate-700/80 shadow-2xl">
          {currentStep === 0 && (
            <Step1Contact
              data={formData}
              onChange={handleFieldChange}
              errors={errors}
            />
          )}

          {currentStep === 1 && (
            <Step2Branding data={formData} onChange={handleFieldChange} />
          )}

          {currentStep === 2 && (
            <Step3Institutional data={formData} onChange={handleFieldChange} />
          )}

          {currentStep === 3 && (
            <Step4Services data={formData} onChange={handleFieldChange} />
          )}

          {currentStep === 4 && (
            <Step5Photos data={formData} onChange={handleFieldChange} />
          )}

          {currentStep === 5 && (
            <Step6References
              data={formData}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handlePrev}
              disabled={currentStep === 0 || isSubmitting}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Voltar
            </Button>

            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Etapa {currentStep + 1} de {STEPS.length}
            </span>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Avançar
              </Button>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Footer with Mateus branding */}
      <footer className="mt-12 text-center py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <img src="/logo-branca-mateus.png" alt="Mateus Bonette" className="h-6 w-auto object-contain opacity-90" />
          <span>© {new Date().getFullYear()} • Plataforma Segura de Briefing</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Seus dados estão seguros
          </span>
          <a
            href="#/admin/login"
            className="hover:text-teal-300 text-slate-300 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Lock className="w-3.5 h-3.5" /> Área do Desenvolvedor
          </a>
        </div>
      </footer>
    </div>
  );
};
