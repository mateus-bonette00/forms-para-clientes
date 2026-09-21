import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  ShieldCheck,
  Trash2,
  Tag,
  CheckCircle2,
  FileImage,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { ClientFormData, UploadedFileItem } from '../../types';
import { uploadFile } from '../../services/upload';

interface Step5Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

const CATEGORIES: { label: string; value: UploadedFileItem['fileCategory'] }[] = [
  { label: 'Equipe / Perfil', value: 'EQUIPE' },
  { label: 'Espaço / Fachada', value: 'ESPACO' },
  { label: 'Serviço em Ação', value: 'SERVICO' },
  { label: 'Produto / Portfólio', value: 'PRODUTO' },
  { label: 'Outro', value: 'OUTRO' },
];

export const Step5Photos: React.FC<Step5Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  // Photos excluding the main logo (which was handled in Step 2)
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
          fileCategory: 'SERVICO',
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

    // Keep existing logo and previous photos + new photos
    const logoFile = data.files.find((f) => f.fileCategory === 'LOGO');
    const existingPhotos = data.files.filter((f) => f.fileCategory !== 'LOGO');
    const updatedFiles = logoFile
      ? [logoFile, ...existingPhotos, ...newItems]
      : [...existingPhotos, ...newItems];

    onChange('files', updatedFiles);
    setIsUploading(false);
    setUploadStatusText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateCategory = (index: number, category: UploadedFileItem['fileCategory']) => {
    const logoFile = data.files.find((f) => f.fileCategory === 'LOGO');
    const updatedPhotos = [...photos];
    updatedPhotos[index] = { ...updatedPhotos[index], fileCategory: category };

    onChange('files', logoFile ? [logoFile, ...updatedPhotos] : updatedPhotos);
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const logoFile = data.files.find((f) => f.fileCategory === 'LOGO');
    const updatedPhotos = [...photos];
    updatedPhotos[index] = { ...updatedPhotos[index], caption };

    onChange('files', logoFile ? [logoFile, ...updatedPhotos] : updatedPhotos);
  };

  const handleRemovePhoto = (index: number) => {
    const logoFile = data.files.find((f) => f.fileCategory === 'LOGO');
    const updatedPhotos = photos.filter((_, i) => i !== index);

    onChange('files', logoFile ? [logoFile, ...updatedPhotos] : updatedPhotos);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-400" />
              5. Fotos em Alta Resolução
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Envie fotos de equipe, produtos, espaço físico e trabalhos realizados com resolução original total.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            Sem compressão do WhatsApp
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Ao contrário do WhatsApp, este formulário <strong>não reduz a resolução nem aplica compressão destrutiva</strong> às suas fotos. Envie os arquivos originais da câmera ou celular para que seu site fique com visual profissional.
        </p>
      </div>

      {/* Upload Dropzone */}
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
          multiple
          accept="image/*"
          onChange={handleFilesSelect}
        />

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
            <Upload className="w-6 h-6" />
          </div>

          {isUploading ? (
            <div className="w-full max-w-sm space-y-2">
              <p className="text-sm font-medium text-teal-300 animate-pulse">
                {uploadStatusText || 'Processando fotos em alta resolução...'}
              </p>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full animate-indeterminate" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-200">
                Clique aqui para selecionar várias fotos de uma vez ou arraste os arquivos
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPG, PNG, WebP, RAW, HEIC ou qualquer resolução (suporte a fotos pesadas)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Lista de Fotos Carregadas */}
      {photos.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              Fotos Adicionadas ({photos.length})
            </h3>
            <span className="text-xs text-slate-400">
              Você pode indicar a categoria e legenda de cada uma
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photos.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={item.fileUrl || item.previewUrl}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.fileSize ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Alta Resolução'}
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Original
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remover foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Categorização e Legenda */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                      Tipo de Foto:
                    </label>
                    <select
                      value={item.fileCategory}
                      onChange={(e) =>
                        handleUpdateCategory(idx, e.target.value as UploadedFileItem['fileCategory'])
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                      Legenda / Onde usar:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Foto de capa, Equipe..."
                      value={item.caption || ''}
                      onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 placeholder-slate-600"
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

