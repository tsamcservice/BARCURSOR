import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ success: false, message: '不支援的請求方法' });
    }

    try {
        const { cardId, userId } = req.query;

        if (!cardId || !userId) {
            return res.status(400).json({ success: false, message: '缺少必要參數' });
        }

        // 先檢查卡片是否存在且屬於該使用者
        const { data: card, error: fetchError } = await supabase
            .from('cards')
            .select('*')
            .eq('id', cardId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !card) {
            return res.status(404).json({
                success: false,
                message: '找不到卡片或無權限刪除'
            });
        }

        // 刪除卡片
        const { error: deleteError } = await supabase
            .from('cards')
            .delete()
            .eq('id', cardId);

        if (deleteError) {
            throw deleteError;
        }

        return res.status(200).json({
            success: true,
            message: '卡片已刪除'
        });
    } catch (error) {
        console.error('刪除卡片錯誤：', error);
        return res.status(500).json({
            success: false,
            message: '刪除卡片時發生錯誤'
        });
    }
} 