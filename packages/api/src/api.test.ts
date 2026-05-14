import { describe, expect, it } from 'vitest';
import { Readable } from 'node:stream';
import { readJsonBody } from './http/readJsonBody.js';
import { healthResponse } from './routes/health.js';
import { versionResponse } from './routes/version.js';
describe('api foundation', () => {
  it('returns health and version identity without secrets', () => {
    expect(healthResponse().ok).toBe(true);
    expect(versionResponse().runtime).toMatch(/^v/);
  });
  it('rejects wrong content type and oversized body', async () => {
    const wrong = Readable.from(['{}']) as unknown as import('node:http').IncomingMessage;
    wrong.headers = { 'content-type': 'text/plain' };
    await expect(readJsonBody(wrong)).rejects.toThrow(/Content-Type/);
    const large = Readable.from(['x'.repeat(10)]) as unknown as import('node:http').IncomingMessage;
    large.headers = { 'content-type': 'application/json' };
    await expect(readJsonBody(large, 2)).rejects.toThrow(/maximum size/);
  });
});
