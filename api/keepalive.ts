type CheckStatus = 'ok' | 'error';

type KeepaliveResponse = {
  ok: boolean;
  site: CheckStatus;
  supabase: CheckStatus;
  checkedAt: string;
  details?: {
    siteStatus?: number;
    supabaseStatus?: number;
    message?: string;
  };
};

const DEFAULT_SITE_URL = 'https://anggadewa.vercel.app';

function jsonResponse(body: KeepaliveResponse | { ok: false; error: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function getEnv(name: string) {
  return process.env[name]?.trim() || '';
}

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, '');
}

async function checkSite(siteUrl: string) {
  const response = await fetch(siteUrl, { cache: 'no-store' });

  return {
    ok: response.ok,
    status: response.status,
  };
}

async function checkSupabase(supabaseUrl: string, supabaseAnonKey: string) {
  const endpoint = `${normalizeUrl(supabaseUrl)}/rest/v1/projects?select=id&limit=1`;
  const response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      apikey: supabaseAnonKey,
      authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  return {
    ok: response.ok,
    status: response.status,
  };
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          allow: 'GET',
          'cache-control': 'no-store',
        },
      });
    }

    const cronSecret = getEnv('CRON_SECRET');
    if (!cronSecret) {
      return jsonResponse({ ok: false, error: 'Missing CRON_SECRET configuration' }, 500);
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');
    const siteUrl = normalizeUrl(getEnv('SITE_URL') || DEFAULT_SITE_URL);

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ ok: false, error: 'Missing Supabase environment variables' }, 500);
    }

    const checkedAt = new Date().toISOString();

    try {
      const [siteResult, supabaseResult] = await Promise.all([
        checkSite(siteUrl),
        checkSupabase(supabaseUrl, supabaseAnonKey),
      ]);

      const ok = siteResult.ok && supabaseResult.ok;
      const body: KeepaliveResponse = {
        ok,
        site: siteResult.ok ? 'ok' : 'error',
        supabase: supabaseResult.ok ? 'ok' : 'error',
        checkedAt,
        details: {
          siteStatus: siteResult.status,
          supabaseStatus: supabaseResult.status,
        },
      };

      return jsonResponse(body, ok ? 200 : 502);
    } catch {
      return jsonResponse(
        {
          ok: false,
          site: 'error',
          supabase: 'error',
          checkedAt,
          details: {
            message: 'Keepalive check failed',
          },
        },
        502
      );
    }
  },
};
