import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import type { StorageAdapter } from './storageAdapter.js';

type StoredEnvelope = {
  storageSchemaVersion: '1';
  key: string;
  value: unknown;
};

const filenameFor = (key: string) =>
  `${createHash('sha256').update(key, 'utf8').digest('hex')}.json`;

export class LocalFileSystemStorage implements StorageAdapter {
  private writeQueue = Promise.resolve();

  constructor(private readonly rootDirectory: string) {
    if (!path.isAbsolute(rootDirectory)) {
      throw new Error('Durable workspace storage requires an absolute root directory.');
    }
  }

  private filePath(key: string) {
    return path.join(this.rootDirectory, filenameFor(key));
  }

  async get(key: string) {
    try {
      const envelope = JSON.parse(await readFile(this.filePath(key), 'utf8')) as StoredEnvelope;
      if (envelope.storageSchemaVersion !== '1' || envelope.key !== key) {
        throw new Error(`Stored workspace record failed envelope validation for ${key}.`);
      }
      return envelope.value;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
      throw error;
    }
  }

  async set(key: string, value: unknown) {
    const write = async () => {
      await mkdir(this.rootDirectory, { recursive: true });
      const destination = this.filePath(key);
      const temporary = path.join(this.rootDirectory, `.${filenameFor(key)}.${randomUUID()}.tmp`);
      const envelope: StoredEnvelope = { storageSchemaVersion: '1', key, value };
      await writeFile(temporary, `${JSON.stringify(envelope, null, 2)}\n`, {
        encoding: 'utf8',
        flag: 'wx',
      });
      await rename(temporary, destination);
    };
    const pending = this.writeQueue.then(write, write);
    this.writeQueue = pending.then(() => undefined, () => undefined);
    await pending;
  }

  describe() {
    return {
      kind: 'local-filesystem' as const,
      durable: true,
      schemaVersion: '1' as const,
      disclosure:
        'Canonical records persist in an owner-controlled local workspace directory. This is local durability, not production database, tenancy, or deployment readiness.',
    };
  }
}
