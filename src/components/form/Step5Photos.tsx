import React, { useRef, useState } from 'react';
import {
  Camera,
  Trash2,
  ImagePlus,
  Layers,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { ClientFormData, UploadedFileItem } from '../../types';
import { uploadFile } from '../../services/upload';
import { StepNotice } from './StepNotice';

interface Step5Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

const CATEGORIES: { label: string; value: UploadedFileItem['fileCategory'] }[] = [
  { label: '✨ O Mateus escolhe o melhor lugar no site', value: 'OUTRO' },
  { label: '👤 Minha Foto / Da Minha Equipe', value: 'EQUIPE' },
  { label: '🏢 Meu Local / Fachada / Ambiente', value: 'ESPACO' },
  { label: '🛠️ Meus Serviços / Trabalhos Realizados', value: 'SERVICO' },
  { label: '📦 Meus Produtos / Peças à Venda', value: 'PRODUTO' },
];

export const Step5Photos: React.FC<Step5Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  // Photos excluding logos (handled in Step 2)
  const photos = data.files.filter((f) => f.fileCategory !== 'LOGO');

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const newItems: UploadedFileItem[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadStatusText(`Enviando foto ${i + 1} de ${selectedFiles.length}: "${file.name}"...`);

      try {
        const uploadedUrl = await uploadFile(file);

        newItems.push({
          fileCategory: 'OUTRO',
          fileName: file.name,
          fileUrl: uploadedUrl,
          fileSize: file.size,
          mimeType: file.type,
          caption: '',
          previewUrl: URL.createObjectURL(file),
        });
      } catch (err) {
        console.error(`Erro ao subir imagem ${file.name}:`, err);
      }
    }

    const logos = data.files.filter((f) => f.fileCategory === 'LOGO');
    const existingPhotos = data.files.filter((f) => f.fileCategory !== 'LOGO');
    const updatedFiles = [...logos, ...existingPhotos, ...newItems];

    onChange('files', updatedFiles);
    setIsUploading(false);
    setUploadStatusText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateCategory = (index: number, category: UploadedFileItem['fileCategory']) => {
    const logos = data.files.filter((f) => f.fileCategory === 'LOGO');
    const updatedPhotos = [...photos];
    updatedPhotos[index] = { ...updatedPhotos[index], fileCategory: category };

    onChange('files', [...logos, ...updatedPhotos]);
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const logos = data.files.filter((f) => f.fileCategory === 'LOGO');
    const updatedPhotos = [...photos];
    updatedPhotos[index] = { ...updatedPhotos[index], caption };

    onChange('files', [...logos, ...updatedPhotos]);
  };

  const handleRemovePhoto = (index: number) => {
    const logos = data.files.filter((f) => f.fileCategory === 'LOGO');
    const updatedPhotos = photos.filter((_, i) => i !== index);

    onChange('files', [...logos, ...updatedPhotos]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-700/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                <Camera className="w-5 h-5" />
              </div>
              5. Envie as Fotos do seu Negócio
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Fotos tiradas no celular, fotos do seu espaço, dos seus trabalhos ou da sua equipe.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-500/20 border-2 border-teal-400/40 text-teal-200 text-xs font-bold self-start sm:self-auto shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-300" />
            Quanto mais fotos, melhor!
          </div>
        </div>
      </div>

      {/* Step Notice */}
      <StepNotice message="Não tem fotos agora? Fique 100% tranquilo(a)! Se você não tiver fotos, pode avançar sem nenhuma que o Mateus utiliza fotos profissionais de alta qualidade para o seu nicho. Mas se você tiver fotos reais no celular, envie quantas quiser!" />

      {/* Dica de Encorajamento */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border-2 border-slate-700 flex items-start gap-3.5 text-xs sm:text-sm text-slate-200 shadow-sm">
        <HeartHandshake className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Dica amiga:</strong> Não precisa de fotos profissionais de estúdio! Fotos simples do seu dia a dia, do seu balcão, você atendendo ou dos trabalhos que você já fez trazem muita credibilidade para seus futuros clientes. <strong>Pode selecionar várias fotos de uma vez só!</strong>
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-3 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
          isUploading
            ? 'border-teal-400 bg-teal-500/10'
            : 'border-slate-600 bg-slate-900/80 hover:border-teal-400 hover:bg-slate-900 shadow-xl'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFilesSelect}
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border-2 border-teal-400/50 flex items-center justify-center text-teal-300 mb-4 shadow-lg">
            <ImagePlus className="w-8 h-8" />
          </div>

          {isUploading ? (
            <div className="w-full max-w-sm space-y-3">
              <p className="text-sm font-bold text-teal-200 animate-pulse">
                {uploadStatusText || 'Enviando suas fotos...'}
              </p>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-teal-400 h-full rounded-full animate-indeterminate" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-base sm:text-lg font-bold text-white">
                Clique aqui para escolher as fotos (pode enviar várias juntas)
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1.5">
                Fotos do seu celular, fotos de trabalhos, equipe, fachada ou produtos
              </p>
              <span className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-sm font-bold shadow-lg transition-colors cursor-pointer">
                + Selecionar Fotos no Celular ou Computador
              </span>
            </>
          )}
        </div>
      </div>

      {/* Lista de Fotos Carregadas */}
      {photos.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              Fotos Adicionadas ({photos.length})
            </h3>
            <span className="text-xs text-teal-300 font-medium">
              ✅ Já estão salvas!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photos.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-4 flex flex-col gap-3 shadow-xl"
              >
                <div className="flex items-center gap-3.5">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-950 border-2 border-slate-700 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                    <img
                      src={item.fileUrl || item.previewUrl}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/25">
                        Pronta para o site
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors border border-transparent hover:border-rose-500/30 cursor-pointer"
                    title="Remover foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Categorização e Legenda */}
                <div className="grid grid-cols-1 gap-2.5 pt-3 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-200 mb-1 block">
                      Onde você prefere usar essa foto?
                    </label>
                    <select
                      value={item.fileCategory}
                      onChange={(e) =>
                        handleUpdateCategory(idx, e.target.value as UploadedFileItem['fileCategory'])
                      }
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-teal-400 cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200 mb-1 block">
                      Quer deixar algum recado sobre ela? (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Foto do meu sócio, foto do salão, etc."
                      value={item.caption || ''}
                      onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-teal-400 placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
