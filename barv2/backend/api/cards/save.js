import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: '不支援的請求方法' });
    }

    try {
        const { content, type } = req.body;

        if (!content || !type) {
            return res.status(400).json({ success: false, message: '缺少必要參數' });
        }

        const { data, error } = await supabase
            .from('cards')
            .insert([
                {
                    content,
                    type,
                    user_id: 'admin' // 暫時使用固定值
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            cardId: data[0].id
        });
    } catch (error) {
        console.error('儲存卡片錯誤：', error);
        return res.status(500).json({
            success: false,
            message: '儲存卡片時發生錯誤'
        });
    }
} 