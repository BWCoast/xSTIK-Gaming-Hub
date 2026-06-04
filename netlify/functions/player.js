// netlify/functions/player.js
// GET  /.netlify/functions/player?username=xxx  — fetch a player by username
// POST /.netlify/functions/player               — upsert player { username, first_game }

exports.handler = async function (event) {
  const SUPABASE_URL         = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY    = process.env.SUPABASE_ANON_KEY;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  // Writes use the service key (bypasses RLS) so the public insert policy can be dropped.
  const WRITE_KEY = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 'application/json',
  };

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

  // Read headers use anon key (subject to RLS read policies).
  const supabaseHeaders = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type':  'application/json',
  };

  // Write headers use service key (bypasses RLS — no public insert policy needed).
  const supabaseWriteHeaders = {
    'apikey':        WRITE_KEY,
    'Authorization': `Bearer ${WRITE_KEY}`,
    'Content-Type':  'application/json',
  };

  // --- GET: look up a player ---
  if (event.httpMethod === 'GET') {
    const params   = event.queryStringParameters || {};
    const username = (params.username || '').trim();

    if (!username) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing username parameter' }) };
    }

    const url = `${SUPABASE_URL}/rest/v1/players?username=eq.${encodeURIComponent(username)}&select=username,first_game,created_at,last_seen&limit=1`;

    try {
      const response = await fetch(url, { headers: supabaseHeaders });
      if (!response.ok) {
        const err = await response.text();
        return { statusCode: response.status, headers, body: JSON.stringify({ error: 'Supabase error', detail: err }) };
      }

      const data = await response.json();
      if (!data.length) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Player not found' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify(data[0]) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Function error', detail: err.message }) };
    }
  }

  // --- POST: upsert a player ---
  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const { username, first_game } = body;
    if (!username) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required field: username' }) };
    }

    const url = `${SUPABASE_URL}/rest/v1/players`;

    try {
      const response = await fetch(url, {
        method:  'POST',
        headers: { ...supabaseWriteHeaders, 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          username:   String(username).slice(0, 16),
          first_game: first_game ? String(first_game).slice(0, 64) : null,
          last_seen:  new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return { statusCode: response.status, headers, body: JSON.stringify({ error: 'Supabase error', detail: err }) };
      }

      const data = await response.json();
      const player = Array.isArray(data) ? data[0] : data;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, player }) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Function error', detail: err.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
