import jwt from 'jsonwebtoken';
import prisma from '../src/services/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'forms-clientes-super-secret-key-2026';

function verifyAuth(req: any): boolean {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Acesso não autorizado.' });
  }

  const { id, status, search, page = '1', limit = '50' } = req.query || {};

  try {
    // 1. GET by ID
    if (req.method === 'GET' && id) {
      const submission = await prisma.clientSubmission.findUnique({
        where: { id: String(id) },
        include: { files: true },
      });
      if (!submission) return res.status(404).json({ error: 'Envio não encontrado.' });
      return res.json({ data: submission });
    }

    // 2. GET list
    if (req.method === 'GET') {
      const pageNum = parseInt(String(page), 10) || 1;
      const limitNum = parseInt(String(limit), 10) || 50;
      const skip = (pageNum - 1) * limitNum;
      const where: any = {};

      if (status && status !== 'TODOS') {
        where.status = String(status);
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

      return res.json({
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        data: submissions,
      });
    }

    // 3. PATCH status
    if (req.method === 'PATCH' && id) {
      const { status: newStatus } = req.body || {};
      const updated = await prisma.clientSubmission.update({
        where: { id: String(id) },
        data: { status: newStatus },
      });
      return res.json({ success: true, data: updated });
    }

    // 4. DELETE
    if (req.method === 'DELETE' && id) {
      await prisma.clientSubmission.delete({
        where: { id: String(id) },
      });
      return res.json({ success: true, message: 'Envio excluído com sucesso.' });
    }

    return res.status(405).json({ error: 'Método não suportado.' });
  } catch (error: any) {
    console.error('Erro no handler de submissions:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação.', details: error.message });
  }
}
