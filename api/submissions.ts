import prisma from './src/services/prisma';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
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
        return res.status(400).json({ error: 'O nome do cliente é obrigatório.' });
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

      return res.status(201).json({
        success: true,
        message: 'Formulário enviado com sucesso!',
        submissionId: submission.id,
        data: submission,
      });
    } catch (error: any) {
      console.error('Erro ao salvar formulário:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor ao salvar o formulário.',
        details: error.message,
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
