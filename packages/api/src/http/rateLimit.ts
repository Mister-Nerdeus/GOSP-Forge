const hits = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || cur.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  cur.count += 1;
  return cur.count <= limit;
}
