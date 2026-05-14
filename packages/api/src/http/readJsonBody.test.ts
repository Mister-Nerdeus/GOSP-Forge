import { describe, expect, it } from 'vitest';
import { Readable } from 'node:stream';
import type { IncomingMessage } from 'node:http';
import { readJsonBody } from './readJsonBody.js';

function requestFrom(body: string, contentType = 'application/json') {
  const req = Readable.from([body]) as unknown as IncomingMessage;
  req.headers = { 'content-type': contentType };
  return req;
}

describe('readJsonBody', () => {
  it('parses valid JSON bodies', async () => {
    await expect(readJsonBody(requestFrom('{"ok":true}'))).resolves.toEqual({ ok: true });
  });

  it('rejects wrong content type', async () => {
    await expect(readJsonBody(requestFrom('{}', 'text/plain'))).rejects.toThrow(/Content-Type/);
  });

  it('rejects invalid JSON', async () => {
    await expect(readJsonBody(requestFrom('{'))).rejects.toThrow(/Invalid JSON/);
  });

  it('rejects oversized JSON bodies', async () => {
    await expect(readJsonBody(requestFrom('{"long":true}'), 2)).rejects.toThrow(/maximum size/);
  });
});
