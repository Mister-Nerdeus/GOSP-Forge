import { describe, expect, it } from 'vitest';
import { StemHowWeKnowTraceSchema } from './stemHowWeKnowTrace.js';

const hash = 'a'.repeat(64);
const base = {
  consequentialResult: { resultPath: 'result.value', value: 1, quantityId: 'quantity.result', claimId: 'claim.result' },
  modelEvidenceLadder: {
    modelRepresentation: { modelId: 'model.test', fidelityLevel: 'analytical', calibrationStatus: 'not-applicable' },
    evidenceStrength: { evidenceReadiness: 'computationally-reproduced', acceptedEvidenceCount: 1, contradictionCount: 0 },
    deploymentReadiness: 'concept-only', professionalDisposition: 'not-assessed',
    independenceDisclosure: 'Local replay is not independent reproduction.',
  },
  materialIdentity: { inputHash: hash, resultHash: hash, contractIdentities: [], datasetIdentities: [] },
  executionIdentity: {
    runner: { id: 'runner.test', revision: '1.0.0', contentHash: hash },
    solver: { id: 'solver.test', revision: '1.0.0', contentHash: hash },
    environment: { os: 'test', runtime: 'test' }, replayStatus: 'verified-local-replay' as const,
  },
  nodes: [
    { id: 'result', category: 'result' as const, label: 'Result', status: 'resolved' as const, detail: 'Recorded result.' },
    { id: 'missing', category: 'evidence' as const, label: 'Missing evidence', status: 'broken' as const, detail: 'Referenced evidence is absent.' },
  ],
  edges: [{ from: 'result', to: 'missing', relationship: 'requires', status: 'broken' as const }],
  disclosures: ['Higher fidelity is not stronger evidence.'],
};

describe('StemHowWeKnowTraceSchema', () => {
  it('accepts explicit broken links', () => expect(StemHowWeKnowTraceSchema.parse(base).nodes).toHaveLength(2));
  it('rejects missing edge endpoints', () => expect(() => StemHowWeKnowTraceSchema.parse({ ...base, edges: [{ ...base.edges[0], to: 'absent' }] })).toThrow(/endpoints/));
  it('rejects a resolved edge to a broken node', () => expect(() => StemHowWeKnowTraceSchema.parse({ ...base, edges: [{ ...base.edges[0], status: 'resolved' }] })).toThrow(/broken node/));
});
