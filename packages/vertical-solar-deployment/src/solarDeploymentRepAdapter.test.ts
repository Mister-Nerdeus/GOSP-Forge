import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD,
  createSyntheticSolarDeploymentRepMaterialInput,
  evaluateSyntheticSolarDeploymentRep,
} from './solarDeploymentRepAdapter.js';

const passingPayload = () => {
  const payload = structuredClone(DEFAULT_SYNTHETIC_SOLAR_DEPLOYMENT_PAYLOAD);
  payload.environment.modeledWindRiseRateMpsPerSecond = 0.75;
  return payload;
};

describe('synthetic retractable solar deployment REP evaluator', () => {
  it('produces deterministic explainable screening results', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput(passingPayload());
    const first = evaluateSyntheticSolarDeploymentRep(input);
    const second = evaluateSyntheticSolarDeploymentRep(input);
    const result = first.evaluation.result as {
      power: { instantaneousPowerW: number; cleaningRecoveredPowerW: number };
      deployment: { bendRadiusMarginM: number };
      storm: { stowTimeMarginSeconds: number };
    };

    expect(first.materialInputHash).toBe(second.materialInputHash);
    expect(first.materialResultHash).toBe(second.materialResultHash);
    expect(result.power.instantaneousPowerW).toBeGreaterThan(0);
    expect(result.power.cleaningRecoveredPowerW).toBeGreaterThan(0);
    expect(result.deployment.bendRadiusMarginM).toBeCloseTo(0.025, 8);
    expect(result.storm.stowTimeMarginSeconds).toBeCloseTo(6, 8);
    expect(first.evaluation.explainability.equations.map((equation) => equation.id)).toEqual(
      expect.arrayContaining(['solar.power', 'solar.bend-margin', 'solar.stow-margin']),
    );
  });

  it('exposes negative bend and storm margins instead of hiding an invalid design', () => {
    const payload = passingPayload();
    payload.deployment.coreRadiusM = 0.05;
    payload.deployment.stowTimeSeconds = 30;
    const result = evaluateSyntheticSolarDeploymentRep(
      createSyntheticSolarDeploymentRepMaterialInput(payload),
    ).evaluation.result as {
      deployment: { bendRadiusMarginM: number };
      storm: { stowTimeMarginSeconds: number };
    };

    expect(result.deployment.bendRadiusMarginM).toBeLessThan(0);
    expect(result.storm.stowTimeMarginSeconds).toBeLessThan(0);
  });

  it('rejects a stow trigger at or above the synthetic hazard threshold', () => {
    const payload = passingPayload();
    payload.control.windStowTriggerMps = payload.control.hazardWindThresholdMps;

    expect(() => createSyntheticSolarDeploymentRepMaterialInput(payload)).toThrow(
      /stow trigger must be below/i,
    );
  });

  it('rejects a submission that changes the controlled Scenario environment', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput(passingPayload());
    const changed = structuredClone(input);
    const payload = changed.submission.materialPayload as ReturnType<typeof passingPayload>;
    payload.environment.incidenceAngleDeg = 35;

    expect(() => evaluateSyntheticSolarDeploymentRep(changed)).toThrow(/controlled Scenario environment/i);
  });
});
