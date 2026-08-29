import { describe, expect, it } from 'vitest';
import { createGospServer, PHASE1A_LOCAL_HOST } from '../server.js';
import { Phase1aService } from './service.js';
import { buildStemSystemProjection } from './stemSystemProjection.js';
import {
  createSandboxStemMathDefinition,
  createSandboxStemScienceDefinition,
  createSandboxStemEngineeringDefinition,
} from '@gosp/sim-core';

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
      mathDefinition: createSandboxStemMathDefinition(),
      scienceDefinition: createSandboxStemScienceDefinition(),
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      candidateEvaluation: workspace.evaluations[1]!,
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
    expect(projection.math.quantities).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'sandbox.offset', value: 7, availability: 'available' }),
      expect.objectContaining({ id: 'sandbox.result', value: 53, resultPath: 'evaluation.result.value' }),
    ]));
    expect(projection.math.equations[0]).toMatchObject({
      id: 'sandbox-001.weighted-sum',
      dimensionalStatus: 'not-applicable',
      outputQuantityId: 'sandbox.result',
    });
    expect(projection.math.dependencies).toContainEqual({
      fromQuantityId: 'sandbox.weighted-sum',
      toQuantityId: 'sandbox.result',
      equationId: 'sandbox-001.weighted-sum',
    });
    expect(projection.science).toMatchObject({
      treatment: 'synthetic-benchmark',
      fidelityLevel: 'analytical',
    });
    expect(projection.science.disclosures.join(' ')).toMatch(
      /no natural governing principle.*physical observation/i,
    );
    expect(projection.engineeringDecision.hardGates[0]).toMatchObject({
      baseline: { actual: 'completed', passed: true },
      candidate: { actual: 'completed', passed: true },
      margin: { status: 'not-applicable' },
    });
    expect(projection.engineeringDecision.tradeoff).toMatchObject({
      status: 'single-objective',
      decision: 'baseline-preferred',
    });
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
        math: {
          quantities: expect.arrayContaining([
            { id: 'clean-water.source-liters', label: 'Available source water', symbol: 'sourceLiters', value: 100, unit: 'L', role: 'input', status: 'submitted', sourcePath: 'submission.materialPayload.compiledInput.water.sourceLiters', availability: 'available' },
            { id: 'clean-water.clean-water-liters', label: 'Calculated clean-water volume', symbol: 'cleanWaterLiters', value: 64, unit: 'L', role: 'output', status: 'calculated', sourcePath: 'result.flow.cleanWaterLiters', resultPath: 'evaluation.result.flow.cleanWaterLiters', availability: 'available' },
          ]),
          equations: [expect.objectContaining({
            id: 'clean-water.flow-screen',
            dimensionalStatus: 'not-checked',
            outputQuantityId: 'clean-water.clean-water-liters',
          })],
        },
        science: {
          treatment: 'physical-domain',
          fidelityLevel: 'rule-check',
          items: expect.arrayContaining([
            expect.objectContaining({ classification: 'principle', sourceStatus: 'unavailable' }),
            expect.objectContaining({ classification: 'model-equation', sourceStatus: 'model-declared' }),
            expect.objectContaining({ classification: 'engineering-approximation', applicability: expect.objectContaining({ status: 'unknown' }) }),
            expect.objectContaining({ classification: 'empirical-relationship', evidenceStatus: 'unavailable' }),
            expect.objectContaining({ classification: 'assumption', evidenceStatus: 'assumption-only' }),
            expect.objectContaining({ classification: 'observation', applicability: expect.objectContaining({ status: 'not-declared' }) }),
          ]),
        },
        engineeringDecision: {
          designVariables: [expect.objectContaining({
            id: 'clean-water.design.filter-efficiency',
            changed: true,
            baseline: 0.8,
            candidate: 0.9,
          })],
          hazards: expect.arrayContaining([
            expect.objectContaining({ id: 'hazard.clean-water.potability-misinterpretation', mitigationStatus: 'not-declared' }),
          ]),
          objectives: expect.arrayContaining([
            expect.objectContaining({ id: 'objective.clean-water.output-volume', preference: 'candidate' }),
            expect.objectContaining({ id: 'objective.clean-water.preserve-unsupported-assumption', preference: 'baseline' }),
          ]),
          tradeoff: { status: 'conflict', decision: 'no-universal-winner' },
        },
      });
    });
  });

  it('marks a declared but absent source value unavailable instead of inventing it', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const mathDefinition = createSandboxStemMathDefinition();
    mathDefinition.quantities[0]!.sourcePath = 'submission.materialPayload.notDeclared';
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
      mathDefinition,
      scienceDefinition: createSandboxStemScienceDefinition(),
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      candidateEvaluation: workspace.evaluations[1]!,
    });
    expect(projection.math.quantities[0]).toMatchObject({
      id: 'sandbox.values',
      availability: 'unavailable',
    });
    expect(projection.math.quantities[0]).not.toHaveProperty('value');
  });

  it('rejects math bindings that contradict the recorded equation variables', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const mathDefinition = createSandboxStemMathDefinition();
    delete mathDefinition.equations[0]!.variableBindings.values;
    expect(() => buildStemSystemProjection({
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
      mathDefinition,
      scienceDefinition: createSandboxStemScienceDefinition(),
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      candidateEvaluation: workspace.evaluations[1]!,
    })).toThrow(/must exactly match the recorded equation variables/i);
  });

  it('rejects science links to undeclared math nodes', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const scienceDefinition = createSandboxStemScienceDefinition();
    scienceDefinition.items[0]!.equationIds = ['equation.not-declared'];
    expect(() => buildStemSystemProjection({
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
      mathDefinition: createSandboxStemMathDefinition(),
      scienceDefinition,
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      candidateEvaluation: workspace.evaluations[1]!,
    })).toThrow(/references unknown equation/i);
  });

  it('keeps a failed modeled gate ahead of objective outcomes', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const candidateEvaluation = structuredClone(workspace.evaluations[1]!);
    candidateEvaluation.hardGates[0]!.actual = 'failed';
    candidateEvaluation.hardGates[0]!.passed = false;
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
      candidateEvaluation,
      comparison: workspace.comparison,
      mathDefinition: createSandboxStemMathDefinition(),
      scienceDefinition: createSandboxStemScienceDefinition(),
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
    });
    expect(projection.engineeringDecision.hardGates[0]).toMatchObject({
      candidate: { actual: 'failed', passed: false },
      changed: true,
    });
    expect(projection.engineeringDecision.unresolvedProofObligations.candidate.length).toBeGreaterThan(0);
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
