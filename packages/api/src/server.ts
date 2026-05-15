import { createServer } from 'node:http';
import { sendJson, HttpError } from './http/errors.js';
import { readJsonBody } from './http/readJsonBody.js';
import { rateLimit } from './http/rateLimit.js';
import { healthResponse } from './routes/health.js';
import { validateProjectBody } from './routes/validate.js';
import { versionResponse } from './routes/version.js';
export function createGospServer() {
  return createServer(async (req, res) => {
    try {
      const key = req.socket.remoteAddress ?? 'unknown';
      if (!rateLimit(key)) return sendJson(res, 429, { error: 'rate_limited' });
      if (req.method === 'GET' && req.url === '/health')
        return sendJson(res, 200, healthResponse());
      if (req.method === 'GET' && req.url === '/version')
        return sendJson(res, 200, versionResponse());
      const requestUrl = new URL(req.url ?? '/', 'http://localhost');
      if (req.method === 'POST' && requestUrl.pathname === '/validate') {
        const body = await readJsonBody(req);
        const mode = requestUrl.searchParams.get('mode') === 'repo' ? 'repo' : 'schema-only';
        const result = validateProjectBody(body, { mode });
        return sendJson(res, result.status, result.body);
      }
      return sendJson(res, 404, { error: 'not_found' });
    } catch (error) {
      if (error instanceof HttpError)
        return sendJson(res, error.statusCode, { error: error.message });
      return sendJson(res, 500, { error: 'internal_error' });
    }
  });
}
if (import.meta.url === 'file://' + process.argv[1]) {
  const port = Number(process.env.PORT ?? 3080);
  createGospServer().listen(port, () =>
    console.log(JSON.stringify({ ok: true, url: 'http://localhost:' + port })),
  );
}
