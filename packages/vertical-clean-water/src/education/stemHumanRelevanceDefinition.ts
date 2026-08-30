import { StemHumanRelevanceDefinitionSchema } from '@gosp/contracts';

const categories = ['cost','safety','energy','water','reliability','accessibility','maintenance','labor-skills','materials-waste','environment','infrastructure-community'] as const;

export function createCleanWaterStemHumanRelevanceDefinition() {
  return StemHumanRelevanceDefinitionSchema.parse({
    declarations: categories.map((category) => category === 'water'
      ? { category, status: 'supported', quantityIds: ['clean-water.clean-water-liters'], interpretations: ['benefit', 'tradeoff', 'uncertainty'] }
      : { category, status: 'unknown', quantityIds: [], interpretations: [], unknownReason: `No canonical ${category.replaceAll('-', '/')} quantity and supporting evidence are declared for this teaching evaluation.` }),
    stakeholderValues: [
      { stakeholder: 'learner', value: 'Understand modeled water output, assumptions, and uncertainty before treating it as real-world performance.', status: 'authored-preference' },
      { stakeholder: 'reviewer', value: 'Preserve negative results and require physical evidence before stronger claims.', status: 'authored-preference' },
    ],
    nonClaims: ['This projection is not policy advice.','This projection is not a lifecycle assessment.','This projection is not environmental certification.','This projection is not an economic forecast.','This projection is not proof of social benefit.'],
  });
}
