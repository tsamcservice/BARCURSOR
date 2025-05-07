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
    const { q } = req.query;
    let query = supabase
      .from('users')
      .select('*')
      .order('last_login', { ascending: false });

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,line_user_id.ilike.%${q}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error('搜尋用戶錯誤:', error);
    return res.status(500).json({ error: '搜尋失敗' });
  }
}; 