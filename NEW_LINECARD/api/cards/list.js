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
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '缺少必要參數' });
    }

    // 獲取用戶的卡片列表
    const { data: cards, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({ cards });
  } catch (error) {
    console.error('獲取卡片列表錯誤:', error);
    return res.status(500).json({ error: '獲取失敗' });
  }
}; 