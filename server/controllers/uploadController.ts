import { Request, Response } from 'express';
import crypto from 'crypto';

export const getUploadSignature = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!apiSecret || !apiKey || !cloudName) {
      // Return unauthenticated unsigned preset configuration if available
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
    console.error('Erro ao gerar assinatura de upload:', error);
    res.status(500).json({ error: 'Erro ao preparar assinatura de upload.' });
  }
};

