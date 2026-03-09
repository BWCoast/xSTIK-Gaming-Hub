const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  const { player_name, game, score } = JSON.parse(event.body);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  const { error } = await supabase
    .from('leaderboard')
    .insert({ player_name, game, score });
  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: 'Score submitted' };
};
