import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'forms-clientes-super-secret-key-2026';
const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// -------------------------------------------------------------
// 1. PRISMA CLIENT SINGLETON (LAZY PROXY)
// -------------------------------------------------------------
let prismaInstance: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (prismaInstance) return prismaInstance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL não definida nas variáveis de ambiente.');
    prismaInstance = new PrismaClient();
    return prismaInstance;
  }

  try {
    const isCloud =
      connectionString.includes('neon.tech') ||
      connectionString.includes('supabase.co') ||
      connectionString.includes('sslmode=require');

    const pool = new pg.Pool({
      connectionString,
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);

    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    return prismaInstance;
  } catch (error) {
    console.error('Falha ao conectar no PostgreSQL:', error);
    prismaInstance = new PrismaClient();
    return prismaInstance;
  }
}

const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  },
});

// -------------------------------------------------------------
// 2. AUTH MIDDLEWARE
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
// 3. EXPRESS APP & ROUTES
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
    timestamp: new Date().toISOString(),
  });
});

// Public Config
app.get(['/api/config', '/config'], (req: Request, res: Response) => {
  res.json({
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
    uploadServiceEnabled: true,
  });
});

// Cloudinary Upload Signature
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
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao gerar assinatura de upload.' });
  }
});

// Client Submissions (Form submit)
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

    const submission = await prisma.clientSubmission.create({
      data: {
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
        files: Array.isArray(files) && files.length > 0
          ? {
              create: files.map((file: any) => ({
                fileCategory: file.fileCategory || 'OUTRO',
                fileName: file.fileName || 'arquivo',
                fileUrl: file.fileUrl,
                fileSize: file.fileSize ? parseInt(file.fileSize, 10) : null,
                mimeType: file.mimeType || null,
                caption: file.caption || null,
              })),
            }
          : undefined,
      },
      include: {
        files: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Formulário enviado com sucesso!',
      submissionId: submission.id,
      data: submission,
    });
  } catch (error: any) {
    console.error('Erro ao salvar formulário:', error);
    res.status(500).json({
      error: 'Erro ao salvar o formulário.',
      details: error.message,
    });
  }
});

// Admin Login
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

// Admin Stats
app.get(['/api/admin/stats', '/admin/stats'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const [total, novo, emAnalise, emAndamento, concluido, totalFiles] = await Promise.all([
      prisma.clientSubmission.count(),
      prisma.clientSubmission.count({ where: { status: 'NOVO' } }),
      prisma.clientSubmission.count({ where: { status: 'EM_ANALISE' } }),
      prisma.clientSubmission.count({ where: { status: 'EM_ANDAMENTO' } }),
      prisma.clientSubmission.count({ where: { status: 'CONCLUIDO' } }),
      prisma.uploadedFile.count(),
    ]);

    res.json({
      total,
      novo,
      emAnalise,
      emAndamento,
      concluido,
      totalFiles,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao consultar estatísticas.', details: error.message });
  }
});

// Admin Submissions List & Search
app.get(['/api/admin/submissions', '/admin/submissions'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
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
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar envios.', details: error.message });
  }
});

// Admin Submission by ID
app.get(['/api/admin/submissions/:id', '/admin/submissions/:id'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await prisma.clientSubmission.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!submission) {
      res.status(404).json({ error: 'Envio não encontrado.' });
      return;
    }

    res.json({ data: submission });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao consultar envio.', details: error.message });
  }
});

// Admin Update Status
app.patch(['/api/admin/submissions/:id/status', '/admin/submissions/:id/status'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const updated = await prisma.clientSubmission.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar status.', details: error.message });
  }
});

// Admin Delete Submission
app.delete(['/api/admin/submissions/:id', '/admin/submissions/:id'], verifyAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.clientSubmission.delete({
      where: { id },
    });
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
