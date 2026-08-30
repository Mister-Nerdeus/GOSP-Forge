import { StemHumanRelevanceDefinitionSchema } from '@gosp/contracts';

const categories = ['cost','safety','energy','water','reliability','accessibility','maintenance','labor-skills','materials-waste','environment','infrastructure-community'] as const;

export function createSolarDeploymentStemHumanRelevanceDefinition() {
  return StemHumanRelevanceDefinitionSchema.parse({
    declarations: categories.map((category) => category === 'energy'
      ? { category, status: 'supported', quantityIds: ['solar.instantaneous-power'], interpretations: ['benefit', 'tradeoff', 'uncertainty'] }
      : { category, status: 'unknown', quantityIds: [], interpretations: [], unknownReason: `No canonical ${category.replaceAll('-', '/')} quantity and supporting evidence are declared for this synthetic validation.` }),
    stakeholderValues: [
      { stakeholder: 'learner', value: 'Understand how one modeled design change affects power and stow margin without treating the result as physical performance.', status: 'authored-preference' },
      { stakeholder: 'reviewer', value: 'Require physical and professional evidence before safety, deployment, or societal claims.', status: 'authored-preference' },
    ],
    nonClaims: [
      'This projection is not policy advice.',
      'This projection is not a lifecycle assessment.',
      'This projection is not environmental certification.',
      'This projection is not an economic forecast.',
      'This projection is not proof of social benefit.',
    ],
  });
}
