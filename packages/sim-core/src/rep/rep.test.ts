import { describe, expect, it } from 'vitest';
import { RepExecutionEvidenceSchema, RepMaterialInputSchema } from '@gosp/contracts';
import { canonicalJson } from '../hash/canonicalJson.js';
import { sha256 } from '../hash/sha256.js';
import { createSandbox001MaterialInput, createSandbox001ReplayRecord } from './sandbox001Fixture.js';
import { replayRep } from './replay.js';
import { runSandbox001 } from './sandbox001.js';
import { compareRepEnvironmentReports } from './reproducibilityComparison.js';
import { createSandboxStemMathDefinition } from '../education/stemMathDefinition.js';
import { createSandboxStemScienceDefinition } from '../education/stemScienceDefinition.js';
import { createSandboxStemEngineeringDefinition } from '../education/stemEngineeringDefinition.js';
import { createSandboxStemTechnologyDefinition } from '../education/stemTechnologyDefinition.js';
import {
  referenceRunnerSourceManifest,
  sourceImplementationContentHash,
} from './sourceImplementationIdentity.js';

describe('REP v0.1 reference runner', () => {
  it('keeps Sandbox technology limited to the declared synthetic solver', () => {
    const definition = createSandboxStemTechnologyDefinition();
    expect(definition.nodes).toHaveLength(1);
    expect(definition.nodes[0]).toMatchObject({ category: 'solver', productProvenanceStatus: 'not-applicable' });
  });

  it('declares the Sandbox math path as a unitless protocol benchmark', () => {
    const definition = createSandboxStemMathDefinition();
    expect(definition.equations[0]).toMatchObject({
      equationId: 'sandbox-001.weighted-sum',
      outputQuantityId: 'sandbox.result',
      dimensionalStatus: 'not-applicable',
    });
  });

  it('keeps Sandbox science treatment explicitly synthetic and non-physical', () => {
    const definition = createSandboxStemScienceDefinition();
    expect(definition.treatment).toBe('synthetic-benchmark');
    expect(definition.disclosures.join(' ')).toMatch(
      /no natural governing principle.*physical observation/i,
    );
  });

  it('keeps Sandbox engineering objectives and hazards inside the benchmark boundary', () => {
    const definition = createSandboxStemEngineeringDefinition();
    expect(definition.objectives).toHaveLength(1);
    expect(definition.hazards[0]?.description).toMatch(/synthetic benchmark result/i);
  });
  it('uses Unicode code-point ordering and rejects non-JSON values', () => {
    expect(canonicalJson({ '\u{1F600}': 2, '\uE000': 1 })).toBe('{"":1,"😀":2}');
    expect(canonicalJson({ b: 1, a: 2 })).toBe(canonicalJson({ a: 2, b: 1 }));
    expect(() => canonicalJson({ invalid: undefined })).toThrow(/rejects values/);
    expect(() => canonicalJson({ invalid: Number.NaN })).toThrow(/non-finite/);
    expect(() => canonicalJson(new Date())).toThrow(/plain objects/);
    const sparse: number[] = [];
    sparse[1] = 7;
    expect(() => canonicalJson(sparse)).toThrow(/sparse arrays/);
  });

  it('rejects contradictory canonical refs and contextually wrong identity kinds', () => {
    const contradictory = createSandbox001MaterialInput();
    contradictory.submission.challengeRef.id = 'challenge.different';
    expect(RepMaterialInputSchema.safeParse(contradictory).success).toBe(false);

    const baseline = createSandbox001MaterialInput();
    const wrongIdentityKind = {
      ...baseline,
      contractIdentities: baseline.contractIdentities.map((identity, index) =>
        index === 0 ? { ...identity, kind: 'dataset' } : identity,
      ),
    };
    expect(RepMaterialInputSchema.safeParse(wrongIdentityKind).success).toBe(false);
  });

  it('evaluates and explicitly replays sandbox-001', () => {
    const record = createSandbox001ReplayRecord();
    const first = runSandbox001(record.materialInput);
    const replay = replayRep(record);

    expect(first.evaluation.result).toEqual({ value: 53, terms: [2, 6, 15], weightedSum: 23 });
    expect(replay).toMatchObject({ ok: true, inputHashMatches: true, resultHashMatches: true });
    expect(replay.materialResultHash).toBe(first.materialResultHash);
  });

  it('includes every declared material boundary in the input hash', () => {
    const baseline = createSandbox001MaterialInput();
    const baselineHash = sha256(canonicalJson(baseline));
    const variants = [
      { ...baseline, challenge: { ...baseline.challenge, revision: '1.0.1' } },
      {
        ...baseline,
        submission: { ...baseline.submission, materialPayload: { values: [9], weights: [2], offset: 1 } },
      },
      {
        ...baseline,
        compiledScenario: { ...baseline.compiledScenario, parameters: { scale: 3 } },
      },
      { ...baseline, componentData: [{ ...baseline.contractIdentities[0]!, kind: 'component-data' as const }] },
      { ...baseline, model: { ...baseline.model, revision: '1.0.1' } },
      { ...baseline, runner: { ...baseline.runner, revision: '1.0.1' } },
      { ...baseline, contractIdentities: [{ ...baseline.contractIdentities[0]!, revision: '1.0.1' }] },
      { ...baseline, datasetIdentities: [{ ...baseline.contractIdentities[0]!, kind: 'dataset' as const }] },
      {
        ...baseline,
        materialAssumptions: [{ id: 'assumption.changed', statement: 'Changed.', material: true }],
      },
      { ...baseline, materialParameters: { benchmark: 'weighted-sum-v2' } },
    ];

    expect(variants.every((variant) => sha256(canonicalJson(variant)) !== baselineHash)).toBe(true);
  });

  it('keeps execution-only metadata outside the material hash', () => {
    const evaluated = runSandbox001(createSandbox001MaterialInput());
    const evidenceA = RepExecutionEvidenceSchema.parse({
      kind: 'RepExecutionEvidence',
      evidenceVersion: '0.1.0',
      executionId: 'windows-a',
      materialInputHash: evaluated.materialInputHash,
      materialResultHash: evaluated.materialResultHash,
      startedAt: '2026-08-07T12:00:00-04:00',
      completedAt: '2026-08-07T12:00:01-04:00',
      command: ['pnpm', 'rep:replay'],
      environment: {
        os: 'windows',
        architecture: 'x64',
        runtime: 'node-22',
        hostname: 'machine-a',
        username: 'user-a',
        locale: 'en-US',
        timezone: 'America/New_York',
        processId: 100,
        workingDirectory: 'C:/one',
      },
      exitStatus: 0,
    });
    const evidenceB = RepExecutionEvidenceSchema.parse({
      ...evidenceA,
      executionId: 'linux-b',
      startedAt: '2026-08-08T00:00:00+00:00',
      completedAt: '2026-08-08T00:00:02+00:00',
      environment: {
        os: 'linux',
        architecture: 'arm64',
        runtime: 'node-24',
        hostname: 'machine-b',
        username: 'user-b',
        locale: 'fr-FR',
        timezone: 'UTC',
        processId: 999,
        workingDirectory: '/different/path',
      },
    });

    expect(evidenceA.environment).not.toEqual(evidenceB.environment);
    expect(evidenceA.materialResultHash).toBe(evidenceB.materialResultHash);
    expect(evidenceA.materialResultHash).toBe(evaluated.materialResultHash);
  });

  it('reports a recorded hash mismatch instead of masking it', () => {
    const record = createSandbox001ReplayRecord();
    const replay = replayRep({ ...record, expectedMaterialResultHash: '0'.repeat(64) });
    expect(replay).toMatchObject({ ok: false, inputHashMatches: true, resultHashMatches: false });
  });

  it('requires genuinely distinct environments for a cross-environment conclusion', () => {
    const windows = {
      environmentId: 'windows-node22',
      recordPath: 'examples/rep/sandbox-001.replay.json',
      expectedMaterialInputHash: 'a'.repeat(64),
      expectedMaterialResultHash: 'b'.repeat(64),
      materialInputHash: 'a'.repeat(64),
      materialResultHash: 'b'.repeat(64),
      inputHashMatches: true,
      resultHashMatches: true,
      environment: {
        os: 'win32 10',
        architecture: 'x64',
        runtime: 'v22.16.0',
        locale: 'en-US',
        timezone: 'America/New_York',
        workingDirectory: 'C:/workspace',
      },
    };
    const linux = {
      ...windows,
      environmentId: 'linux-node24',
      environment: {
        ...windows.environment,
        os: 'linux 6',
        runtime: 'v24.19.0',
        timezone: 'UTC',
        workingDirectory: '/workspace',
      },
    };
    const relocatedWindows = {
      ...windows,
      environmentId: 'windows-node22-relocated',
      environment: {
        ...windows.environment,
        workingDirectory: 'D:/workspace',
      },
    };

    expect(compareRepEnvironmentReports(windows, windows).reproducible).toBe(false);
    expect(compareRepEnvironmentReports(windows, relocatedWindows).reproducible).toBe(false);
    expect(compareRepEnvironmentReports(windows, linux).reproducible).toBe(true);
  });

  it('binds implementation identity to normalized source content without host metadata', () => {
    const base = {
      id: 'runner.example',
      revision: '1.0.0',
      files: [{ path: 'src/runner.ts', content: 'export const value = 1;\r\n' }],
      toolchain: { typescript: '5.9.3' },
      runtimeDependencies: { zod: '3.25.76' },
    };
    expect(sourceImplementationContentHash(base)).toBe(
      sourceImplementationContentHash({
        ...base,
        files: [{ path: 'src/runner.ts', content: 'export const value = 1;\n' }],
      }),
    );
    expect(sourceImplementationContentHash(base)).not.toBe(
      sourceImplementationContentHash({
        ...base,
        files: [{ path: 'src/runner.ts', content: 'export const value = 2;\n' }],
      }),
    );
    expect(() =>
      sourceImplementationContentHash({
        ...base,
        files: [{ path: '../outside.ts', content: 'export const value = 1;\n' }],
      }),
    ).toThrow(/repository-relative/);
    expect(() =>
      sourceImplementationContentHash({
        ...base,
        files: [base.files[0], base.files[0]],
      }),
    ).toThrow(/Duplicate/);

    const manifestText = JSON.stringify(referenceRunnerSourceManifest());
    expect(manifestText).not.toContain(process.cwd());
    expect(manifestText).not.toMatch(/startedAt|completedAt|timestamp/i);
  });
});
