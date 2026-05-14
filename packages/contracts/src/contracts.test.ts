import { describe, expect, it } from 'vitest';
import {
  CostEstimateSchema,
  CostEstimateEnvelopeSchema,
  ImpactReportSchema,
  ResourceFlowGraphSchema,
  FabricationProfileSchema,
  ModulePackageSchema,
  ProblemDefinitionSchema,
  ProductBindingSchema,
  ProjectManifestV2Schema,
  ScoringProfileSchema,
  SimulationRunEnvelopeSchema,
  validateModeRequirements,
} from './index.js';

const confidence = { level: 'medium' as const, rationale: 'foundation fixture' };
const attribution = { creators: [{ name: 'GOSP Forge' }], sourceRefs: [] };
const license = { id: 'CC-BY-4.0' as const, shareAlike: false };
const safetyProfile = {
  category: 'not-for-real-world-use' as const,
  notes: ['Classroom demonstration only.'],
  realWorldUseLimit: 'No potable-water or professional-use claim.',
};
const productSpec = {
  id: 'flow-rate',
  name: 'Flow rate',
  value: 2,
  unit: 'L/min',
  meaning: {
    affects: ['simulation'],
    explanation: 'Maps to output flow.',
    targetField: 'flowRateLpm',
  },
  simulationUse: 'Water flow cap',
};
const lifecycle = {
  horizonYears: 1,
  operatingCost: 0,
  maintenanceCost: 0,
  replacementReserve: 0,
  total: 0,
  confidence,
  assumptions: ['Foundation classroom example.'],
};

