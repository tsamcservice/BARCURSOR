const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: '方法不允許' });
  }

  try {
    const { cardId, userId } = req.query;

    if (!cardId || !userId) {
      return res.status(400).json({ error: '缺少必要參數' });
    }

    // 檢查卡片是否屬於該用戶
    const { data: card, error: fetchError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !card) {
      return res.status(404).json({ error: '卡片不存在或無權限刪除' });
    }

    // 刪除卡片
    const { error: deleteError } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId)
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({ message: '刪除成功' });
  } catch (error) {
    console.error('刪除卡片錯誤:', error);
    return res.status(500).json({ error: '刪除失敗' });
  }
}; 