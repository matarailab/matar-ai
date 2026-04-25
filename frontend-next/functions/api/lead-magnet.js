// POST /api/lead-magnet  { name, email, magnet }
// → adds contact to Brevo list, sends back signed download URL
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

  const { name, email, magnet } = payload || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400, headers: cors });
  }

  const apiKey = env.BREVO_API_KEY;
  const listId = env.BREVO_LIST_ID ? parseInt(env.BREVO_LIST_ID, 10) : null;
  if (!apiKey) {
    return new Response(JSON.stringify({ ok: false, error: 'missing_api_key' }), { status: 500, headers: cors });
  }

  // Brevo: create or update contact, attach to list, trigger automation via attribute
  const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'accept': 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: name || '',
        LEAD_MAGNET: magnet || 'checklist-5-processi-ai',
        SOURCE: 'matar.studio',
      },
      listIds: listId ? [listId] : undefined,
      updateEnabled: true,
    }),
  });

  if (!brevoRes.ok && brevoRes.status !== 204) {
    const errBody = await brevoRes.text().catch(() => '');
    return new Response(JSON.stringify({ ok: false, error: 'brevo_failed', detail: errBody }), { status: 502, headers: cors });
  }

  const downloadUrl = `/${magnet || 'checklist-5-processi-ai.pdf'}`;
  return new Response(JSON.stringify({ ok: true, downloadUrl }), { status: 200, headers: cors });
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
