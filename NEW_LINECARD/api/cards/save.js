const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允許' });
  }

  try {
    const { cardData, userId } = req.body;

    if (!cardData || !userId) {
      return res.status(400).json({ error: '缺少必要參數' });
    }

    // 儲存卡片
    const { data: card, error } = await supabase
      .from('cards')
      .insert([
        {
          user_id: userId,
          content: cardData,
          type: 'custom',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ card });
  } catch (error) {
    console.error('儲存卡片錯誤:', error);
    return res.status(500).json({ error: '儲存失敗' });
  }
}; 