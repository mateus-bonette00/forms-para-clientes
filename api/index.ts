import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { put, list, del } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'forms-clientes-super-secret-key-2026';
const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// -------------------------------------------------------------
// 1. PRISMA CLIENT INITIALIZATION (SAFE, NO CRASHES)
// -------------------------------------------------------------
let prismaInstance: PrismaClient | null = null;
let prismaDisabled = false;

function getPrisma(): PrismaClient | null {
  if (prismaDisabled) return null;
  if (prismaInstance) return prismaInstance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === '') {
    return null;
  }

  try {
    const isCloud =
      connectionString.includes('neon.tech') ||
      connectionString.includes('supabase.co') ||
      connectionString.includes('sslmode=require');

    const pool = new pg.Pool({
      connectionString,
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 4000,
    });

    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    return prismaInstance;
  } catch (error) {
    console.warn('PostgreSQL indisponível via Prisma, ativando armazenamento resiliente:', error);
    prismaDisabled = true;
    return null;
  }
}

// -------------------------------------------------------------
// 2. RESILIENT CLOUD & LOCAL STORAGE LAYER
// -------------------------------------------------------------
const LOCAL_DB_PATH = process.env.VERCEL
  ? '/tmp/forms_submissions.json'
  : path.join(process.cwd(), 'submissions_db.json');

let memorySubmissions: any[] = [];
let hasLoadedMemory = false;

async function loadSubmissions(): Promise<any[]> {
  if (hasLoadedMemory && memorySubmissions.length > 0) {
    return memorySubmissions;
  }

  // 1. Try reading from local file (/tmp or disk)
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memorySubmissions = parsed;
        hasLoadedMemory = true;
        return memorySubmissions;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler do arquivo local:', err);
  }

  // 2. Try reading from Vercel Blob store
  try {
    const blobList = await list({ prefix: 'submissions/all.json' });
    if (blobList.blobs && blobList.blobs.length > 0) {
      const blobUrl = blobList.blobs[0].url;
      const resp = await fetch(blobUrl);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data)) {
          memorySubmissions = data;
          hasLoadedMemory = true;
          try {
            fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(memorySubmissions, null, 2), 'utf-8');
          } catch {}
          return memorySubmissions;
        }
      }
    }
  } catch (blobErr) {
    console.warn('Vercel Blob list fallback:', blobErr);
  }

  hasLoadedMemory = true;
  return memorySubmissions;
}

async function persistSubmissions(submissions: any[]): Promise<void> {
  memorySubmissions = submissions;

  // 1. Write to local file
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(submissions, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Erro ao salvar localmente:', err);
  }

  // 2. Write to Vercel Blob store
  try {
    await put('submissions/all.json', JSON.stringify(submissions, null, 2), {
      access: 'public',
      addRandomSuffix: false,
    });
  } catch (blobErr) {
    console.warn('Erro ao sincronizar com Vercel Blob:', blobErr);
  }
}

// -------------------------------------------------------------
// 3. AUTH MIDDLEWARE
// -------------------------------------------------------------
function verifyAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// -------------------------------------------------------------
// 4. EXPRESS APP SETUP
// -------------------------------------------------------------
const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'local',
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasBlobStore: Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN),
    timestamp: new Date().toISOString(),
  });
});

// Public Config
app.get(['/api/config', '/config'], (req: Request, res: Response) => {
  res.json({
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
    hasBlobStore: Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN),
    uploadServiceEnabled: true,
  });
});

