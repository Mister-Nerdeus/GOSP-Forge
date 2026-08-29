import { HazardSchema, StemEngineeringDefinitionSchema } from '@gosp/contracts';

export function createCleanWaterStemEngineeringDefinition(challengeRevision = '1.0.0') {
  const challengeRef = {
    kind: 'Challenge' as const,
    id: 'challenge.clean-water-local-demo',
    revision: challengeRevision,
  };
  return StemEngineeringDefinitionSchema.parse({
    designVariables: [
      {
        id: 'clean-water.design.filter-efficiency',
        quantityId: 'clean-water.filter-efficiency',
        inputPath: 'submission.materialPayload.compiledInput.water.filterEfficiency',
        changePolicy: 'allowed-for-comparison',
        rationale: 'The local comparison intentionally varies this synthetic model input.',
      },
    ],
    objectives: [
      {
        id: 'objective.clean-water.output-volume',
        statement: 'Increase calculated clean-water volume within the fixed screening boundary.',
        rule: {
          kind: 'numeric-result',
          resultPath: 'result.flow.cleanWaterLiters',
          direction: 'maximize',
        },
      },
      {
        id: 'objective.clean-water.preserve-unsupported-assumption',
        statement: 'Avoid changing the unsupported filter-efficiency assumption without new evidence.',
        rule: {
          kind: 'preserve-input',
          inputPath: 'submission.materialPayload.compiledInput.water.filterEfficiency',
        },
      },
    ],
    hazards: [
      HazardSchema.parse({
        kind: 'Hazard',
        id: 'hazard.clean-water.potability-misinterpretation',
        revision: challengeRevision,
        provenance: { sources: [], method: 'authored', notes: ['Educational truth-boundary hazard.'] },
        relationships: [{ type: 'applies-to', target: challengeRef }],
        description: 'Calculated output volume could be misrepresented as potable-water or treatment-efficacy evidence.',
        severity: 'serious',
        likelihood: 'possible',
        status: 'mitigating',
        mitigationRefs: [],
      }),
      HazardSchema.parse({
        kind: 'Hazard',
        id: 'hazard.clean-water.electrical-wet-environment',
        revision: challengeRevision,
        provenance: { sources: [], method: 'authored', notes: ['Conceptual educational hazard; no professional assessment.'] },
        relationships: [{ type: 'applies-to', target: challengeRef }],
        description: 'A powered device used near water presents an electrical wet-environment hazard requiring competent physical review.',
        severity: 'serious',
        likelihood: 'unknown',
        status: 'identified',
        mitigationRefs: [],
      }),
    ],
    disclosures: [
      'Objective preferences are reported separately; no composite score determines a universal winner.',
      'Passing modeled gates is not safety approval, deployment readiness, certification, or professional review.',
      'Hazard identification is not a completed risk assessment or mitigation verification.',
    ],
  });
}
