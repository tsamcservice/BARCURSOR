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
    const { idToken } = req.body;
    
    // 驗證 LINE ID Token
    const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: process.env.LINE_CHANNEL_ID,
      }),
    });

    if (!response.ok) {
      throw new Error('LINE 驗證失敗');
    }

    const lineUser = await response.json();
    
    // 檢查用戶是否存在
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('line_user_id', lineUser.sub)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    // 如果用戶不存在，創建新用戶
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            line_user_id: lineUser.sub,
            name: lineUser.name,
            picture_url: lineUser.picture,
            email: lineUser.email,
          },
        ])
        .single();

      if (createError) {
        throw createError;
      }

      return res.status(200).json({
        user: newUser,
        isNew: true,
      });
    }

    // 更新用戶資訊
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: lineUser.name,
        picture_url: lineUser.picture,
        email: lineUser.email,
        last_login: new Date().toISOString(),
      })
      .eq('line_user_id', lineUser.sub)
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      user: updatedUser,
      isNew: false,
    });
  } catch (error) {
    console.error('驗證錯誤:', error);
    return res.status(500).json({ error: '驗證失敗' });
  }
}; 