// Vercel Blob Client Upload Handler (Direct CDN uploads up to 50MB)
app.post(['/api/upload/blob', '/upload/blob'], async (req: Request, res: Response) => {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
            'image/heic',
            'image/avif',
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload concluído com sucesso no Vercel Blob:', blob.url);
      },
    });

    res.json(jsonResponse);
  } catch (error: any) {
    console.warn('Vercel Blob handleUpload não processado:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Cloudinary Signature Helper
app.get(['/api/upload/signature', '/upload/signature'], (req: Request, res: Response) => {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!apiSecret || !apiKey || !cloudName) {
      res.json({
        useUnsigned: true,
        cloudName: cloudName || '',
        uploadPreset: uploadPreset || '',
      });
      return;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `timestamp=${timestamp}${uploadPreset ? `&upload_preset=${uploadPreset}` : ''}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    res.json({
      useUnsigned: false,
      signature,
      timestamp,
      apiKey,
      cloudName,
      uploadPreset,
    });
  } catch {
    res.status(500).json({ error: 'Erro ao gerar assinatura de upload.' });
  }
});

// -------------------------------------------------------------
// 5. CLIENT SUBMISSIONS (FORM SUBMIT)
// -------------------------------------------------------------
app.post(['/api/submissions', '/submissions'], async (req: Request, res: Response) => {
  try {
    const {
      clientName,
      companyName,
      email,
      whatsapp,
      instagram,
      address,
      businessHours,
      aboutMe,
      history,
      mission,
      vision,
      values,
      slogan,
      differentials,
      targetAudience,
      colorPalette,
      referenceLinks,
      servicesList,
      testimonials,
      additionalNotes,
      files,
    } = req.body || {};

    if (!clientName || clientName.trim() === '') {
      res.status(400).json({ error: 'O nome do cliente é obrigatório.' });
      return;
    }

    const now = new Date().toISOString();
    const submissionId = crypto.randomUUID();

    const formattedFiles = Array.isArray(files)
      ? files.map((file: any) => ({
          id: crypto.randomUUID(),
          submissionId,
          fileCategory: file.fileCategory || 'OUTRO',
          fileName: file.fileName || 'arquivo',
          fileUrl: file.fileUrl || '',
          fileSize: file.fileSize ? parseInt(file.fileSize, 10) : null,
          mimeType: file.mimeType || null,
          caption: file.caption || null,
          createdAt: now,
        }))
      : [];

    const submissionPayload = {
      id: submissionId,
      clientName: clientName.trim(),
      companyName: companyName?.trim() || null,
      email: email?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      instagram: instagram?.trim() || null,
      address: address?.trim() || null,
      businessHours: businessHours?.trim() || null,
      aboutMe: aboutMe?.trim() || null,
      history: history?.trim() || null,
      mission: mission?.trim() || null,
      vision: vision?.trim() || null,
      values: values?.trim() || null,
      slogan: slogan?.trim() || null,
      differentials: differentials?.trim() || null,
      targetAudience: targetAudience?.trim() || null,
      colorPalette: colorPalette?.trim() || null,
      referenceLinks: referenceLinks?.trim() || null,
      servicesList: servicesList?.trim() || null,
      testimonials: testimonials?.trim() || null,
      additionalNotes: additionalNotes?.trim() || null,
      status: 'NOVO',
      createdAt: now,
      updatedAt: now,
      files: formattedFiles,
    };

    let savedItem: any = null;

    // 1. Try Prisma if available
    const prisma = getPrisma();
    if (prisma) {
      try {
        savedItem = await prisma.clientSubmission.create({
          data: {
            ...submissionPayload,
            files: formattedFiles.length > 0
              ? {
                  create: formattedFiles.map((f) => ({
                    fileCategory: f.fileCategory,
                    fileName: f.fileName,
                    fileUrl: f.fileUrl,
                    fileSize: f.fileSize,
                    mimeType: f.mimeType,
                    caption: f.caption,
                  })),
                }
              : undefined,
          },
          include: { files: true },
        });
      } catch (prismaErr: any) {
        console.warn('Prisma falhou ao salvar. Utilizando fallback resiliente:', prismaErr.message);
      }
    }

    // 2. Resilient Fallback (Persistent Storage)
    if (!savedItem) {
      const allSubmissions = await loadSubmissions();
      allSubmissions.unshift(submissionPayload);
      await persistSubmissions(allSubmissions);
      savedItem = submissionPayload;
    }

    res.status(201).json({
      success: true,
      message: 'Formulário enviado com sucesso!',
      submissionId: savedItem.id,
      data: savedItem,
    });
  } catch (error: any) {
    console.error('Erro crítico no envio:', error);
    res.status(500).json({
      error: 'Erro ao salvar o formulário.',
      details: error.message,
    });
  }
});

// -------------------------------------------------------------
// 6. ADMIN ROUTES
// -------------------------------------------------------------
app.post(['/api/admin/login', '/admin/login'], (req: Request, res: Response) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    return;
  }

  if (username !== DEFAULT_ADMIN_USER || password !== DEFAULT_ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Credenciais inválidas.' });
    return;
  }

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: { username, role: 'admin' },
  });
});

app.get(['/api/admin/stats', '/admin/stats'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    if (prisma) {
      try {
        const [total, novo, emAnalise, emAndamento, concluido, totalFiles] = await Promise.all([
          prisma.clientSubmission.count(),
          prisma.clientSubmission.count({ where: { status: 'NOVO' } }),
          prisma.clientSubmission.count({ where: { status: 'EM_ANALISE' } }),
          prisma.clientSubmission.count({ where: { status: 'EM_ANDAMENTO' } }),
          prisma.clientSubmission.count({ where: { status: 'CONCLUIDO' } }),
          prisma.uploadedFile.count(),
        ]);

        res.json({ total, novo, emAnalise, emAndamento, concluido, totalFiles });
        return;
      } catch (err) {
        console.warn('Prisma stats falhou, usando fallback:', err);
      }
    }

    const list = await loadSubmissions();
    const total = list.length;
    const novo = list.filter((s) => s.status === 'NOVO').length;
    const emAnalise = list.filter((s) => s.status === 'EM_ANALISE').length;
    const emAndamento = list.filter((s) => s.status === 'EM_ANDAMENTO').length;
    const concluido = list.filter((s) => s.status === 'CONCLUIDO').length;
    const totalFiles = list.reduce((acc, s) => acc + (s.files?.length || 0), 0);

    res.json({ total, novo, emAnalise, emAndamento, concluido, totalFiles });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao consultar estatísticas.', details: error.message });
  }
});

app.get(['/api/admin/submissions', '/admin/submissions'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;

    const prisma = getPrisma();
    if (prisma) {
      try {
        const skip = (pageNum - 1) * limitNum;
        const where: any = {};

        if (status && status !== 'TODOS') {
          where.status = status as string;
        }

        if (search && typeof search === 'string' && search.trim() !== '') {
          where.OR = [
            { clientName: { contains: search, mode: 'insensitive' } },
            { companyName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { whatsapp: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [total, submissions] = await Promise.all([
          prisma.clientSubmission.count({ where }),
          prisma.clientSubmission.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
            include: { files: true },
          }),
        ]);

        res.json({
          total,
          page: pageNum,
          totalPages: Math.ceil(total / limitNum),
          data: submissions,
        });
        return;
      } catch (err) {
        console.warn('Prisma submissions falhou, usando fallback:', err);
      }
    }

    let all = await loadSubmissions();
    if (status && status !== 'TODOS') {
      all = all.filter((s) => s.status === status);
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      all = all.filter(
        (s) =>
          s.clientName?.toLowerCase().includes(q) ||
          s.companyName?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.whatsapp?.toLowerCase().includes(q)
      );
    }

    const total = all.length;
    const skip = (pageNum - 1) * limitNum;
    const paginated = all.slice(skip, skip + limitNum);

    res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: paginated,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar envios.', details: error.message });
  }
});

app.get(['/api/admin/submissions/:id', '/admin/submissions/:id'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prisma = getPrisma();
    if (prisma) {
      try {
        const submission = await prisma.clientSubmission.findUnique({
          where: { id },
          include: { files: true },
        });

        if (submission) {
          res.json({ data: submission });
          return;
        }
      } catch (err) {
        console.warn('Prisma findUnique falhou, usando fallback:', err);
      }
    }

    const list = await loadSubmissions();
    const found = list.find((s) => s.id === id);

    if (!found) {
      res.status(404).json({ error: 'Envio não encontrado.' });
      return;
    }

    res.json({ data: found });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao consultar envio.', details: error.message });
  }
});

app.patch(['/api/admin/submissions/:id/status', '/admin/submissions/:id/status'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const prisma = getPrisma();
    if (prisma) {
      try {
        const updated = await prisma.clientSubmission.update({
          where: { id },
          data: { status },
        });

        res.json({ success: true, data: updated });
        return;
      } catch (err) {
        console.warn('Prisma update falhou, usando fallback:', err);
      }
    }

    const list = await loadSubmissions();
    const item = list.find((s) => s.id === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      await persistSubmissions(list);
    }

    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar status.', details: error.message });
  }
});

app.delete(['/api/admin/submissions/:id', '/admin/submissions/:id'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prisma = getPrisma();
    if (prisma) {
      try {
        await prisma.clientSubmission.delete({
          where: { id },
        });

        res.json({ success: true, message: 'Envio excluído com sucesso.' });
        return;
      } catch (err) {
        console.warn('Prisma delete falhou, usando fallback:', err);
      }
    }

    let list = await loadSubmissions();
    const initialLen = list.length;
    list = list.filter((s) => s.id !== id);
    if (list.length !== initialLen) {
      await persistSubmissions(list);
    }

    res.json({ success: true, message: 'Envio excluído com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao excluir envio.', details: error.message });
  }
});

// Local dev server listener
const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
  });
}

export default app;
