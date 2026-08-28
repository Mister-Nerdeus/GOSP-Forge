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
      storm: { stowStartWindMps: number; stowTimeMarginSeconds: number };
    };

    expect(first.materialInputHash).toBe(second.materialInputHash);
    expect(first.materialResultHash).toBe(second.materialResultHash);
    expect(result.power.instantaneousPowerW).toBeGreaterThan(0);
    expect(result.power.cleaningRecoveredPowerW).toBeGreaterThan(0);
    expect(result.deployment.bendRadiusMarginM).toBeCloseTo(0.025, 8);
    expect(result.storm.stowStartWindMps).toBe(12);
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

  it('uses the candidate stow trigger when it is above the controlled current wind', () => {
    const baselinePayload = passingPayload();
    const baseline = evaluateSyntheticSolarDeploymentRep(
      createSyntheticSolarDeploymentRepMaterialInput(baselinePayload),
    ).evaluation.result as { storm: { stowTimeMarginSeconds: number } };
    const earlierTriggerInput = createSyntheticSolarDeploymentRepMaterialInput(baselinePayload);
    const earlierTrigger = structuredClone(earlierTriggerInput);
    const payload = earlierTrigger.submission.materialPayload as ReturnType<typeof passingPayload>;
    payload.control.windStowTriggerMps = 10;
    const candidate = evaluateSyntheticSolarDeploymentRep(earlierTrigger).evaluation.result as {
      storm: { stowStartWindMps: number; stowTimeMarginSeconds: number };
    };

    expect(candidate.storm.stowStartWindMps).toBe(10);
    expect(candidate.storm.stowTimeMarginSeconds).toBeGreaterThan(
      baseline.storm.stowTimeMarginSeconds,
    );
  });

  it('does not award time before the current wind state when the trigger is already behind it', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput(passingPayload());
    const changed = structuredClone(input);
    const payload = changed.submission.materialPayload as ReturnType<typeof passingPayload>;
    payload.control.windStowTriggerMps = 4;
    const result = evaluateSyntheticSolarDeploymentRep(changed).evaluation.result as {
      storm: { stowStartWindMps: number };
    };

    expect(result.storm.stowStartWindMps).toBe(8);
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

  it('rejects a submission that changes the controlled panel specification', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput(passingPayload());
    const changed = structuredClone(input);
    const payload = changed.submission.materialPayload as ReturnType<typeof passingPayload>;
    payload.panel.ratedPowerW = 250;

    expect(() => evaluateSyntheticSolarDeploymentRep(changed)).toThrow(/controlled Scenario panel specification/i);
  });

  it('rejects a submission that changes the controlled starting soiling condition', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput(passingPayload());
    const changed = structuredClone(input);
    const payload = changed.submission.materialPayload as ReturnType<typeof passingPayload>;
    payload.cleaning.soilingLossFraction = 0.05;

    expect(() => evaluateSyntheticSolarDeploymentRep(changed)).toThrow(/controlled Scenario soiling condition/i);
  });

  it('permits candidate deployment and controller choices inside the controlled boundary', () => {
    const input = createSyntheticSolarDeploymentRepMaterialInput(passingPayload());
    const changed = structuredClone(input);
    const payload = changed.submission.materialPayload as ReturnType<typeof passingPayload>;
    payload.deployment.coreRadiusM = 0.12;
    payload.deployment.deployedFraction = 0.9;
    payload.deployment.stowTimeSeconds = 12;
    payload.control.sensorLatencySeconds = 0.5;
    payload.cleaning.modeledCleaningRecoveryFraction = 0.1;

    expect(() => evaluateSyntheticSolarDeploymentRep(changed)).not.toThrow();
  });
});
