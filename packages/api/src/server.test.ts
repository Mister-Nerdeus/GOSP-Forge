import { describe, expect, it } from 'vitest';
import { createGospServer } from './server.js';

async function withServer<T>(run: (baseUrl: string) => Promise<T>) {
  const server = createGospServer();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP listener');

  try {
    return await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

describe('createGospServer', () => {
  it('serves the complete local Phase-1A workspace and REP export', async () => {
    await withServer(async (baseUrl) => {
      const workspaceResponse = await fetch(`${baseUrl}/api/phase1a/workspace`);
      expect(workspaceResponse.status).toBe(200);
      const workspace = (await workspaceResponse.json()) as {
        persistence: { durable: boolean };
        evaluations: Array<{ evaluation: { result: { value: number } } }>;
      };
      expect(workspace.persistence.durable).toBe(false);
      expect(workspace.evaluations.map((item) => item.evaluation.result.value)).toEqual([53, 23]);

      const exportResponse = await fetch(
        `${baseUrl}/api/phase1a/export?submissionId=submission.sandbox-001.reference&revision=1.0.0`,
      );
      expect(exportResponse.status).toBe(200);
      await expect(exportResponse.json()).resolves.toMatchObject({
        kind: 'RepReplayRecord',
        expectedMaterialInputHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        expectedMaterialResultHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      });
    });
  });

  it('returns visible validation errors for contradictory Phase-1A references', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/phase1a/submissions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: 'Submission',
          id: 'submission.invalid',
          revision: '1.0.0',
          provenance: { sources: [], method: 'authored' },
          challengeRef: { kind: 'Challenge', id: 'sandbox-001', revision: '9.9.9' },
          scenarioRef: {
            kind: 'Scenario',
            id: 'scenario.sandbox-001.reference',
            revision: '1.0.0',
          },
          materialPayload: { values: [1], weights: [1], offset: 0 },
          status: 'submitted',
        }),
      });

      expect(response.status).toBe(422);
      await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/challengeRef/) });
    });
  });

  it('returns a validation response when REP rejects invalid sandbox material input', async () => {
    await withServer(async (baseUrl) => {
      const submission = {
        kind: 'Submission',
        id: 'submission.invalid-material',
        revision: '1.0.0',
        provenance: { sources: [], method: 'authored' },
        challengeRef: { kind: 'Challenge', id: 'sandbox-001', revision: '1.0.0' },
        scenarioRef: {
          kind: 'Scenario',
          id: 'scenario.sandbox-001.reference',
          revision: '1.0.0',
        },
        materialPayload: { values: [1, 2], weights: [1], offset: 0 },
        status: 'submitted',
      };
      const created = await fetch(`${baseUrl}/api/phase1a/submissions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(submission),
      });
      expect(created.status).toBe(201);

      const evaluated = await fetch(`${baseUrl}/api/phase1a/evaluations`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ submissionId: submission.id, revision: submission.revision }),
      });
      expect(evaluated.status).toBe(422);
      await expect(evaluated.json()).resolves.toMatchObject({
        error: expect.stringMatching(/REP evaluation rejected/),
        issues: expect.arrayContaining([expect.objectContaining({ message: expect.stringMatching(/weight/) })]),
      });
    });
  });

  it('rejects wrong validate content type', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: '{}',
      });

      expect(response.status).toBe(415);
      await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
    });
  });

  it('rejects invalid validate JSON', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      });

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
    });
  });
});
