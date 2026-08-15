import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { LocalFileSystemStorage } from './localFileSystemStorage.js';
import { Phase1aService } from '../phase1a/service.js';

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('LocalFileSystemStorage', () => {
  it('persists versioned envelopes across adapter instances', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'gosp-workspace-'));
    roots.push(root);
    const first = new LocalFileSystemStorage(root);
    await first.set('phase1a:test:key', { value: 42 });

    const second = new LocalFileSystemStorage(root);
    await expect(second.get('phase1a:test:key')).resolves.toEqual({ value: 42 });
    expect(second.describe()).toMatchObject({ kind: 'local-filesystem', durable: true });
    const files = await import('node:fs/promises').then(({ readdir }) => readdir(root));
    expect(files).toHaveLength(1);
    const envelope = JSON.parse(await readFile(path.join(root, files[0]!), 'utf8')) as object;
    expect(envelope).toMatchObject({ storageSchemaVersion: '1', key: 'phase1a:test:key' });
  });

  it('does not derive file paths from caller-controlled storage keys', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'gosp-workspace-'));
    roots.push(root);
    const storage = new LocalFileSystemStorage(root);
    await storage.set('../../outside', { safe: true });
    const files = await import('node:fs/promises').then(({ readdir }) => readdir(root));
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^[a-f0-9]{64}\.json$/);
  });

  it('restores authored canonical records after the service restarts', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'gosp-workspace-'));
    roots.push(root);
    const first = new Phase1aService(new LocalFileSystemStorage(root));
    const workspace = await first.getWorkspace();
    const submission = structuredClone(workspace.submissions[0]!);
    submission.id = 'submission.sandbox-001.persisted';
    await first.createSubmission(submission);

    const restarted = new Phase1aService(new LocalFileSystemStorage(root));
    const restored = await restarted.getWorkspace();
    expect(restored.persistence).toMatchObject({ kind: 'local-filesystem', durable: true });
    expect(restored.submissions.map((item) => item.id)).toContain(
      'submission.sandbox-001.persisted',
    );
  });
});
