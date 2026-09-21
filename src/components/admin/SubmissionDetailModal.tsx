import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Palette,
  FileText,
  Briefcase,
  Layers,
  Image as ImageIcon,
  FolderArchive,
  Sparkles,
  Link2
} from 'lucide-react';
import { InstagramIcon } from '../ui/Icons';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ClientSubmission } from '../../types';
import api from '../../services/api';

interface SubmissionDetailModalProps {
  submission: ClientSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
  onDeleted: () => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  isOpen,
  onClose,
  onStatusUpdated,
  onDeleted,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!submission) return null;

  const copyToClipboard = (text: string | null | undefined, label: string) => {
    if (!text) {
      toast.info('Campo vazio.');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`"${label}" copiado para a área de transferência!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullSummary = () => {
    const lines = [
      `# BRIEFING: ${submission.clientName} (${submission.companyName || 'Empresa não informada'})`,
      `Data de Envio: ${new Date(submission.createdAt).toLocaleString('pt-BR')}`,
      `Status: ${submission.status}`,
      '',
      `## 1. DADOS DE CONTATO`,
      `- WhatsApp: ${submission.whatsapp || 'Não informado'}`,
      `- E-mail: ${submission.email || 'Não informado'}`,
      `- Instagram: ${submission.instagram || 'Não informado'}`,
      `- Endereço: ${submission.address || 'Não informado'}`,
      `- Horário: ${submission.businessHours || 'Não informado'}`,
      '',
      `## 2. IDENTIDADE VISUAL`,
      `- Paleta de Cores: ${submission.colorPalette || 'Não informado'}`,
      '',
      `## 3. TEXTOS INSTITUCIONAIS`,
      `- Slogan: ${submission.slogan || 'Não informado'}`,
      `- Sobre Mim / Empresa: ${submission.aboutMe || 'Não informado'}`,
      `- Diferenciais: ${submission.differentials || 'Não informado'}`,
      `- Missão: ${submission.mission || 'Não informado'}`,
      `- Visão: ${submission.vision || 'Não informado'}`,
      `- Valores: ${submission.values || 'Não informado'}`,
      '',
      `## 4. SERVIÇOS & PRODUTOS`,
      `- Lista: ${submission.servicesList || 'Não informado'}`,
      `- Público-Alvo: ${submission.targetAudience || 'Não informado'}`,
      '',
      `## 5. REFERÊNCIAS & EXTRAS`,
      `- Links de Referência: ${submission.referenceLinks || 'Não informado'}`,
      `- Depoimentos: ${submission.testimonials || 'Não informado'}`,
      `- Observações Adicionais: ${submission.additionalNotes || 'Não informado'}`,
      '',
      `## 6. ARQUIVOS ANEXADOS (${submission.files?.length || 0})`,
      ...(submission.files || []).map(
        (f) => `- [${f.fileCategory}] ${f.fileName} ${f.caption ? `(${f.caption})` : ''}: ${f.fileUrl}`
      ),
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Resumo completo em Markdown copiado com sucesso!');
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await api.patch(`/admin/submissions/${submission.id}/status`, { status: newStatus });
      toast.success('Status atualizado!');
      onStatusUpdated();
    } catch (err) {
      toast.error('Erro ao atualizar status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o envio de ${submission.clientName}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/submissions/${submission.id}`);
      toast.success('Envio excluído com sucesso.');
      onDeleted();
      onClose();
    } catch (err) {
      toast.error('Erro ao excluir envio.');
    }
  };

  const handleDownloadAllPhotosZip = async () => {
    if (!submission.files || submission.files.length === 0) {
      toast.info('Nenhum arquivo para baixar.');
      return;
    }

    setIsDownloadingZip(true);
    const toastId = toast.loading('Compactando fotos em alta resolução...');

    try {
      const zip = new JSZip();
      const folderName = `${submission.clientName.replace(/\s+/g, '_')}_materiais`;
      const folder = zip.folder(folderName) || zip;

      for (let i = 0; i < submission.files.length; i++) {
        const file = submission.files[i];
        try {
          const response = await fetch(file.fileUrl);
          const blob = await response.blob();
          const ext = file.fileName.includes('.') ? '' : '.jpg';
          const cleanName = `${i + 1}_[${file.fileCategory}]_${file.fileName}${ext}`;
          folder.file(cleanName, blob);
        } catch (fetchErr) {
          console.error(`Erro ao baixar imagem ${file.fileName}:`, fetchErr);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${folderName}.zip`);
      toast.dismiss(toastId);
      toast.success('Download do ZIP concluído com sucesso!');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Erro ao gerar arquivo ZIP.');
      console.error(err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const logoFile = submission.files?.find((f) => f.fileCategory === 'LOGO');
  const photos = submission.files?.filter((f) => f.fileCategory !== 'LOGO') || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Briefing: ${submission.clientName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={submission.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="NOVO">🟡 Novo</option>
              <option value="EM_ANALISE">🔵 Em Análise</option>
              <option value="EM_ANDAMENTO">🟣 Em Andamento</option>
              <option value="CONCLUIDO">🟢 Concluído</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={copyFullSummary}
              leftIcon={<Copy className="w-3.5 h-3.5 text-teal-400" />}
            >
              Copiar Tudo (Markdown)
            </Button>

            {submission.files && submission.files.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadAllPhotosZip}
                isLoading={isDownloadingZip}
                leftIcon={<FolderArchive className="w-3.5 h-3.5" />}
              >
                Baixar Fotos (.ZIP)
              </Button>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* 1. Contato & Identificação */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Phone className="w-4 h-4 text-teal-400" />
            1. Informações de Contato & Empresa
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <InfoBlock
              label="Cliente"
              value={submission.clientName}
              onCopy={() => copyToClipboard(submission.clientName, 'Nome')}
              isCopied={copiedField === 'Nome'}
            />
            <InfoBlock
              label="Empresa"
              value={submission.companyName}
              onCopy={() => copyToClipboard(submission.companyName, 'Empresa')}
              isCopied={copiedField === 'Empresa'}
            />
            <InfoBlock
              label="WhatsApp"
              value={submission.whatsapp}
              onCopy={() => copyToClipboard(submission.whatsapp, 'WhatsApp')}
              isCopied={copiedField === 'WhatsApp'}
              link={submission.whatsapp ? `https://wa.me/${submission.whatsapp.replace(/\D/g, '')}` : undefined}
            />
            <InfoBlock
              label="E-mail"
              value={submission.email}
              onCopy={() => copyToClipboard(submission.email, 'E-mail')}
              isCopied={copiedField === 'E-mail'}
            />
            <InfoBlock
              label="Instagram"
              value={submission.instagram}
              onCopy={() => copyToClipboard(submission.instagram, 'Instagram')}
              isCopied={copiedField === 'Instagram'}
            />
            <InfoBlock
              label="Horário de Funcionamento"
              value={submission.businessHours}
              onCopy={() => copyToClipboard(submission.businessHours, 'Horário')}
              isCopied={copiedField === 'Horário'}
            />
            <div className="sm:col-span-2 md:col-span-3">
              <InfoBlock
                label="Endereço"
                value={submission.address}
                onCopy={() => copyToClipboard(submission.address, 'Endereço')}
                isCopied={copiedField === 'Endereço'}
              />
            </div>
          </div>
        </div>

        {/* 2. Identidade Visual & Logotipo */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Palette className="w-4 h-4 text-teal-400" />
            2. Identidade Visual & Logotipo
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock
              label="Paleta de Cores"
              value={submission.colorPalette}
              onCopy={() => copyToClipboard(submission.colorPalette, 'Cores')}
              isCopied={copiedField === 'Cores'}
            />

            {logoFile ? (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 p-1 flex items-center justify-center shrink-0">
                    <img src={logoFile.fileUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{logoFile.fileName}</p>
                    <span className="text-[11px] text-teal-400">Logotipo Oficial</span>
                  </div>
                </div>
                <a
                  href={logoFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={logoFile.fileName}
                  className="p-2 rounded-lg bg-slate-800 text-teal-400 hover:bg-teal-500/10 border border-slate-700 transition-colors"
                  title="Abrir em resolução original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-500 italic flex items-center">
                Logotipo não enviado
              </div>
            )}
          </div>
        </div>

        {/* 3. Textos Institucionais */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-teal-400" />
            3. Textos Institucionais
          </h4>

          <div className="space-y-3">
            <InfoBlock
              label="Slogan / Frase de Impacto"
              value={submission.slogan}
              onCopy={() => copyToClipboard(submission.slogan, 'Slogan')}
              isCopied={copiedField === 'Slogan'}
            />
            <InfoBlock
              label="Sobre Mim / Sobre a Empresa"
              value={submission.aboutMe}
              onCopy={() => copyToClipboard(submission.aboutMe, 'Sobre Mim')}
              isCopied={copiedField === 'Sobre Mim'}
            />
            <InfoBlock
              label="Diferenciais"
              value={submission.differentials}
              onCopy={() => copyToClipboard(submission.differentials, 'Diferenciais')}
              isCopied={copiedField === 'Diferenciais'}
            />

            {(submission.mission || submission.vision || submission.values) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InfoBlock
                  label="Missão"
                  value={submission.mission}
                  onCopy={() => copyToClipboard(submission.mission, 'Missão')}
                  isCopied={copiedField === 'Missão'}
                />
                <InfoBlock
                  label="Visão"
                  value={submission.vision}
                  onCopy={() => copyToClipboard(submission.vision, 'Visão')}
                  isCopied={copiedField === 'Visão'}
                />
                <InfoBlock
                  label="Valores"
                  value={submission.values}
                  onCopy={() => copyToClipboard(submission.values, 'Valores')}
                  isCopied={copiedField === 'Valores'}
                />
              </div>
            )}
          </div>
        </div>

        {/* 4. Serviços & Produtos */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Briefcase className="w-4 h-4 text-teal-400" />
            4. Serviços, Produtos & Público-Alvo
          </h4>

          <div className="space-y-3">
            <InfoBlock
              label="Lista de Serviços ou Produtos"
              value={submission.servicesList}
              onCopy={() => copyToClipboard(submission.servicesList, 'Serviços')}
              isCopied={copiedField === 'Serviços'}
            />
            <InfoBlock
              label="Público-Alvo"
              value={submission.targetAudience}
              onCopy={() => copyToClipboard(submission.targetAudience, 'Público-Alvo')}
              isCopied={copiedField === 'Público-Alvo'}
            />
          </div>
        </div>

        {/* 5. Galeria de Fotos em Alta Resolução */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-teal-400" />
              5. Fotos em Alta Resolução ({photos.length})
            </h4>
            {photos.length > 0 && (
              <span className="text-xs text-emerald-400 font-medium">
                Qualidade 100% Original
              </span>
            )}
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="group relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="aspect-square w-full bg-slate-900 overflow-hidden relative">
                    <img
                      src={photo.fileUrl}
                      alt={photo.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <a
                        href={photo.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800/90 text-white hover:bg-teal-500 hover:text-slate-950 transition-colors"
                        title="Ver em tamanho original"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="p-2 text-left">
                    <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 uppercase tracking-wider block truncate">
                      {photo.fileCategory}
                    </span>
                    <p className="text-xs text-slate-200 font-medium truncate mt-1" title={photo.fileName}>
                      {photo.fileName}
                    </p>
                    {photo.caption && (
                      <p className="text-[11px] text-slate-400 italic truncate" title={photo.caption}>
                        "{photo.caption}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              Nenhuma foto enviada nesta categoria.
            </p>
          )}
        </div>

        {/* 6. Referências & Extras */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Link2 className="w-4 h-4 text-teal-400" />
            6. Referências & Observações
          </h4>

          <div className="space-y-3">
            <InfoBlock
              label="Links de Referência"
              value={submission.referenceLinks}
              onCopy={() => copyToClipboard(submission.referenceLinks, 'Referências')}
              isCopied={copiedField === 'Referências'}
            />
            <InfoBlock
              label="Depoimentos de Clientes"
              value={submission.testimonials}
              onCopy={() => copyToClipboard(submission.testimonials, 'Depoimentos')}
              isCopied={copiedField === 'Depoimentos'}
            />
            <InfoBlock
              label="Observações Extras"
              value={submission.additionalNotes}
              onCopy={() => copyToClipboard(submission.additionalNotes, 'Observações')}
              isCopied={copiedField === 'Observações'}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface InfoBlockProps {
  label: string;
  value: string | null | undefined;
  onCopy: () => void;
  isCopied: boolean;
  link?: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, onCopy, isCopied, link }) => {
  if (!value) {
    return (
      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-xs text-slate-600 italic">Não informado</span>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-slate-500 hover:text-teal-400 p-1 rounded transition-colors"
          title="Copiar texto"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-teal-400 hover:underline flex items-center gap-1"
          >
            {value} <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

