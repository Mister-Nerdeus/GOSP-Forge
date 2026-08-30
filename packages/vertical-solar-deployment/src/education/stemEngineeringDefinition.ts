import { HazardSchema, StemEngineeringDefinitionSchema } from '@gosp/contracts';

export function createSolarDeploymentStemEngineeringDefinition(challengeRevision = '0.1.0') {
  const challengeRef = { kind: 'Challenge' as const, id: 'challenge.solar-deployment.synthetic', revision: challengeRevision };
  const provenance = { sources: [], method: 'authored' as const, notes: ['Synthetic readiness-gate hazard; no professional assessment.'] };
  return StemEngineeringDefinitionSchema.parse({
    designVariables: [
      { id: 'solar.design.deployed-fraction', quantityId: 'solar.deployed-fraction', inputPath: 'submission.materialPayload.deployment.deployedFraction', changePolicy: 'allowed-for-comparison', rationale: 'Varies modeled exposed area inside the controlled Scenario.' },
      { id: 'solar.design.stow-time', quantityId: 'solar.stow-time', inputPath: 'submission.materialPayload.deployment.stowTimeSeconds', changePolicy: 'allowed-for-comparison', rationale: 'Varies modeled response time inside the controlled Scenario.' },
      { id: 'solar.design.core-radius', quantityId: 'solar.core-radius', inputPath: 'submission.materialPayload.deployment.coreRadiusM', changePolicy: 'allowed-for-comparison', rationale: 'Varies the candidate geometry checked against the controlled minimum radius.' },
    ],
    objectives: [
      { id: 'objective.solar.modeled-power', statement: 'Increase modeled instantaneous power under the controlled synthetic conditions.', rule: { kind: 'numeric-result', resultPath: 'result.power.instantaneousPowerW', direction: 'maximize' } },
      { id: 'objective.solar.stow-margin', statement: 'Increase modeled storm-stow timing margin.', rule: { kind: 'numeric-result', resultPath: 'result.storm.stowTimeMarginSeconds', direction: 'maximize' } },
      { id: 'objective.solar.bend-margin', statement: 'Increase modeled bend-radius margin.', rule: { kind: 'numeric-result', resultPath: 'result.deployment.bendRadiusMarginM', direction: 'maximize' } },
    ],
    hazards: [
      HazardSchema.parse({ kind: 'Hazard', id: 'hazard.solar.modeled-safety-misinterpretation', revision: challengeRevision, provenance, relationships: [{ type: 'applies-to', target: challengeRef }], description: 'Positive modeled margins could be misrepresented as structural, electrical, weather, or deployment safety evidence.', severity: 'serious', likelihood: 'possible', status: 'mitigating', mitigationRefs: [] }),
      HazardSchema.parse({ kind: 'Hazard', id: 'hazard.solar.moving-electrical-system', revision: challengeRevision, provenance, relationships: [{ type: 'applies-to', target: challengeRef }], description: 'A physical moving photovoltaic assembly would require competent mechanical, electrical, fire, and weather review.', severity: 'serious', likelihood: 'unknown', status: 'identified', mitigationRefs: [] }),
    ],
    disclosures: [
      'Conflicting objective outcomes do not produce a universal winner or composite score.',
      'Modeled margins are not safety approval, deployment readiness, certification, or professional review.',
      'This gate validates software contract reuse, not a physical design or competition specification.',
    ],
  });
}
