import { describe, expect, it } from 'vitest';
import { createGospServer, PHASE1A_LOCAL_HOST } from '../server.js';
import { Phase1aService } from './service.js';
import { buildStemSystemProjection } from './stemSystemProjection.js';
import {
  createSandboxStemMathDefinition,
  createSandboxStemScienceDefinition,
  createSandboxStemEngineeringDefinition,
  createSandboxStemTechnologyDefinition,
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
      technologyDefinition: createSandboxStemTechnologyDefinition(),
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
    expect(projection.technology.nodes[0]).toMatchObject({
      category: 'solver',
      systemElementResolution: 'not-declared',
      productProvenanceStatus: 'not-applicable',
    });
    expect(projection.howWeKnow).toMatchObject({
      consequentialResult: { resultPath: 'result.value', value: 53, quantityId: 'sandbox.result' },
      modelEvidenceLadder: {
        modelRepresentation: { fidelityLevel: 'analytical' },
        evidenceStrength: { evidenceReadiness: 'computationally-reproduced' },
        deploymentReadiness: 'concept-only',
        professionalDisposition: 'not-assessed',
      },
      materialIdentity: {
        inputHash: workspace.evaluations[0]!.evaluation.materialInputHash,
        resultHash: workspace.evaluations[0]!.evaluation.materialResultHash,
      },
      executionIdentity: { replayStatus: 'verified-local-replay' },
    });
    expect(projection.howWeKnow.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ category: 'source', status: 'not-declared' }),
      expect.objectContaining({ category: 'proof-obligation', status: 'unavailable' }),
    ]));
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
      const selectedProjection = await selectedResponse.json() as {
        dynamic: { allowedParameters: Array<Record<string, unknown>>; visualPrimitives: Array<Record<string, unknown>>; timePlayback: Record<string, unknown> };
      };
      expect(selectedProjection).toMatchObject({
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
        technology: {
          nodes: expect.arrayContaining([
            expect.objectContaining({ category: 'power', systemElementResolution: 'resolved', productProvenanceStatus: 'not-declared' }),
            expect.objectContaining({ category: 'sensor', declarationStatus: 'conceptual', purposeLinks: [expect.objectContaining({ resolutionStatus: 'not-declared' })] }),
            expect.objectContaining({ category: 'solver', productProvenanceStatus: 'not-applicable' }),
          ]),
        },
        howWeKnow: {
          consequentialResult: { resultPath: 'result.flow.cleanWaterLiters', value: 64, quantityId: 'clean-water.clean-water-liters' },
          modelEvidenceLadder: {
            modelRepresentation: { fidelityLevel: 'rule-check' },
            evidenceStrength: { evidenceReadiness: 'computationally-reproduced' },
            deploymentReadiness: 'concept-only',
            professionalDisposition: 'not-assessed',
          },
          executionIdentity: { replayStatus: 'verified-local-replay' },
        },
      });
      expect(selectedProjection.dynamic.allowedParameters).toContainEqual(expect.objectContaining({
        id: 'clean-water.design.filter-efficiency', currentValue: 0.8, valueType: 'number',
      }));
      expect(selectedProjection.dynamic.visualPrimitives).toEqual(expect.arrayContaining([
        expect.objectContaining({ kind: 'flow', status: 'available', provenance: 'canonical-interface' }),
        expect.objectContaining({ kind: 'electrical-control', status: 'available', provenance: 'canonical-interface' }),
        expect.objectContaining({ kind: 'time-series', status: 'unavailable' }),
        expect.objectContaining({ kind: 'uncertainty', status: 'available', provenance: 'model-metadata' }),
        expect.objectContaining({ kind: 'sensitivity', status: 'available', provenance: 'evaluation-result' }),
      ]));
      expect(selectedProjection.dynamic.timePlayback).toMatchObject({ status: 'unavailable', provenance: 'not-declared', frameCount: 0, explanation: expect.stringMatching(/disabled/i) });
      expect(selectedProjection.experiment).toMatchObject({
        testPlan: { status: 'planned', repetitions: { planned: 3, completed: 0 } },
        prediction: { status: 'available', quantityId: 'clean-water.clean-water-liters', value: 64, unit: 'L' },
        observation: { status: 'available', classification: 'synthetic', value: 58, uncertainty: 2, unit: 'L' },
        discrepancy: { status: 'available', signed: -6, absolute: 6, criterionOutcome: 'fail', failureState: 'negative-result' },
        canonicalTruthBoundary: {
          preservedFailureState: 'preserved',
          evidenceReadinessBefore: 'computationally-reproduced',
          evidenceReadinessAfter: 'computationally-reproduced',
          readinessUpdate: 'not-applied',
        },
      });
      expect(selectedProjection.variableRoles).toMatchObject({ measurementStatus: 'not-declared', measuredOutputs: [] });
      expect(selectedProjection.experiment.disclosures.join(' ')).toMatch(/synthetic observation is not a measurement.*one observation is not validation/i);
      const waterRelevance = selectedProjection.humanRelevance.categories.find((item) => item.category === 'water');
      expect(waterRelevance).toMatchObject({
        status: 'supported',
        outcomes: expect.arrayContaining([
          expect.objectContaining({ interpretation: 'benefit', measures: [expect.objectContaining({ quantityId: 'clean-water.clean-water-liters', value: 64, unit: 'L' })] }),
          expect.objectContaining({ interpretation: 'tradeoff', statement: expect.stringMatching(/not a universal preference/i) }),
          expect.objectContaining({ interpretation: 'uncertainty', statement: expect.stringMatching(/model input.*not been physically validated/i) }),
        ]),
      });
      expect(waterRelevance!.outcomes.every((item) => item.evidenceRefs.length > 0)).toBe(true);
      expect(selectedProjection.humanRelevance.categories.find((item) => item.category === 'cost')).toMatchObject({ status: 'unknown', outcomes: [] });
      expect(selectedProjection.humanRelevance.technicalValueSeparation).toBe(true);
    });
  });

  it('routes an allowed Clean Water parameter change through a canonical Submission and evaluator', async () => {
    await withServer(async (baseUrl) => {
      const selected = await fetch(`${baseUrl}/api/phase1a/workspace?challengeId=challenge.clean-water-local-demo&challengeRevision=1.0.0&learningDepth=solve`).then((response) => response.json()) as {
        selection: { baseline: { id: string; revision: string } };
      };
      const response = await fetch(`${baseUrl}/api/phase1a/parameter-change`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          baseline: selected.selection.baseline,
          parameterId: 'clean-water.design.filter-efficiency',
          value: 0.75,
          learningDepth: 'solve',
        }),
      });
      expect(response.status).toBe(200);
      const changed = await response.json() as {
        stemSystem: { learningDepth: string; dynamic: { causalHighlights: { changedInputs: unknown[]; changedResults: unknown[] } } };
        selection: { baseline: { id: string }; candidate: { id: string } };
        evaluations: Array<{ evaluation: { result: { flow: { cleanWaterLiters: number } }; materialInputHash: string; materialResultHash: string } }>;
        comparison: { changedInputs: Array<{ path: string; baseline: unknown; candidate: unknown }>; resultDeltas: Array<{ resultPath: string; baseline: number; candidate: number; delta: number }> };
      };
      expect(changed.selection.candidate.id).toMatch(/^submission\.challenge\.clean-water-local-demo\.parameter-/);
      expect(changed.selection.candidate.id).not.toBe(changed.selection.baseline.id);
      expect(changed.evaluations.map((item) => item.evaluation.result.flow.cleanWaterLiters)).toEqual([64, 60]);
      expect(changed.evaluations[1]!.evaluation.materialInputHash).not.toBe(changed.evaluations[0]!.evaluation.materialInputHash);
      expect(changed.evaluations[1]!.evaluation.materialResultHash).not.toBe(changed.evaluations[0]!.evaluation.materialResultHash);
      expect(changed.comparison.changedInputs).toContainEqual(expect.objectContaining({
        path: 'submission.materialPayload.compiledInput.water.filterEfficiency', baseline: 0.8, candidate: 0.75,
      }));
      expect(changed.comparison.resultDeltas).toContainEqual(expect.objectContaining({
        resultPath: 'result.flow.cleanWaterLiters', baseline: 64, candidate: 60, delta: -4,
      }));
      expect(changed.stemSystem.learningDepth).toBe('solve');
      expect(changed.stemSystem.dynamic.causalHighlights.changedInputs.length).toBeGreaterThan(0);
      expect(changed.stemSystem.dynamic.causalHighlights.changedResults.length).toBeGreaterThan(0);
    });
  });

  it('projects retractable solar through the unchanged public STEM contract surface', async () => {
    await withServer(async (baseUrl) => {
      const query = 'challengeId=challenge.solar-deployment.synthetic&challengeRevision=0.1.0&learningDepth=verify';
      const response = await fetch(`${baseUrl}/api/phase1a/stem-system?${query}`);
      expect(response.status).toBe(200);
      const projection = await response.json() as {
        boundary: { challenge: { id: string } };
        systemMap: { elements: Array<{ id: string }> };
        math: { equations: Array<{ id: string }>; quantities: Array<{ id: string; value?: number }> };
        science: { treatment: string };
        engineeringDecision: { tradeoff: { status: string; decision: string }; hazards: Array<{ id: string }> };
        technology: { nodes: Array<{ id: string }> };
        experiment: { observation: { classification?: string }; discrepancy: { criterionOutcome: string; failureState: string }; canonicalTruthBoundary: { readinessUpdate: string } };
        humanRelevance: { categories: Array<{ category: string; status: string }> };
        model: { fidelityLevel: string; calibrationStatus: string };
        evidenceStatus: { deploymentReadiness: string; professionalDisposition: string };
      };
      expect(projection.boundary.challenge.id).toBe('challenge.solar-deployment.synthetic');
      expect(projection.systemMap.elements.map((item) => item.id)).toEqual([
        'solar-panel', 'retraction-mechanism', 'storm-controller',
      ]);
      expect(projection.math.equations.map((item) => item.id)).toEqual([
        'solar.power', 'solar.bend-margin', 'solar.stow-margin',
      ]);
      expect(projection.math.quantities).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'solar.instantaneous-power', value: expect.any(Number) }),
        expect.objectContaining({ id: 'solar.stow-margin', value: 6 }),
      ]));
      expect(projection.math.quantities.find((item) => item.id === 'solar.bend-margin')?.value).toBeCloseTo(0.025, 8);
      expect(projection.science.treatment).toBe('physical-domain');
      expect(projection.engineeringDecision.tradeoff).toEqual({
        status: 'conflict', decision: 'no-universal-winner',
        explanation: expect.any(String),
      });
      expect(projection.engineeringDecision.hazards).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'hazard.solar.modeled-safety-misinterpretation' }),
      ]));
      expect(projection.technology.nodes).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'technology.solar.solver' }),
      ]));
      expect(projection.experiment).toMatchObject({
        observation: { classification: 'synthetic' },
        discrepancy: { criterionOutcome: 'fail', failureState: 'negative-result' },
        canonicalTruthBoundary: { readinessUpdate: 'not-applied' },
      });
      expect(projection.humanRelevance.categories.find((item) => item.category === 'energy')).toMatchObject({ status: 'supported' });
      expect(projection.model).toMatchObject({ fidelityLevel: 'analytical', calibrationStatus: 'not-calibrated' });
      expect(projection.evidenceStatus).toMatchObject({ deploymentReadiness: 'concept-only', professionalDisposition: 'not-assessed' });
    });
  });

  it('rejects an undeclared parameter change before evaluation', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/phase1a/parameter-change`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ baseline: { id: 'submission.sandbox-001.reference', revision: '1.0.0' }, parameterId: 'parameter.not-allowed', value: 1 }),
      });
      expect(response.status).toBe(422);
      await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/not allowed/i) });
    });
  });

  it('changes learning inclusion without changing the canonical evaluation identity', async () => {
    await withServer(async (baseUrl) => {
      const explore = await fetch(`${baseUrl}/api/phase1a/stem-system?learningDepth=explore`).then((response) => response.json()) as {
        learningProjection: { selectedManifest: { includedSections: string[] }; canonicalIdentity: unknown };
        howWeKnow: { consequentialResult: unknown; materialIdentity: unknown };
      };
      const verify = await fetch(`${baseUrl}/api/phase1a/stem-system?learningDepth=verify`).then((response) => response.json()) as typeof explore;
      expect(explore.learningProjection.selectedManifest.includedSections).toEqual(['system-map', 'human-relevance']);
      expect(verify.learningProjection.selectedManifest.includedSections).toContain('how-we-know');
      expect(verify.learningProjection.canonicalIdentity).toEqual(explore.learningProjection.canonicalIdentity);
      expect(verify.howWeKnow.consequentialResult).toEqual(explore.howWeKnow.consequentialResult);
      expect(verify.howWeKnow.materialIdentity).toEqual(explore.howWeKnow.materialIdentity);
    });
  });

  it('rejects an unknown learning depth', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/phase1a/stem-system?learningDepth=expert`);
      expect(response.status).toBe(422);
      await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/unknown STEM learning depth/i) });
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
      technologyDefinition: createSandboxStemTechnologyDefinition(),
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
      technologyDefinition: createSandboxStemTechnologyDefinition(),
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
      technologyDefinition: createSandboxStemTechnologyDefinition(),
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
      technologyDefinition: createSandboxStemTechnologyDefinition(),
    });
    expect(projection.engineeringDecision.hardGates[0]).toMatchObject({
      candidate: { actual: 'failed', passed: false },
      changed: true,
    });
    expect(projection.engineeringDecision.unresolvedProofObligations.candidate.length).toBeGreaterThan(0);
  });

  it('preserves failed evaluations and contradictions without changing readiness', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const referenceEvaluation = structuredClone(workspace.evaluations[0]!);
    referenceEvaluation.evaluation.status = 'failed';
    referenceEvaluation.contradictions = [referenceEvaluation.evidence[0]!];
    const projection = buildStemSystemProjection({
      challenge: workspace.challenge.record,
      scenario: workspace.challenge.scenario,
      model: workspace.challenge.model,
      workflow: workspace.challenge.workflow,
      requirements: workspace.challenge.requirements,
      constraints: workspace.challenge.constraints,
      systemElements: workspace.challenge.systemElements,
      interfaces: workspace.challenge.interfaces,
      referenceEvaluation,
      candidateEvaluation: workspace.evaluations[1]!,
      comparison: workspace.comparison,
      mathDefinition: createSandboxStemMathDefinition(),
      scienceDefinition: createSandboxStemScienceDefinition(),
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      technologyDefinition: createSandboxStemTechnologyDefinition(),
    });
    expect(projection.experiment.canonicalTruthBoundary).toMatchObject({
      evaluationStatus: 'failed',
      contradictionIds: [`${referenceEvaluation.evidence[0]!.id}@${referenceEvaluation.evidence[0]!.revision}`],
      preservedFailureState: 'preserved',
      evidenceReadinessBefore: referenceEvaluation.claim.evidenceReadiness,
      evidenceReadinessAfter: referenceEvaluation.claim.evidenceReadiness,
      readinessUpdate: 'not-applied',
    });
  });

  it('preserves a missing referenced evidence record as an explicit broken trace link', async () => {
    const workspace = await new Phase1aService().getWorkspace();
    const referenceEvaluation = structuredClone(workspace.evaluations[0]!);
    referenceEvaluation.claim.proofObligations[0]!.evidenceRefs.push({
      kind: 'Evidence', id: 'evidence.missing', revision: '1.0.0',
    });
    const projection = buildStemSystemProjection({
      challenge: workspace.challenge.record,
      scenario: workspace.challenge.scenario,
      model: workspace.challenge.model,
      workflow: workspace.challenge.workflow,
      requirements: workspace.challenge.requirements,
      constraints: workspace.challenge.constraints,
      systemElements: workspace.challenge.systemElements,
      interfaces: workspace.challenge.interfaces,
      referenceEvaluation,
      candidateEvaluation: workspace.evaluations[1]!,
      comparison: workspace.comparison,
      mathDefinition: createSandboxStemMathDefinition(),
      scienceDefinition: createSandboxStemScienceDefinition(),
      engineeringDefinition: createSandboxStemEngineeringDefinition(),
      technologyDefinition: createSandboxStemTechnologyDefinition(),
    });
    expect(projection.howWeKnow.nodes).toContainEqual(expect.objectContaining({
      id: 'trace.evidence.evidence.missing@1.0.0', status: 'broken',
    }));
    expect(projection.howWeKnow.edges).toContainEqual(expect.objectContaining({
      to: 'trace.evidence.evidence.missing@1.0.0', status: 'broken', relationship: 'satisfied-by',
    }));
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
