const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允許' });
  }

  try {
    const { cardId } = req.query;

    if (!cardId) {
      return res.status(400).json({ error: '缺少必要參數' });
    }

    // 獲取卡片內容
    const { data: card, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single();

    if (error || !card) {
      return res.status(404).json({ error: '卡片不存在' });
    }

    // 增加分享次數
    await supabase
      .from('cards')
      .update({ share_count: (card.share_count || 0) + 1 })
      .eq('id', cardId);

    return res.status(200).json({ card });
  } catch (error) {
    console.error('分享卡片錯誤:', error);
    return res.status(500).json({ error: '分享失敗' });
  }
}; 