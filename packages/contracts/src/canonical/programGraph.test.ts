import { describe, expect, it } from 'vitest';
import {
  CanonicalConstraintSchema,
  CanonicalObjectKindSchema,
  EngineeringProgramSchema,
  HazardSchema,
  InterfaceSchema,
  RequirementSchema,
  SystemElementSchema,
} from '../index.js';

const provenance = { sources: [], method: 'authored' as const };
const base = { revision: '1.0.0', provenance };
const ref = (kind: 'SystemElement', id: string) => ({ kind, id, revision: '1.0.0' });

describe('canonical program graph foundation', () => {
  it('defines exactly the 18 approved canonical object kinds', () => {
    expect(CanonicalObjectKindSchema.options).toHaveLength(18);
  });

  it('validates the program, requirement, constraint, and hazard objects', () => {
    expect(
      EngineeringProgramSchema.parse({
        ...base,
        kind: 'EngineeringProgram',
        id: 'program.sandbox',
        title: 'Sandbox program',
        summary: 'A deterministic protocol benchmark.',
        status: 'active',
      }),
    ).toBeTruthy();

    expect(
      RequirementSchema.parse({
        ...base,
        kind: 'Requirement',
        id: 'requirement.repeatable',
        statement: 'The result shall be reproducible.',
        obligation: 'shall',
        status: 'accepted',
        verificationMethod: 'test',
      }),
    ).toBeTruthy();

    expect(
      CanonicalConstraintSchema.parse({
        ...base,
        kind: 'Constraint',
        id: 'constraint.nonnegative',
        statement: 'The parameter shall be nonnegative.',
        constraintType: 'numeric',
        parameter: 'input.value',
        operator: 'gte',
        value: 0,
        status: 'active',
      }),
    ).toBeTruthy();

    expect(
      HazardSchema.parse({
        ...base,
        kind: 'Hazard',
        id: 'hazard.none',
        description: 'Synthetic benchmark has no physical-use claim.',
        severity: 'negligible',
        likelihood: 'rare',
        status: 'identified',
      }),
    ).toBeTruthy();
  });

  it('validates system elements and typed interfaces with exact revisions', () => {
    expect(
      SystemElementSchema.parse({
        ...base,
        kind: 'SystemElement',
        id: 'element.input',
        name: 'Input',
        elementType: 'logical',
        status: 'active',
      }),
    ).toBeTruthy();

    expect(
      InterfaceSchema.parse({
        ...base,
        kind: 'Interface',
        id: 'interface.input-output',
        name: 'Input to output',
        interfaceType: 'data',
        from: ref('SystemElement', 'element.input'),
        to: ref('SystemElement', 'element.output'),
        direction: 'unidirectional',
        status: 'active',
      }),
    ).toBeTruthy();
  });
});