describe('foundation contracts', () => {
  it('validates a problem definition and rejects missing metrics or scoring baselines', () => {
    expect(
      ProblemDefinitionSchema.safeParse({
        kind: 'ProblemDefinition',
        id: 'p',
        version: '1',
        title: 'P',
        summary: 'S',
        metrics: [{ id: 'm', name: 'M', unit: 'L', direction: 'maximize' }],
      }).success,
    ).toBe(true);

    expect(
      ProblemDefinitionSchema.safeParse({
        kind: 'ProblemDefinition',
        id: 'p',
        version: '1',
        title: 'P',
        summary: 'S',
        metrics: [],
      }).success,
    ).toBe(false);

    expect(
      ProblemDefinitionSchema.safeParse({
        kind: 'ProblemDefinition',
        id: 'p',
        version: '1',
        title: 'P',
        summary: 'S',
        mode: 'scoring',
        metrics: [{ id: 'm', name: 'M', unit: 'L', direction: 'maximize' }],
      }).success,
    ).toBe(false);
  });

  it('allows incomplete dream projects but blocks scoring projects without problem refs', () => {
    expect(
      ProjectManifestV2Schema.safeParse({
        kind: 'ProjectManifestV2',
        manifestVersion: '2',
        id: 'proj',
        version: '1',
        title: 'Dream',
        mode: 'dream',
        design: { title: 'D', status: 'incomplete' },
      }).success,
    ).toBe(true);

    expect(
      ProjectManifestV2Schema.safeParse({
        kind: 'ProjectManifestV2',
        manifestVersion: '2',
        id: 'proj',
        version: '1',
        title: 'Score',
        mode: 'scoring',
        design: { title: 'D', status: 'draft' },
      }).success,
    ).toBe(false);
  });

  it('validates modules and blocks physical modules without safety profiles', () => {
    expect(
      ModulePackageSchema.safeParse({
        kind: 'ModulePackage',
        id: 'logic',
        version: '1',
        name: 'Logic',
        type: 'logical',
        attribution,
        license,
        capabilities: { capabilities: ['control'] },
        validationStatus: 'draft',
      }).success,
    ).toBe(true);

    expect(
      ModulePackageSchema.safeParse({
        kind: 'ModulePackage',
        id: 'pump',
        version: '1',
        name: 'Pump',
        type: 'physical',
        attribution,
        license,
        capabilities: { capabilities: ['flow'] },
        validationStatus: 'draft',
      }).success,
    ).toBe(false);
  });

  it('validates product bindings and requires sponsor disclosure', () => {
    expect(
      ProductBindingSchema.safeParse({
        kind: 'ProductBinding',
        id: 'prod',
        version: '1',
        name: 'Pump',
        moduleIds: ['pump'],
        specs: [productSpec],
        provenance: { status: 'community-submitted', sourceRefs: [] },
        sponsored: false,
        confidence,
      }).success,
    ).toBe(true);

    expect(
      ProductBindingSchema.safeParse({
        kind: 'ProductBinding',
        id: 'prod',
        version: '1',
        name: 'Pump',
        moduleIds: ['pump'],
        specs: [productSpec],
        provenance: { status: 'community-submitted', sourceRefs: [] },
        sponsored: true,
        confidence,
      }).success,
    ).toBe(false);
  });

  it('validates simulation envelopes and rejects missing limitations', () => {
    const envelope = {
      kind: 'SimulationRunEnvelope',
      runId: 'r',
      projectId: 'p',
      moduleIds: ['m'],
      inputHash: 'a'.repeat(64),
      outputHash: 'b'.repeat(64),
      modelVersion: '0',
      fidelityLevel: 'level-1-screening',
      assumptions: [{ id: 'a', description: 'A' }],
      units: { flow: 'L/min' },
      confidence,
      limitations: [{ id: 'l', description: 'No potable water claim.' }],
      impacts: {
        kind: 'CleanWaterImpactReport',
        direct: [
          {
            id: 'direct-pump-flow',
            metric: 'cleanWaterLiters',
            value: 8,
            unit: 'L',
            interpretation: 'Classroom comparison only.',
          },
        ],
        downstream: [
          {
            id: 'downstream-power-runtime',
            affectedArea: 'power-runtime',
            interpretation: 'Educational downstream effect.',
          },
        ],
        limitations: ['No potable-water certification or professional engineering claim.'],
      },
    };

    expect(SimulationRunEnvelopeSchema.safeParse(envelope).success).toBe(true);
    expect(ImpactReportSchema.safeParse(envelope.impacts).success).toBe(true);
    expect(SimulationRunEnvelopeSchema.safeParse({ ...envelope, limitations: [] }).success).toBe(
      false,
    );
  });

  it('validates cost estimates and rejects missing confidence', () => {
    const estimate = {
        id: 'e',
        projectId: 'p',
        lines: [
          {
            id: 'line',
            kind: 'product',
            description: 'Classroom part',
            quantity: 1,
            unitCost: 1,
            currency: 'USD',
            confidence,
          },
        ],
        lifecycle,
        contingency: 0,
        total: 1,
        confidence,
        assumptions: ['Foundation classroom example.'],
      };

    expect(CostEstimateSchema.safeParse(estimate).success).toBe(true);
    expect(
      CostEstimateEnvelopeSchema.safeParse({
        kind: 'CostEstimateEnvelope',
        estimateClass: 'educational-concept',
        estimate,
        confidence,
        assumptions: estimate.assumptions,
        sourceRefs: [],
        warnings: [],
        limitations: [{ id: 'not-professional-estimate', description: 'Educational only.' }],
      }).success,
    ).toBe(true);

    expect(
      CostEstimateSchema.safeParse({
        id: 'e',
        projectId: 'p',
        lines: [],
        lifecycle,
        contingency: 0,
        total: 0,
        assumptions: ['Foundation classroom example.'],
      }).success,
    ).toBe(false);
  });

  it('validates fabrication profiles and rejects missing safety notes', () => {
    const profile = {
      materials: [{ id: 'pla', name: 'PLA filament', unit: 'g', quantity: 100 }],
      routes: [{ process: 'fdm-print', machineTimeMinutes: 60, laborMinutes: 15 }],
      labor: { setupMinutes: 10, assemblyMinutes: 20, inspectionMinutes: 10 },
      safetyNotes: ['Supervised classroom fabrication only.'],
    };

    expect(FabricationProfileSchema.safeParse(profile).success).toBe(true);
    expect(FabricationProfileSchema.safeParse({ ...profile, safetyNotes: [] }).success).toBe(false);
  });

  it('blocks sponsor scoring influence and applies mode requirements', () => {
    expect(
      ScoringProfileSchema.safeParse({
        id: 's',
        version: '1',
        sponsorNeutral: true,
        components: [{ id: 'sponsor-boost', label: 'Sponsor', weight: 1, formula: '1' }],
      }).success,
    ).toBe(false);

    expect(
      validateModeRequirements('dream', {}).some((issue) => issue.severity === 'warning'),
    ).toBe(true);
    expect(
      validateModeRequirements('scoring', {}).some((issue) => issue.severity === 'blocker'),
    ).toBe(true);
  });

  it('requires fabricated modules to include fabrication profiles', () => {
    expect(
      ModulePackageSchema.safeParse({
        kind: 'ModulePackage',
        id: 'housing',
        version: '1',
        name: 'Housing',
        type: 'physical',
        attribution,
        license,
        capabilities: { capabilities: ['housing'], requiresFabrication: true },
        validationStatus: 'draft',
        safetyProfile,
      }).success,
    ).toBe(false);
  });

  it('validates graph topology and rejects missing edge endpoints', () => {
    expect(
      ResourceFlowGraphSchema.safeParse({
        kind: 'ResourceFlowGraph',
        id: 'water-graph',
        projectId: 'project',
        resourceType: 'water',
        nodes: [{ id: 'source' }, { id: 'sink' }],
        edges: [{ id: 'source-to-sink', from: 'source', to: 'sink' }],
      }).success,
    ).toBe(true);

    expect(
      ResourceFlowGraphSchema.safeParse({
        kind: 'ResourceFlowGraph',
        id: 'water-graph',
        projectId: 'project',
        resourceType: 'water',
        nodes: [{ id: 'source' }, { id: 'source' }],
        edges: [{ id: 'missing-to', from: 'source', to: 'sink' }],
      }).success,
    ).toBe(false);
  });
});
