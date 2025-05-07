import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: '不支援的請求方法' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: '缺少使用者ID' });
        }

        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            cards: data
        });
    } catch (error) {
        console.error('取得卡片列表錯誤：', error);
        return res.status(500).json({
            success: false,
            message: '取得卡片列表時發生錯誤'
        });
    }
} 