import { describe, expect, it } from 'vitest';
import { rateLimit } from './rateLimit.js';

describe('rateLimit', () => {
  it('allows requests up to the deterministic limit and rejects the next request', () => {
    const key = `rate-limit-test-${Date.now()}`;

    expect(rateLimit(key, 2, 60_000)).toBe(true);
    expect(rateLimit(key, 2, 60_000)).toBe(true);
    expect(rateLimit(key, 2, 60_000)).toBe(false);
  });
});
