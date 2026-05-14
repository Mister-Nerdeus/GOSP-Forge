export interface StorageAdapter {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown): Promise<void>;
}

export type StorageKind = 'memory' | 'json-file' | 'managed';
export type StorageEnvironment = 'local' | 'production';
