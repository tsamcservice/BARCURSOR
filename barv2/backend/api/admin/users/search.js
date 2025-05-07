import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: '不支援的請求方法' });
    }

    const { query } = req.query;

    try {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('last_login', { ascending: false });

        if (error) throw error;

        if (query) {
            users = users.filter(user => 
                user.name?.toLowerCase().includes(query.toLowerCase()) ||
                user.email?.toLowerCase().includes(query.toLowerCase()) ||
                user.line_user_id?.toLowerCase().includes(query.toLowerCase())
            );
        }

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('搜尋使用者錯誤:', error);
        return res.status(500).json({
            success: false,
            message: '搜尋使用者時發生錯誤'
        });
    }
} 