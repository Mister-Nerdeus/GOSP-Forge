import { StemScienceDefinitionSchema } from '@gosp/contracts';

export function createSolarDeploymentStemScienceDefinition() {
  return StemScienceDefinitionSchema.parse({
    treatment: 'physical-domain',
    items: [
      { id: 'solar.science.radiant-power', title: 'Radiant-power conversion context', classification: 'principle', statement: 'Photovoltaic power depends on incident radiant power and conversion behavior.', applicability: { status: 'applicable', description: 'Used only as context for the reduced-order synthetic power relationship.' }, limitations: ['No authoritative source or measured device curve is attached.'], sourceStatus: 'unavailable', evidenceStatus: 'model-only', sourceRefs: [], evidenceRefs: [], equationIds: ['solar.power'], quantityIds: ['solar.irradiance', 'solar.instantaneous-power'] },
      { id: 'solar.science.power-screen', title: 'Instantaneous power screen', classification: 'model-equation', statement: 'The model combines controlled rated power, irradiance, angle, temperature, soiling, and deployed fraction.', applicability: { status: 'applicable', description: 'Applicable only inside the recorded synthetic controlled Scenario.' }, limitations: ['No energy integration, inverter behavior, shading, wiring loss, or degradation is modeled.'], sourceStatus: 'model-declared', evidenceStatus: 'model-only', sourceRefs: [], evidenceRefs: [], equationIds: ['solar.power'], quantityIds: ['solar.rated-power', 'solar.irradiance', 'solar.deployed-fraction', 'solar.instantaneous-power'] },
      { id: 'solar.science.linear-wind-rise', title: 'Linear wind-rise approximation', classification: 'engineering-approximation', statement: 'Wind speed is assumed to rise linearly until the controlled hazard threshold.', applicability: { status: 'unknown', description: 'Adequacy for any real weather event is not established.' }, limitations: ['Real gusts and spatial loading are not represented.'], sourceStatus: 'assumption-declared', evidenceStatus: 'assumption-only', sourceRefs: [], evidenceRefs: [], equationIds: ['solar.stow-margin'], quantityIds: ['solar.wind-rise-rate', 'solar.stow-margin'] },
      { id: 'solar.science.minimum-radius', title: 'Minimum-radius input', classification: 'assumption', statement: 'The minimum bend radius is a synthetic controlled input, not a manufacturer specification.', applicability: { status: 'applicable', description: 'Applicable to the recorded screening arithmetic only.' }, limitations: ['It does not establish cyclic durability or material compatibility.'], sourceStatus: 'assumption-declared', evidenceStatus: 'assumption-only', sourceRefs: [], evidenceRefs: [], equationIds: ['solar.bend-margin'], quantityIds: ['solar.minimum-bend-radius', 'solar.bend-margin'] },
      { id: 'solar.science.physical-observation', title: 'Physical observation', classification: 'observation', statement: 'No physical solar, bend, wind, or stow observation is declared.', applicability: { status: 'not-declared', description: 'Only an authored synthetic teaching comparison is available.' }, limitations: ['Calculated output must not be described as measured performance.'], sourceStatus: 'not-declared', evidenceStatus: 'not-declared', sourceRefs: [], evidenceRefs: [], equationIds: [], quantityIds: ['solar.instantaneous-power'] },
    ],
    disclosures: [
      'Scientific context does not prove that this reduced-order model represents a physical device adequately.',
      'All values are synthetic; no manufacturer, laboratory, field, structural, electrical, or weather validation is claimed.',
    ],
  });
}
