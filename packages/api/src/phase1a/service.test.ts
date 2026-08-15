import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { Phase1aService, Phase1aValidationError } from './service.js';

const fixture = (name: string) =>
  JSON.parse(
    readFileSync(new URL(`../../../../examples/phase-1a/${name}`, import.meta.url), 'utf8'),
  ) as unknown;

describe('Phase1aService canonical product loop', () => {
  it('runs two valid sandbox submissions through REP and replays both results', async () => {
    const service = new Phase1aService(undefined, () => '2026-08-09T12:00:00.000Z');
    const workspace = await service.getWorkspace();

    expect(workspace.challenge.record.id).toBe('sandbox-001');
    expect(workspace.submissions).toHaveLength(2);
    expect(workspace.evaluations.map((item) => (item.evaluation.result as { value: number }).value)).toEqual([
      53,
      23,
    ]);
    expect(workspace.evaluations.every((item) => item.replay.ok)).toBe(true);
    expect(workspace.evaluations.every((item) => item.replay.resultHashMatches)).toBe(true);
    expect(workspace.evaluations[0]!.evaluation.materialResultHash).not.toBe(
      workspace.evaluations[1]!.evaluation.materialResultHash,
    );
  });

  it('selects any two process-local submissions for the displayed comparison', async () => {
    const service = new Phase1aService(undefined, () => '2026-08-09T12:00:00.000Z');
    const workspace = await service.getWorkspace();
    const imported = structuredClone(workspace.submissions[0]!);
    imported.id = 'submission.sandbox-001.local-comparison';
    imported.materialPayload = { values: [2, 2, 3], weights: [2, 3, 5], offset: 7 };
    await service.createSubmission(imported);

    const selected = await service.getWorkspace({
      baseline: workspace.selection.baseline,
      candidate: { id: imported.id, revision: imported.revision },
    });

    expect(selected.submissions).toHaveLength(3);
    expect(selected.selection.candidate).toEqual({ id: imported.id, revision: imported.revision });
    expect(selected.evaluations.map((item) => item.evaluation.submissionRef.id)).toEqual([
      workspace.selection.baseline.id,
      imported.id,
    ]);
    expect(selected.comparison.changedInputPaths).toContain('submission.materialPayload.values[0]');
    expect(selected.comparison.resultDeltas).toContainEqual(
      expect.objectContaining({ resultPath: 'result.value', delta: 4 }),
    );
    await expect(
      service.getWorkspace({ baseline: selected.selection.baseline, candidate: selected.selection.baseline }),
    ).rejects.toThrow(/different Submission/);
  });

  it('accepts a valid local Challenge and rejects invalid or conflicting identities', async () => {
    const service = new Phase1aService();
    const workspace = await service.getWorkspace();
    const valid = structuredClone(workspace.challenge.record);
    valid.id = 'sandbox-001.local-copy';

    await expect(service.createChallenge(valid)).resolves.toMatchObject({
      kind: 'Challenge',
      id: 'sandbox-001.local-copy',
    });
    await expect(service.createChallenge({ ...valid, title: '' })).rejects.toBeInstanceOf(
      Phase1aValidationError,
    );
    await expect(
      service.createChallenge({
        ...valid,
        evaluationModelRef: { ...valid.evaluationModelRef, revision: 'mistyped' },
      }),
    ).rejects.toThrow(/evaluationModelRef/);

    await expect(service.createChallenge({ ...valid, title: 'Conflicting title' })).rejects.toThrow(
      /different Challenge/,
    );
  });

  it('validates Submission schemas and exact Challenge/Scenario references without repair', async () => {
    const service = new Phase1aService();
    const workspace = await service.getWorkspace();
    const valid = structuredClone(workspace.submissions[0]!);
    valid.id = 'submission.sandbox-001.imported';

    await expect(service.createSubmission(valid)).resolves.toMatchObject({ id: valid.id });
    await expect(
      service.createSubmission({
        ...valid,
        id: 'submission.sandbox-001.invalid-payload',
        materialPayload: { values: ['not-a-number'], weights: [1], offset: 0 },
      }),
    ).resolves.toMatchObject({ id: 'submission.sandbox-001.invalid-payload' });
    await expect(
      service.evaluateSubmission('submission.sandbox-001.invalid-payload', '1.0.0'),
    ).rejects.toThrow();
    await expect(
      service.createSubmission({
        ...valid,
        id: 'submission.sandbox-001.bad-challenge-ref',
        challengeRef: { ...valid.challengeRef, revision: '9.9.9' },
      }),
    ).rejects.toThrow(/challengeRef/);
    await expect(
      service.createSubmission({
        ...valid,
        id: 'submission.sandbox-001.bad-scenario-ref',
        scenarioRef: { ...valid.scenarioRef, id: 'scenario.mistyped' },
      }),
    ).rejects.toThrow(/scenarioRef/);
  });

  it('exercises the checked-in valid and negative import fixtures', async () => {
    const service = new Phase1aService();
    await expect(service.createChallenge(fixture('challenge.sandbox-001.json'))).resolves.toMatchObject({
      id: 'sandbox-001',
    });
    await expect(service.createSubmission(fixture('submission.reference.json'))).resolves.toMatchObject({
      id: 'submission.sandbox-001.reference',
    });
    await expect(service.createSubmission(fixture('submission.candidate-low.json'))).resolves.toMatchObject({
      id: 'submission.sandbox-001.candidate-low',
    });
    await expect(
      service.createSubmission(fixture('submission.invalid-mistyped-reference.json')),
    ).rejects.toThrow(/challengeRef/);
    await service.createSubmission(fixture('submission.invalid-material-input.json'));
    await expect(
      service.evaluateSubmission('submission.sandbox-001.invalid-material-input', '1.0.0'),
    ).rejects.toThrow(/one weight for each value/);
  });

  it('keeps execution metadata outside material hashes', async () => {
    const service = new Phase1aService();
    const first = await service.evaluateSubmission('submission.sandbox-001.reference', '1.0.0', {
      executionId: 'windows-run',
      startedAt: '2026-08-09T12:00:00.000Z',
      completedAt: '2026-08-09T12:00:01.000Z',
      os: 'win32',
      runtime: 'v22.16.0',
    });
    const second = await service.evaluateSubmission('submission.sandbox-001.reference', '1.0.0', {
      executionId: 'linux-run',
      startedAt: '2026-08-09T13:00:00.000Z',
      completedAt: '2026-08-09T13:00:02.000Z',
      os: 'linux',
      runtime: 'v24.19.0',
    });

    expect(first.executionEvidence.environment.os).not.toBe(second.executionEvidence.environment.os);
    expect(first.evaluation.materialInputHash).toBe(second.evaluation.materialInputHash);
    expect(first.evaluation.materialResultHash).toBe(second.evaluation.materialResultHash);
  });

  it('keeps explainability traceable and leaves external/physical obligations unresolved', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const view = workspace.evaluations[0]!;

    expect(view.evaluation.explainability.equations[0]?.id).toBe('sandbox-001.weighted-sum');
    expect(view.evaluation.explainability.intermediateValues).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'weighted-sum', value: 23 })]),
    );
    expect(view.claim.professionalDisposition.status).toBe('not-assessed');
    expect(view.claim.deploymentReadiness).toBe('concept-only');
    expect(view.claim.proofObligations.filter((item) => item.status === 'open').map((item) => item.id)).toEqual([
      'proof.independent-reproduction',
      'proof.physical-validation',
    ]);
    expect(view.limitations.join(' ')).toMatch(/No professional approval/);
  });
});
