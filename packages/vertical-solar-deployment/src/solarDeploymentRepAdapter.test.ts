import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD,
  createSolarDeploymentStemEngineeringDefinition,
  createSolarDeploymentStemExperimentDefinition,
  createSolarDeploymentStemHumanRelevanceDefinition,
  createSolarDeploymentStemMathDefinition,
  createSolarDeploymentStemScienceDefinition,
  createSolarDeploymentStemSystemDefinition,
  createSolarDeploymentStemTechnologyDefinition,
  createSyntheticSolarDeploymentRepMaterialInput,
  evaluateSyntheticSolarDeploymentRep,
} from './index.js';

describe('retractable-solar validation adapter', () => {
  it('reuses every existing public STEM definition contract without a core extension', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput();
    const system = createSolarDeploymentStemSystemDefinition(input.challenge.revision);
    expect(system.systemElements).toHaveLength(3);
    expect(system.interfaces).toHaveLength(3);
    expect(createSolarDeploymentStemMathDefinition().equations.map((item) => item.equationId)).toEqual([
      'solar.power', 'solar.bend-margin', 'solar.stow-margin',
    ]);
    expect(createSolarDeploymentStemScienceDefinition().treatment).toBe('physical-domain');
    expect(createSolarDeploymentStemEngineeringDefinition().objectives).toHaveLength(3);
    expect(createSolarDeploymentStemTechnologyDefinition().nodes.length).toBeGreaterThanOrEqual(6);
    expect(createSolarDeploymentStemExperimentDefinition().observations[0]?.classification).toBe('synthetic');
    expect(createSolarDeploymentStemHumanRelevanceDefinition().declarations).toHaveLength(11);
  });

  it('evaluates deterministically and preserves modeled margins', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput();
    const first = evaluateSyntheticSolarDeploymentRep(input);
    const second = evaluateSyntheticSolarDeploymentRep(input);
    const result = first.evaluation.result as {
      power: { instantaneousPowerW: number };
      deployment: { bendRadiusMarginM: number };
      storm: { stowTimeMarginSeconds: number };
    };
    expect(first.materialInputHash).toBe(second.materialInputHash);
    expect(first.materialResultHash).toBe(second.materialResultHash);
    expect(result.power.instantaneousPowerW).toBeGreaterThan(0);
    expect(result.deployment.bendRadiusMarginM).toBeCloseTo(0.025, 8);
    expect(result.storm.stowTimeMarginSeconds).toBeCloseTo(6, 8);
  });

  it('preserves negative results and rejects controlled-boundary changes', () => {
    const negative = structuredClone(DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD);
    negative.deployment.coreRadiusM = 0.05;
    negative.deployment.stowTimeSeconds = 30;
    const result = evaluateSyntheticSolarDeploymentRep(
      createSyntheticSolarDeploymentRepMaterialInput(negative),
    ).evaluation.result as { deployment: { bendRadiusMarginM: number }; storm: { stowTimeMarginSeconds: number } };
    expect(result.deployment.bendRadiusMarginM).toBeLessThan(0);
    expect(result.storm.stowTimeMarginSeconds).toBeLessThan(0);

    const changed = createSyntheticSolarDeploymentRepMaterialInput();
    (changed.submission.materialPayload as typeof negative).environment.incidenceAngleDeg = 35;
    expect(() => evaluateSyntheticSolarDeploymentRep(changed)).toThrow(/controlled Scenario environment/i);
  });
});
