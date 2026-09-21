import crypto from 'crypto';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!apiSecret || !apiKey || !cloudName) {
      return res.json({
        useUnsigned: true,
        cloudName: cloudName || '',
        uploadPreset: uploadPreset || '',
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `timestamp=${timestamp}${uploadPreset ? `&upload_preset=${uploadPreset}` : ''}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return res.json({
      useUnsigned: false,
      signature,
      timestamp,
      apiKey,
      cloudName,
      uploadPreset,
    });
  } catch (error: any) {
    console.error('Erro ao gerar assinatura de upload:', error);
    return res.status(500).json({ error: 'Erro ao preparar assinatura de upload.' });
  }
}
