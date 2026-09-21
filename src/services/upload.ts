import api from './api';
import { upload } from '@vercel/blob/client';

export interface UploadProgressCallback {
  (percentage: number): void;
}

export const uploadFile = async (
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  // 1. First priority: Direct Client Upload to Vercel Blob CDN (Fast, uncompressed, supports large files)
  try {
    // 1. Check if Cloudinary credentials are provided via config or backend
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobResult = await upload(`uploads/${Date.now()}-${cleanFileName}`, file, {
      access: 'public',
      handleUploadUrl: '/api/upload/blob',
      onUploadProgress: (progress) => {
        if (onProgress && progress.percentage) {
          onProgress(progress.percentage);
        }
      },
    });

    if (blobResult && blobResult.url) {
      return blobResult.url;
    }
  } catch {
    // Vercel Blob client upload is bypassed if not running on Vercel or if token missing
  }

  // 2. Second priority: Cloudinary (if configured in env)
  try {
    const configRes = await api.get('/config').catch(() => null);
    const config = configRes?.data || {};

    if (config.cloudinaryCloudName && config.cloudinaryUploadPreset) {
      // Direct unsigned upload to Cloudinary (no serverless payload limit, full resolution)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.cloudinaryUploadPreset);

      const xhr = new XMLHttpRequest();
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/auto/upload`
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            // Return secure_url with original quality
            resolve(data.secure_url || data.url);
          } else {
            console.error('Cloudinary Upload Error:', xhr.responseText);
            // Fallback to local Base64
            readAsDataUrl(file, onProgress).then(resolve).catch(reject);
          }
        };

        xhr.onerror = () => {
          // Fallback to local Data URL
          readAsDataUrl(file, onProgress).then(resolve).catch(reject);
        };

        xhr.send(formData);
      });

      return await uploadPromise;
    }

    // 2. Default Local High-Fidelity Data URL / Base64 fallback (preserves 100% exact bytes)
    return await readAsDataUrl(file, onProgress);
  } catch (error) {
    console.warn('Erro no upload de nuvem, usando fallback em alta fidelidade:', error);
    return await readAsDataUrl(file, onProgress);
    console.warn('Fallback Cloudinary erro:', error);
  }

  // 3. Fallback: Local High-Fidelity Data URL / Base64
  return await readAsDataUrl(file, onProgress);
};

const readAsDataUrl = (file: File, onProgress?: UploadProgressCallback): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('Falha ao ler o arquivo de imagem.'));
      reject(new Error('Falha ao processar o arquivo de imagem.'));
    };

    reader.readAsDataURL(file);
  });
};

