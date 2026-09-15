import type { VercelRequest, VercelResponse } from '@vercel/node';

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

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, '');
}

async function checkSite(siteUrl: string) {
  const response = await fetch(siteUrl, { cache: 'no-store' });
  return { ok: response.ok, status: response.status };
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
  return { ok: response.ok, status: response.status };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    res.setHeader('cache-control', 'no-store');
    return res.status(405).send('Method Not Allowed');
  }

  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return res.status(500).json({ ok: false, error: 'Missing CRON_SECRET configuration' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim() || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim() || '';
  const siteUrl = normalizeUrl(process.env.SITE_URL?.trim() || DEFAULT_SITE_URL);

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ ok: false, error: 'Missing Supabase environment variables' });
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
      details: { siteStatus: siteResult.status, supabaseStatus: supabaseResult.status },
    };

    res.setHeader('cache-control', 'no-store');
    return res.status(ok ? 200 : 502).json(body);
  } catch (error: unknown) {
    res.setHeader('cache-control', 'no-store');
    const errorMessage = error instanceof Error ? error.message : 'Keepalive check failed';
    return res.status(502).json({
      ok: false,
      site: 'error',
      supabase: 'error',
      checkedAt,
      details: { message: errorMessage },
    });
  }
}

