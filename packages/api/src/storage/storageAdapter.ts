export interface StorageAdapter {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown): Promise<void>;
  describe(): {
    kind: 'process-local-memory' | 'local-filesystem';
    durable: boolean;
    schemaVersion: '1';
    disclosure: string;
  };
}

export type StorageKind = 'memory' | 'json-file' | 'managed';
export type StorageEnvironment = 'local' | 'production';
