import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fileBuffer = req.body;
    
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const contentType = req.headers['content-type'] || 'image/jpeg';
    let extension = 'jpg';
    if (contentType === 'image/png') extension = 'png';
    if (contentType === 'image/gif') extension = 'gif';
    if (contentType === 'image/webp') extension = 'webp';
    if (contentType === 'video/mp4') extension = 'mp4';
    if (contentType === 'video/quicktime') extension = 'mov';
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const filename = `uploads/${timestamp}-${randomId}.${extension}`;
    
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    return res.status(200).json({ 
      success: true, 
      url: blob.url,
      filename: filename
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
