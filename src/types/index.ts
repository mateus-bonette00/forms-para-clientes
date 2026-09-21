export interface UploadedFileItem {
  id?: string;
  fileCategory: 'LOGO' | 'EQUIPE' | 'PRODUTO' | 'SERVICO' | 'ESPACO' | 'OUTRO';
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  caption?: string;
  previewUrl?: string;
  fileObject?: File;
  uploadProgress?: number;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
}

export interface ClientFormData {
  // 1. Contato e Identificação
  clientName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  instagram: string;
  address: string;
  businessHours: string;

  // 2. Identidade Visual
  colorPalette: string;

  // 3. Institucional
  aboutMe: string;
  history: string;
  mission: string;
  vision: string;
  values: string;
  slogan: string;
  differentials: string;
  targetAudience: string;

  // 4. Serviços & Produtos
  servicesList: string;

  // 5. Fotos & Anexos
  files: UploadedFileItem[];

  // 6. Referências & Extras
  referenceLinks: string;
  testimonials: string;
  additionalNotes: string;
}

export interface ClientSubmission {
  id: string;
  clientName: string;
  companyName: string | null;
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  businessHours: string | null;
  aboutMe: string | null;
  history: string | null;
  mission: string | null;
  vision: string | null;
  values: string | null;
  slogan: string | null;
  differentials: string | null;
  targetAudience: string | null;
  colorPalette: string | null;
  referenceLinks: string | null;
  servicesList: string | null;
  testimonials: string | null;
  additionalNotes: string | null;
  status: 'NOVO' | 'EM_ANALISE' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  createdAt: string;
  updatedAt: string;
  files: {
    id: string;
    fileCategory: string;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string | null;
    caption: string | null;
  }[];
}

export interface AdminStats {
  total: number;
  novo: number;
  emAnalise: number;
  emAndamento: number;
  concluido: number;
  totalFiles: number;
}

