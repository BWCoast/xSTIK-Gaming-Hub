// netlify/functions/leaderboard.js
// Fetches top scores from Supabase leaderboard table
// Endpoint: /.netlify/functions/leaderboard?game=blackjack&limit=10

exports.handler = async function (event) {
  const SUPABASE_URL     = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  // CORS headers — allow the Game Hub to call this function
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Supabase environment variables' }),
    };
  }

  // Read query params: ?game=blackjack&limit=10
  const params = event.queryStringParameters || {};
  const game   = params.game  || null;   // null = all games
  const limit  = Math.min(parseInt(params.limit) || 10, 100); // max 100

  // Build Supabase REST query
  // GET /rest/v1/leaderboard?select=...&order=score.desc&limit=10
  let url = `${SUPABASE_URL}/rest/v1/leaderboard`;
  url += `?select=player_name,game,score,created_at`;
  url += `&order=score.desc`;
  url += `&limit=${limit}`;
  if (game) {
    url += `&game=eq.${encodeURIComponent(game)}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Supabase error', detail: err }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Function error', detail: err.message }),
    };
  }
};
