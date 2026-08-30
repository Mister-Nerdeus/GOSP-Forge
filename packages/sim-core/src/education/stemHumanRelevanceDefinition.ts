import { StemHumanRelevanceDefinitionSchema } from '@gosp/contracts';

const categories = ['cost','safety','energy','water','reliability','accessibility','maintenance','labor-skills','materials-waste','environment','infrastructure-community'] as const;

export function createSandboxStemHumanRelevanceDefinition() {
  return StemHumanRelevanceDefinitionSchema.parse({
    declarations: categories.map((category) => ({ category, status: 'unknown', quantityIds: [], interpretations: [], unknownReason: 'The deterministic protocol benchmark declares no real-world impact quantity or supporting evidence.' })),
    stakeholderValues: [{ stakeholder: 'learner', value: 'Use the benchmark to understand deterministic evaluation, not real-world impact.', status: 'authored-preference' }],
    nonClaims: ['This projection is not policy advice.','This projection is not a lifecycle assessment.','This projection is not environmental certification.','This projection is not an economic forecast.','This projection is not proof of social benefit.'],
  });
}
