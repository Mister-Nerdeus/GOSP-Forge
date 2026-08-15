import type { StorageAdapter, StorageEnvironment, StorageKind } from './storageAdapter.js';

export class LocalMemoryStorage implements StorageAdapter {
  private data = new Map<string, unknown>();

  async get(key: string) {
    return this.data.get(key);
  }

  async set(key: string, value: unknown) {
    this.data.set(key, value);
  }

  describe() {
    return {
      kind: 'process-local-memory' as const,
      durable: false,
      schemaVersion: '1' as const,
      disclosure: 'Records exist only in this local API process and reset when it restarts.',
    };
  }
}

export function assertStorageAllowed(kind: StorageKind, environment: StorageEnvironment): void {
  if (environment === 'production' && (kind === 'memory' || kind === 'json-file')) {
    throw new Error('Local memory and JSON-file storage are rejected in production');
  }
}
