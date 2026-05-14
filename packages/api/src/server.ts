import { createServer } from 'node:http';
import { sendJson, HttpError } from './http/errors.js';
import { readJsonBody } from './http/readJsonBody.js';
import { rateLimit } from './http/rateLimit.js';
import { healthResponse } from './routes/health.js';
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
      if (req.method === 'POST' && req.url === '/validate') {
        const body = await readJsonBody(req);
        return sendJson(res, 200, { ok: true, received: body });
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
