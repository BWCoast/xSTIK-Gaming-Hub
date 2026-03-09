import { createClient } from '@supabase/supabase-js';  // ESM

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  if (request.method === 'POST') {
    const { username, first_game } = await request.json();
    const { error } = await supabase.from('players').upsert({ username, first_game, last_seen: new Date().toISOString() });
    if (error) return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });
    return new Response(JSON.stringify({ username }), { status: 200, headers: corsHeaders });
  } else {
    const { data: player, error } = await supabase.from('players').select('*').limit(1);
    if (error || !player?.[0]) return new Response(null, { status: 404, headers: corsHeaders });
    return new Response(JSON.stringify(player[0]), { status: 200, headers: corsHeaders });
  }
}
