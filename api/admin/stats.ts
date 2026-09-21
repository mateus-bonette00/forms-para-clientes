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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Acesso não autorizado.' });
  }

  try {
    const [total, novo, emAnalise, emAndamento, concluido, totalFiles] = await Promise.all([
      prisma.clientSubmission.count(),
      prisma.clientSubmission.count({ where: { status: 'NOVO' } }),
      prisma.clientSubmission.count({ where: { status: 'EM_ANALISE' } }),
      prisma.clientSubmission.count({ where: { status: 'EM_ANDAMENTO' } }),
      prisma.clientSubmission.count({ where: { status: 'CONCLUIDO' } }),
      prisma.uploadedFile.count(),
    ]);

    return res.json({
      total,
      novo,
      emAnalise,
      emAndamento,
      concluido,
      totalFiles,
    });
  } catch (error: any) {
    console.error('Erro no handler de stats:', error);
    return res.status(500).json({ error: 'Erro ao consultar estatísticas.', details: error.message });
  }
}
