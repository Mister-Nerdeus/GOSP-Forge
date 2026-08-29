import { describe, expect, it } from 'vitest';
import {
  StemEngineeringDefinitionSchema,
  StemEngineeringProjectionSchema,
} from './stemEngineeringProjection.js';

const definition = {
  designVariables: [],
  objectives: [{
    id: 'objective.output',
    statement: 'Increase output.',
    rule: { kind: 'numeric-result', resultPath: 'result.value', direction: 'maximize' },
  }],
  hazards: [],
  disclosures: ['Modeled gates are not safety approval.'],
};

const projection = {
  requirements: [{ id: 'requirement.valid', statement: 'Evaluation shall complete.', obligation: 'shall', role: 'hard-gate', status: 'accepted' }],
  hardGates: [{
    constraintId: 'constraint.complete', statement: 'Evaluation completes.',
    baseline: { actual: 'completed', passed: true }, candidate: { actual: 'completed', passed: true }, changed: false,
    margin: { status: 'not-applicable', explanation: 'Logical gate.' },
  }],
  unresolvedProofObligations: { baseline: [], candidate: [] },
  designVariables: [], hazards: [],
  objectives: [
    { id: 'objective.output', statement: 'Increase output.', assessmentKind: 'numeric-result', baseline: 1, candidate: 2, preference: 'candidate', explanation: 'Candidate is higher.' },
    { id: 'objective.preserve', statement: 'Preserve input.', assessmentKind: 'preserve-input', baseline: 0.8, candidate: 0.9, preference: 'baseline', explanation: 'Candidate changed the input.' },
  ],
  tradeoff: { status: 'conflict', decision: 'no-universal-winner', explanation: 'Objectives disagree.' },
  revisionExplanation: { summary: 'Revisions differ.', changedInputs: ['x changed'], resultChanges: ['y changed'] },
  disclosures: ['No universal score.'],
};

describe('STEM engineering contracts', () => {
  it('accepts explicit objective rules without a composite score', () => {
    expect(StemEngineeringDefinitionSchema.parse(definition).objectives[0]?.rule.kind).toBe(
      'numeric-result',
    );
  });

  it('rejects duplicate objective identities', () => {
    expect(() => StemEngineeringDefinitionSchema.parse({
      ...definition,
      objectives: [definition.objectives[0], definition.objectives[0]],
    })).toThrow(/duplicate engineering objective/i);
  });

  it('requires conflicting objectives to report no universal winner', () => {
    expect(StemEngineeringProjectionSchema.parse(projection).tradeoff.decision).toBe(
      'no-universal-winner',
    );
    expect(() => StemEngineeringProjectionSchema.parse({
      ...projection,
      tradeoff: { ...projection.tradeoff, decision: 'candidate-preferred' },
    })).toThrow(/must not declare a universal winner/i);
  });
});
