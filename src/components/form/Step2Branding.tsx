import React, { useRef, useState } from 'react';
import { Palette, Upload, Image as ImageIcon, CheckCircle, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { ClientFormData, UploadedFileItem } from '../../types';
import { uploadFile } from '../../services/upload';

interface Step2Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

export const Step2Branding: React.FC<Step2Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Find existing logo in files list
  const logoFile = data.files.find((f) => f.fileCategory === 'LOGO');

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const uploadedUrl = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      const newLogoItem: UploadedFileItem = {
        fileCategory: 'LOGO',
        fileName: file.name,
        fileUrl: uploadedUrl,
        fileSize: file.size,
        mimeType: file.type,
        caption: 'Logotipo Oficial',
        previewUrl: URL.createObjectURL(file),
      };

      // Replace or add logo to files array
      const otherFiles = data.files.filter((f) => f.fileCategory !== 'LOGO');
      onChange('files', [...otherFiles, newLogoItem]);
    } catch (err) {
      console.error('Erro no upload do logotipo:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    onChange(
      'files',
      data.files.filter((f) => f.fileCategory !== 'LOGO')
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-teal-400" />
          2. Logotipo & Identidade Visual
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Envie sua marca em alta resolução (vetor, PNG sem fundo ou PDF) e suas preferências de cores.
        </p>
      </div>

      {/* Upload de Logotipo em Alta Qualidade */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-400" />
            Logotipo Principal
          </label>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Qualidade 100% Original Preservada
          </div>
        </div>

        {logoFile ? (
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={logoFile.fileUrl || logoFile.previewUrl}
                  alt="Logotipo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white truncate max-w-xs">{logoFile.fileName}</h4>
                  <span className="bg-teal-500/10 text-teal-400 text-[11px] px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">
                    {logoFile.fileSize ? `${(logoFile.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Alta Resolução'}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Arquivo pronto para o desenvolvimento
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveLogo}
              className="p-2.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 transition-colors flex items-center gap-2 text-xs"
            >
              <Trash2 className="w-4 h-4" />
              Substituir Logotipo
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isUploading
                ? 'border-teal-500/50 bg-teal-500/5'
                : 'border-slate-800 hover:border-teal-500/40 hover:bg-slate-900/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.svg,.pdf,.ai,.eps,.psd"
              onChange={handleLogoSelect}
            />

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
                <Upload className="w-6 h-6" />
              </div>

              {isUploading ? (
                <div className="w-full max-w-xs space-y-2">
                  <p className="text-sm font-medium text-teal-300">Enviando em alta resolução...</p>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{uploadProgress}%</span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-200">
                    Clique para selecionar o Logotipo ou arraste aqui
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Formatos aceitos: PNG (com fundo transparente), SVG, PDF, JPG, AI ou EPS
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Paleta de Cores e Preferências */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="md:col-span-1">
          <Input
            label="Cores Principais ou Paleta Desejada"
            placeholder="Ex: Azul Petróleo, Dourado e Branco (#0f766e, #d97706)"
            optional
            value={data.colorPalette}
            onChange={(e) => onChange('colorPalette', e.target.value)}
            helperText="Se tiver os códigos hexadecimais ou apenas o nome das cores."
            leftIcon={<Palette className="w-4 h-4" />}
          />
        </div>

        <div className="md:col-span-1 flex flex-col justify-center">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Dica de Identidade Visual
            </div>
            <p>
              Caso você ainda não tenha cores definidas, nossa equipe criará uma proposta harmônica baseada no seu logotipo e segmento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

