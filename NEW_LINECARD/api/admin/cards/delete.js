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
    const { cardId } = req.query;

    if (!cardId) {
      return res.status(400).json({ error: '缺少卡片 ID' });
    }

    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: '卡片已刪除' });
  } catch (error) {
    console.error('刪除卡片錯誤:', error);
    return res.status(500).json({ error: '刪除失敗' });
  }
}; 