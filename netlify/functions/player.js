const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  if (event.httpMethod === 'POST') {
    const { username, first_game } = JSON.parse(event.body);
    const { error } = await supabase
      .from('players')
      .upsert({ username, first_game, last_seen: new Date().toISOString() });
    if (error) return { statusCode: 500, body: error.message };
    return { statusCode: 200, body: JSON.stringify({ username }) };
  } else { // GET
    const { data: player, error } = await supabase.from('players').select('*').limit(1);
    if (error || !player?.[0]) return { statusCode: 404 };
    return { statusCode: 200, body: JSON.stringify(player[0]) };
  }
};
