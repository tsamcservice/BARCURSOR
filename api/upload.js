import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  try {
    const { path: filePath, content } = req.body;
    
    // 確保路徑安全
    const safePath = path.join(process.cwd(), 'public', filePath);
    
    // 確保目錄存在
    const dir = path.dirname(safePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 寫入檔案
    fs.writeFileSync(safePath, content);
    
    // 返回檔案 URL
    const fileUrl = `/${filePath}`;
    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('檔案上傳失敗:', error);
    return res.status(500).json({ error: '檔案上傳失敗' });
  }
} 