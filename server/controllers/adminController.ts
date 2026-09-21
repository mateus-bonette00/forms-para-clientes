import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'forms-clientes-super-secret-key-2026';
const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
      return;
    }

    // Check credentials against environment variables or database
    const isValidEnv = username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASSWORD;

    if (!isValidEnv) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        username,
        role: 'admin',
      },
    });
  } catch (error: any) {
    console.error('Erro no login admin:', error);
    res.status(500).json({ error: 'Erro interno no processo de login.' });
  }
};

export const getSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && status !== 'TODOS') {
      where.status = status;
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
        include: {
          files: {
            select: {
              id: true,
              fileCategory: true,
              fileName: true,
              fileUrl: true,
              fileSize: true,
              mimeType: true,
              caption: true,
            },
          },
        },
      }),
    ]);

    res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: submissions,
    });
  } catch (error: any) {
    console.error('Erro ao buscar envios:', error);
    res.status(500).json({ error: 'Erro ao buscar formulários recebidos.' });
  }
};

export const getSubmissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const id = req.params.id as string;
    const id = String(req.params.id);

    const submission = await prisma.clientSubmission.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!submission) {
      res.status(404).json({ error: 'Envio não encontrado.' });
      return;
    }

    res.json({ data: submission });
  } catch (error: any) {
    console.error('Erro ao buscar envio por ID:', error);
    res.status(500).json({ error: 'Erro ao consultar detalhes do envio.' });
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const id = req.params.id as string;
    const id = String(req.params.id);
    const { status } = req.body;

    const validStatuses = ['NOVO', 'EM_ANALISE', 'EM_ANDAMENTO', 'CONCLUIDO'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Status inválido fornecido.' });
      return;
    }

    const updated = await prisma.clientSubmission.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do envio.' });
  }
};

export const deleteSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const id = req.params.id as string;
    const id = String(req.params.id);

    await prisma.clientSubmission.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Envio excluído com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao excluir envio:', error);
    res.status(500).json({ error: 'Erro ao excluir envio.' });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
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
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do painel.' });
  }
};

