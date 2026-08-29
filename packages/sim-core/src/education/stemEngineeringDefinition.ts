import { HazardSchema, StemEngineeringDefinitionSchema } from '@gosp/contracts';

export function createSandboxStemEngineeringDefinition() {
  const challengeRef = { kind: 'Challenge' as const, id: 'sandbox-001', revision: '1.0.0' };
  return StemEngineeringDefinitionSchema.parse({
    designVariables: [
      {
        id: 'sandbox.design.values',
        quantityId: 'sandbox.values',
        inputPath: 'submission.materialPayload.values',
        changePolicy: 'allowed-for-comparison',
        rationale: 'Submitted values may change between comparable sandbox revisions.',
      },
    ],
    objectives: [
      {
        id: 'objective.sandbox.result',
        statement: 'Increase the recorded sandbox result within fixed comparison boundaries.',
        rule: { kind: 'numeric-result', resultPath: 'result.value', direction: 'maximize' },
      },
    ],
    hazards: [HazardSchema.parse({
      kind: 'Hazard',
      id: 'hazard.sandbox.physical-misinterpretation',
      revision: '1.0.0',
      provenance: { sources: [], method: 'authored', notes: ['Educational truth-boundary hazard.'] },
      relationships: [{ type: 'applies-to', target: challengeRef }],
      description: 'A synthetic benchmark result could be misrepresented as evidence about a physical system.',
      severity: 'minor',
      likelihood: 'possible',
      status: 'mitigating',
      mitigationRefs: [],
    })],
    disclosures: [
      'The sandbox objective is a protocol demonstration, not a real-world optimization claim.',
      'Passing the modeled completion gate is not safety approval, deployment readiness, certification, or professional review.',
    ],
  });
}
