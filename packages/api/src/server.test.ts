import { describe, expect, it } from 'vitest';
import { createGospServer, PHASE1A_LOCAL_HOST } from './server.js';

async function withServer<T>(run: (baseUrl: string) => Promise<T>) {
  const server = createGospServer();
  await new Promise<void>((resolve) => server.listen(0, PHASE1A_LOCAL_HOST, resolve));
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
  it('uses the documented loopback-only host for local API listeners', () => {
    expect(PHASE1A_LOCAL_HOST).toBe('127.0.0.1');
  });

  it('serves the complete local Phase-1A workspace and REP export', async () => {
    await withServer(async (baseUrl) => {
      const workspaceResponse = await fetch(`${baseUrl}/api/phase1a/workspace`);
      expect(workspaceResponse.status).toBe(200);
      expect(workspaceResponse.headers.get('cache-control')).toBe('no-store');
      expect(workspaceResponse.headers.get('x-content-type-options')).toBe('nosniff');
      const workspace = (await workspaceResponse.json()) as {
        persistence: { durable: boolean };
        availableEvaluators: Array<{ id: string; challengeRef: { id: string; revision: string } }>;
        evaluations: Array<{ evaluation: { result: { value: number } } }>;
      };
      expect(workspace.persistence.durable).toBe(false);
      expect(workspace.availableEvaluators.map((item) => item.id)).toEqual([
        'evaluator.sandbox-001',
        'evaluator.clean-water.educational-screening',
        'evaluator.solar-deployment.synthetic-screening',
      ]);
      expect(workspace.evaluations.map((item) => item.evaluation.result.value)).toEqual([53, 23]);

      const selectedResponse = await fetch(
        `${baseUrl}/api/phase1a/workspace?baselineId=submission.sandbox-001.candidate-low&baselineRevision=1.0.0&candidateId=submission.sandbox-001.reference&candidateRevision=1.0.0`,
      );
      expect(selectedResponse.status).toBe(200);
      await expect(selectedResponse.json()).resolves.toMatchObject({
        selection: {
          baseline: { id: 'submission.sandbox-001.candidate-low', revision: '1.0.0' },
          candidate: { id: 'submission.sandbox-001.reference', revision: '1.0.0' },
        },
        evaluations: [
          { evaluation: { result: { value: 23 } } },
          { evaluation: { result: { value: 53 } } },
        ],
      });

      const incompleteSelection = await fetch(
        `${baseUrl}/api/phase1a/workspace?baselineId=submission.sandbox-001.reference`,
      );
      expect(incompleteSelection.status).toBe(422);

      const exportResponse = await fetch(
        `${baseUrl}/api/phase1a/export?submissionId=submission.sandbox-001.reference&revision=1.0.0`,
      );
      expect(exportResponse.status).toBe(200);
      await expect(exportResponse.json()).resolves.toMatchObject({
        kind: 'RepReplayRecord',
        expectedMaterialInputHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        expectedMaterialResultHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      });

      const cleanWater = workspace.availableEvaluators[1]!;
      const verticalResponse = await fetch(
        `${baseUrl}/api/phase1a/workspace?challengeId=${encodeURIComponent(cleanWater.challengeRef.id)}&challengeRevision=${encodeURIComponent(cleanWater.challengeRef.revision)}`,
      );
      expect(verticalResponse.status).toBe(200);
      await expect(verticalResponse.json()).resolves.toMatchObject({
        evaluator: { id: 'evaluator.clean-water.educational-screening' },
        evaluations: [
          { evaluation: { result: { flow: { cleanWaterLiters: 64 } } } },
          { evaluation: { result: { flow: { cleanWaterLiters: 72 } } } },
        ],
      });

      const evidenceResponse = await fetch(
        `${baseUrl}/api/phase1a/evidence-package?submissionId=submission.sandbox-001.reference&revision=1.0.0`,
      );
      expect(evidenceResponse.status).toBe(200);
      const evidencePackage = await evidenceResponse.json();
      const evidenceValidation = await fetch(
        `${baseUrl}/api/phase1a/evidence-package/validate`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(evidencePackage),
        },
      );
      expect(evidenceValidation.status).toBe(200);
      await expect(evidenceValidation.json()).resolves.toMatchObject({ ok: true });

      const archiveResponse = await fetch(`${baseUrl}/api/phase1a/archive`);
      expect(archiveResponse.status).toBe(200);
      const archive = await archiveResponse.json();
      const restoreResponse = await fetch(`${baseUrl}/api/phase1a/archive`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(archive),
      });
      expect(restoreResponse.status).toBe(200);
      await expect(restoreResponse.json()).resolves.toEqual({ challenges: 3, submissions: 6 });
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
