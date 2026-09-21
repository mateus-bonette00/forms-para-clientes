import React, { useRef, useState } from 'react';
import {
  Palette,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Trash2,
  Sparkles,
  Check,
  HelpCircle,
  Plus
} from 'lucide-react';
import { Input } from '../ui/Input';
import { ClientFormData, UploadedFileItem } from '../../types';
import { uploadFile } from '../../services/upload';

interface Step2Props {
  data: ClientFormData;
  onChange: (field: keyof ClientFormData, value: any) => void;
}

export const Step2Branding: React.FC<Step2Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  // 1. Logo Question State
  const logoFiles = data.files.filter((f) => f.fileCategory === 'LOGO');
  const [hasLogo, setHasLogo] = useState<boolean>(logoFiles.length > 0 || true);

  // 2. Identity / Colors Question State
  const [hasPalette, setHasPalette] = useState<'yes' | 'no_suggest' | 'no_mateus_defines'>(
    data.colorPalette.includes('Mateus define')
      ? 'no_mateus_defines'
      : data.colorPalette
      ? 'yes'
      : 'yes'
  );

  // Color picker state
  const [primaryColor, setPrimaryColor] = useState('#0d9488');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [thirdColor, setThirdColor] = useState('#38bdf8');
  const [fourthColor, setFourthColor] = useState('#0f172a');
  const [colorNotes, setColorNotes] = useState(data.colorPalette || '');

  const updateColorString = (
    type: 'yes' | 'no_suggest' | 'no_mateus_defines',
    c1 = primaryColor,
    c2 = secondaryColor,
    c3 = thirdColor,
    c4 = fourthColor,
    notes = colorNotes
  ) => {
    if (type === 'no_mateus_defines') {
      onChange('colorPalette', 'O Mateus define as melhores cores para o meu segmento');
    } else {
      const summary = `Primária: ${c1} | Secundária: ${c2} | 3ª Cor: ${c3} | 4ª Cor: ${c4}${
        notes.trim() ? ` | Observações: ${notes.trim()}` : ''
      }`;
      onChange('colorPalette', summary);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const newItems: UploadedFileItem[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadStatusText(`Enviando logo ${i + 1} de ${selectedFiles.length}: "${file.name}"...`);

      try {
        const uploadedUrl = await uploadFile(file);

        newItems.push({
          fileCategory: 'LOGO',
          fileName: file.name,
          fileUrl: uploadedUrl,
          fileSize: file.size,
          mimeType: file.type,
          caption: 'Logotipo / Variação',
          previewUrl: URL.createObjectURL(file),
        });
      } catch (err) {
        console.error(`Erro ao subir logo ${file.name}:`, err);
      }
    }

    const nonLogoFiles = data.files.filter((f) => f.fileCategory !== 'LOGO');
    onChange('files', [...nonLogoFiles, ...logoFiles, ...newItems]);
    setIsUploading(false);
    setUploadStatusText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveLogo = (index: number) => {
    const nonLogoFiles = data.files.filter((f) => f.fileCategory !== 'LOGO');
    const updatedLogoFiles = logoFiles.filter((_, i) => i !== index);
    onChange('files', [...nonLogoFiles, ...updatedLogoFiles]);
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="border-b border-slate-700/80 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
            <Palette className="w-5 h-5" />
          </div>
          2. Logotipo & Cores do Site
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Informe se você já possui logotipo e cores para o seu site, ou se prefere que o Mateus defina tudo para você.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PERGUNTA 1: Você tem uma logo? */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4 p-5 rounded-2xl bg-slate-900/90 border-2 border-slate-700/80 shadow-xl">
        <label className="text-base font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-teal-400" />
          Você já tem um Logotipo (Logo)?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Opção Sim */}
          <button
            type="button"
            onClick={() => setHasLogo(true)}
            className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
              hasLogo
                ? 'border-teal-400 bg-teal-500/15 shadow-md'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-600 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                hasLogo ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-600'
              }`}
            >
              {hasLogo && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sim, já tenho minha logo</p>
              <p className="text-xs text-slate-300 mt-0.5">Vou anexar os arquivos da minha marca</p>
            </div>
          </button>

          {/* Opção Não */}
          <button
            type="button"
            onClick={() => {
              setHasLogo(false);
              // Clear logo files if client chooses no logo
              onChange(
                'files',
                data.files.filter((f) => f.fileCategory !== 'LOGO')
              );
            }}
            className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
              !hasLogo
                ? 'border-teal-400 bg-teal-500/15 shadow-md'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-600 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                !hasLogo ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-600'
              }`}
            >
              {!hasLogo && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">Não tenho logo ainda</p>
              <p className="text-xs text-slate-300 mt-0.5">O Mateus pode criar ou usar uma tipografia moderna</p>
            </div>
          </button>
        </div>

        {/* Bloco de Upload quando tem logo */}
        {hasLogo ? (
          <div className="pt-3 space-y-4">
            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 leading-relaxed">
              💡 <strong>Dica:</strong> Você pode anexar <strong>todas as versões da sua logo que tiver</strong> (versão colorida, branca, preta, com ou sem fundo, ícone/símbolo, etc.).
            </div>

            {/* Upload Button / Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isUploading
                  ? 'border-teal-400 bg-teal-500/10'
                  : 'border-slate-600 bg-slate-950/70 hover:border-teal-400 hover:bg-slate-950'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,.svg,.pdf,.ai,.eps,.psd"
                onChange={handleLogoUpload}
              />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                {isUploading ? (
                  <p className="text-xs font-bold text-teal-200 animate-pulse">
                    {uploadStatusText || 'Enviando arquivo...'}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-white">
                      Clique aqui para adicionar sua Logo (ou arraste o arquivo)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Aceita PNG, JPG, PDF, SVG ou qualquer formato de imagem
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Lista de Logos Anexadas */}
            {logoFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {logoFiles.map((logo, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border-2 border-slate-700 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-700 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={logo.fileUrl || logo.previewUrl}
                          alt="Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate" title={logo.fileName}>
                          {logo.fileName}
                        </p>
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Anexado com sucesso
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLogo(idx)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Remover este arquivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              Tudo certo! O Mateus utilizará uma tipografia bonita e alinhada ao estilo do seu negócio.
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PERGUNTA 2: Você tem uma identidade visual / cores? */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4 p-5 rounded-2xl bg-slate-900/90 border-2 border-slate-700/80 shadow-xl">
        <label className="text-base font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-teal-400" />
          Você já tem uma Identidade Visual (Cores e Paleta de Cores)?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Opção 1: Já tenho */}
          <button
            type="button"
            onClick={() => {
              setHasPalette('yes');
              updateColorString('yes');
            }}
            className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
              hasPalette === 'yes'
                ? 'border-teal-400 bg-teal-500/15 shadow-md'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-600 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                hasPalette === 'yes' ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-600'
              }`}
            >
              {hasPalette === 'yes' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sim, já tenho minhas cores</p>
              <p className="text-xs text-slate-300 mt-0.5">Vou informar as cores oficiais</p>
            </div>
          </button>

          {/* Opção 2: Não tenho, mas quero sugerir */}
          <button
            type="button"
            onClick={() => {
              setHasPalette('no_suggest');
              updateColorString('no_suggest');
            }}
            className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
              hasPalette === 'no_suggest'
                ? 'border-teal-400 bg-teal-500/15 shadow-md'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-600 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                hasPalette === 'no_suggest' ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-600'
              }`}
            >
              {hasPalette === 'no_suggest' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">Quero sugerir cores</p>
              <p className="text-xs text-slate-300 mt-0.5">Quero escolher minhas cores preferidas</p>
            </div>
          </button>

          {/* Opção 3: Mateus Define */}
          <button
            type="button"
            onClick={() => {
              setHasPalette('no_mateus_defines');
              updateColorString('no_mateus_defines');
            }}
            className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
              hasPalette === 'no_mateus_defines'
                ? 'border-teal-400 bg-teal-500/15 shadow-md'
                : 'border-slate-700 bg-slate-950/60 hover:border-slate-600 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                hasPalette === 'no_mateus_defines' ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-600'
              }`}
            >
              {hasPalette === 'no_mateus_defines' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">O Mateus Define</p>
              <p className="text-xs text-slate-300 mt-0.5">Prefiro que o Mateus escolha o melhor visual</p>
            </div>
          </button>
        </div>

        {/* Painel Interativo de Escolha de Cores (para "Sim" ou "Quero sugerir") */}
        {hasPalette !== 'no_mateus_defines' ? (
          <div className="pt-4 space-y-4 border-t border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-400" />
                Selecione ou ajuste as cores (Marcadores Visuais):
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Clique nos quadrados coloridos para escolher as cores de sua preferência:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Cor 1 */}
                <div className="p-3 rounded-xl bg-slate-950 border-2 border-slate-700 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300">1ª Cor (Principal):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        updateColorString(hasPalette, e.target.value, secondaryColor, thirdColor, fourthColor);
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-white">{primaryColor}</span>
                  </div>
                </div>

                {/* Cor 2 */}
                <div className="p-3 rounded-xl bg-slate-950 border-2 border-slate-700 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300">2ª Cor (Secundária):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => {
                        setSecondaryColor(e.target.value);
                        updateColorString(hasPalette, primaryColor, e.target.value, thirdColor, fourthColor);
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-white">{secondaryColor}</span>
                  </div>
                </div>

                {/* Cor 3 */}
                <div className="p-3 rounded-xl bg-slate-950 border-2 border-slate-700 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300">3ª Cor (Destaques):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={thirdColor}
                      onChange={(e) => {
                        setThirdColor(e.target.value);
                        updateColorString(hasPalette, primaryColor, secondaryColor, e.target.value, fourthColor);
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-white">{thirdColor}</span>
                  </div>
                </div>

                {/* Cor 4 */}
                <div className="p-3 rounded-xl bg-slate-950 border-2 border-slate-700 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-300">4ª Cor (Fundo/Base):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fourthColor}
                      onChange={(e) => {
                        setFourthColor(e.target.value);
                        updateColorString(hasPalette, primaryColor, secondaryColor, thirdColor, e.target.value);
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-white">{fourthColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campo de Texto para Observações de Cores */}
            <div className="pt-2">
              <Input
                label="Descreva suas cores ou preferências por escrito (Opcional)"
                placeholder="Ex: Gosto de tons de azul escuro com dourado e fundo preto..."
                optional
                value={colorNotes}
                onChange={(e) => {
                  setColorNotes(e.target.value);
                  updateColorString(hasPalette, primaryColor, secondaryColor, thirdColor, fourthColor, e.target.value);
                }}
                helperText="Se você souber o nome das cores ou tiver referências, pode escrever aqui."
              />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              Excelente! O Mateus vai analisar o seu logotipo e segmento para criar uma paleta de cores moderna, elegante e de alto impacto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
