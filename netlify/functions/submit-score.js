// netlify/functions/submit-score.js
// POST a new score to the Supabase leaderboard table.
// Body: { player_name: string, game: string, score: number }

exports.handler = async function (event) {
  const SUPABASE_URL         = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY    = process.env.SUPABASE_ANON_KEY;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  // Writes use the service key (bypasses RLS) so the public insert policy can be dropped.
  // Falls back to anon key if service key is not set (dev/legacy behaviour).
  const WRITE_KEY = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!SUPABASE_URL || !WRITE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing Supabase environment variables' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { player_name, game, score } = body;
  if (!player_name || !game || score === undefined) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields: player_name, game, score' }),
    };
  }

  const url = `${SUPABASE_URL}/rest/v1/leaderboard`;

  try {
    const response = await fetch(url, {
      method:  'POST',
      headers: {
        'apikey':        WRITE_KEY,
        'Authorization': `Bearer ${WRITE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=representation',
      },
      body: JSON.stringify({
        player_name: String(player_name).slice(0, 32),
        game:        String(game).slice(0, 64),
        score:       Math.round(Number(score)),
      }),
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
    const inserted = Array.isArray(data) ? data[0] : data;
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true, id: inserted && inserted.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Function error', detail: err.message }),
    };
  }
};
