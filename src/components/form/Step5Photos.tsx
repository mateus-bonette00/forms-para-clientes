import React, { useRef, useState } from 'react';
import {
  Camera,
  ShieldCheck,
  Trash2,
  ImagePlus,
  Layers,
  Info
} from 'lucide-react';
import { ClientFormData, UploadedFileItem } from '../../types';
import { uploadFile } from '../../services/upload';

interface Step5Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

const CATEGORIES: { label: string; value: UploadedFileItem['fileCategory'] }[] = [
  { label: '👥 Equipe / Perfil', value: 'EQUIPE' },
  { label: '🏢 Espaço / Fachada', value: 'ESPACO' },
  { label: '⚡ Serviço em Ação', value: 'SERVICO' },
  { label: '📦 Produto / Portfólio', value: 'PRODUTO' },
  { label: '📁 Outro Tipo', value: 'OUTRO' },
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
      <div className="border-b border-slate-700/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                <Camera className="w-5 h-5" />
              </div>
              5. Galeria de Fotos em Alta Resolução
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Envie fotos de equipe, produtos, espaço físico e trabalhos com qualidade original total.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-300 text-xs font-bold self-start sm:self-auto shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero Compressão • 100% Original
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-4 rounded-2xl bg-teal-950/40 border-2 border-teal-500/30 flex items-start gap-3.5 text-sm text-teal-100">
        <Info className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Diferente do WhatsApp, aqui suas imagens <strong>não perdem nitidez nem cores</strong>. Selecione os arquivos originais da sua câmera ou celular.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
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
                {uploadStatusText || 'Processando fotos em alta qualidade...'}
              </p>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-teal-400 h-full rounded-full animate-indeterminate" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-base font-bold text-white">
                Clique para selecionar várias fotos de uma vez ou arraste aqui
              </p>
              <p className="text-xs font-medium text-slate-300 mt-1.5">
                Formatos aceitos: JPG, PNG, WebP, RAW, HEIC • Suporte a arquivos pesados
              </p>
              <span className="inline-block mt-4 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold shadow-md hover:bg-teal-400 transition-colors">
                Selecionar Imagens do Dispositivo
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
            <span className="text-xs text-slate-300 font-medium">
              Identifique o tipo e adicione legendas opcionais
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
                      <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                        {item.fileSize ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Alta Resolução'}
                      </span>
                      <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        100% Original
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors border border-transparent hover:border-rose-500/30"
                    title="Remover foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Categorização e Legenda */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">
                      Categoria da Foto:
                    </label>
                    <select
                      value={item.fileCategory}
                      onChange={(e) =>
                        handleUpdateCategory(idx, e.target.value as UploadedFileItem['fileCategory'])
                      }
                      className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-teal-400"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">
                      Legenda / Onde Usar:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Foto de capa, Equipe..."
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
