// POST /api/newsletter  { email }
// → subscribes email to Beehiiv publication
export async function onRequestPost({ request, env }) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), { status: 400, headers: cors });
  }

  const { email, referrer } = payload || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400, headers: cors });
  }

  const apiKey = env.BEEHIIV_API_KEY;
  const pubId = env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return new Response(JSON.stringify({ ok: false, error: 'missing_config' }), { status: 500, headers: cors });
  }

  const beehiivRes = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: 'matar.studio',
      utm_medium: 'website',
      referring_site: referrer || 'matar.studio',
    }),
  });

  if (!beehiivRes.ok) {
    const errBody = await beehiivRes.text().catch(() => '');
    return new Response(JSON.stringify({ ok: false, error: 'beehiiv_failed', detail: errBody }), { status: 502, headers: cors });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
