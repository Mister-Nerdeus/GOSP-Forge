import { describe, expect, it } from 'vitest';
import { createGospServer, PHASE1A_LOCAL_HOST } from '../server.js';
import { Phase1aService } from './service.js';
import { buildStemSystemProjection } from './stemSystemProjection.js';

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

describe('STEM system projection', () => {
  it('projects the canonical Sandbox workspace without introducing new calculations', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const projection = buildStemSystemProjection({
      challenge: workspace.challenge.record,
      scenario: workspace.challenge.scenario,
      model: workspace.challenge.model,
      workflow: workspace.challenge.workflow,
      requirements: workspace.challenge.requirements,
      constraints: workspace.challenge.constraints,
      systemElements: workspace.challenge.systemElements,
      interfaces: workspace.challenge.interfaces,
      referenceEvaluation: workspace.evaluations[0]!,
      comparison: workspace.comparison,
    });

    expect(projection.problem.title).toBe('Sandbox 001 deterministic weighted sum');
    expect(projection.learningDepth).toBe('explore');
    expect(projection.boundary.challenge.id).toBe('sandbox-001');
    expect(projection.model.fidelityLevel).toBe(workspace.challenge.model.fidelity.level);
    expect(projection.workflow.map((step) => step.id)).toEqual(
      workspace.challenge.workflow.steps.map((step) => step.id),
    );
    expect(projection.engineering.requirements).toHaveLength(
      workspace.challenge.requirements.length,
    );
    expect(projection.evidenceStatus.claim).toBe(workspace.evaluations[0]!.claim.statement);
    expect(projection.evidenceStatus.unresolvedProofObligations.map((item) => item.id)).toEqual([
      'proof.independent-reproduction',
      'proof.physical-validation',
    ]);
    expect(projection.systemMap.declarationStatus).toBe('not-declared');
    expect(projection.systemMap.elements).toEqual([]);
    expect(projection.systemMap.interfaces).toEqual([]);
    expect(projection.systemMap.disclosures).toEqual(
      expect.arrayContaining([expect.stringMatching(/does not infer parts or connections/i)]),
    );
    expect(projection.variableRoles.inputs.length).toBeGreaterThan(0);
    expect(projection.variableRoles.changeablePaths).toContain(
      'submission.materialPayload.values[0]',
    );
    expect(projection.variableRoles.outputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'evaluation.result.value', status: 'calculated' }),
      ]),
    );
    expect(projection.variableRoles.measurementStatus).toBe('not-declared');
    expect(projection.disclosure).toMatch(/projection of canonical GOSP records/i);
  });

  it('serves the STEM system view for the default and selected registered challenge', async () => {
    await withServer(async (baseUrl) => {
      const defaultResponse = await fetch(`${baseUrl}/api/phase1a/stem-system`);
      expect(defaultResponse.status).toBe(200);
      await expect(defaultResponse.json()).resolves.toMatchObject({
        projectionVersion: '0.1.0',
        learningDepth: 'explore',
        problem: { title: 'Sandbox 001 deterministic weighted sum' },
        boundary: { challenge: { id: 'sandbox-001', revision: '1.0.0' } },
      });

      const workspaceResponse = await fetch(`${baseUrl}/api/phase1a/workspace`);
      const workspace = (await workspaceResponse.json()) as {
        availableEvaluators: Array<{
          id: string;
          challengeRef: { id: string; revision: string };
        }>;
      };
      const cleanWater = workspace.availableEvaluators.find((item) =>
        item.id.includes('clean-water'),
      )!;
      const selectedResponse = await fetch(
        `${baseUrl}/api/phase1a/stem-system?challengeId=${encodeURIComponent(cleanWater.challengeRef.id)}&challengeRevision=${encodeURIComponent(cleanWater.challengeRef.revision)}`,
      );
      expect(selectedResponse.status).toBe(200);
      await expect(selectedResponse.json()).resolves.toMatchObject({
        boundary: {
          challenge: {
            id: cleanWater.challengeRef.id,
            revision: cleanWater.challengeRef.revision,
          },
        },
        model: { fidelityLevel: 'rule-check' },
        systemMap: {
          declarationStatus: 'declared',
          elements: [
            { id: 'source', name: 'Source reservoir and low-voltage supply', resolutionStatus: 'resolved' },
            { id: 'pump', name: 'Water pump', resolutionStatus: 'resolved' },
            { id: 'filter', name: 'Educational filter stage', resolutionStatus: 'resolved' },
          ],
          interfaces: [
            { fromElementId: 'source', toElementId: 'pump', interfaceType: 'resource' },
            { fromElementId: 'source', toElementId: 'pump', interfaceType: 'power' },
            { fromElementId: 'pump', toElementId: 'filter', interfaceType: 'resource' },
          ],
        },
        variableRoles: {
          measurementStatus: 'not-declared',
          measuredOutputs: [],
        },
      });
    });
  });

  it('rejects an incomplete STEM challenge selection', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/phase1a/stem-system?challengeId=sandbox-001`);
      expect(response.status).toBe(422);
      await expect(response.json()).resolves.toMatchObject({
        error: expect.stringMatching(/challengeId and challengeRevision together/i),
      });
    });
  });
});
