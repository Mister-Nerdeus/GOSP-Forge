import { describe, expect, it } from 'vitest';
import { scanTextForNoProfessionalClaims } from './noProfessionalClaimScanner.js';

describe('scanTextForNoProfessionalClaims', () => {
  it('allows explicit non-claims and disclaimers', () => {
    const findings = scanTextForNoProfessionalClaims(
      'docs/example.md',
      [
        'This does not certify potable water.',
        'No professional engineering approval is provided.',
        'This is not permit-ready output.',
      ].join('\n'),
    );

    expect(findings).toEqual([]);
  });

  it('blocks affirmative potable-water certification claims', () => {
    const findings = scanTextForNoProfessionalClaims(
      'docs/example.md',
      'The model certified potable water for classroom use.',
    );

    expect(findings).toEqual([
      expect.objectContaining({
        code: 'potable-certification-claim',
        line: 1,
      }),
    ]);
  });

  it('blocks affirmative professional approval claims', () => {
    const findings = scanTextForNoProfessionalClaims(
      'docs/example.md',
      'The output has professional engineering approval.',
    );

    expect(findings).toEqual([
      expect.objectContaining({
        code: 'professional-approval-claim',
      }),
    ]);
  });

  it('blocks permit-ready output claims', () => {
    const findings = scanTextForNoProfessionalClaims(
      'docs/example.md',
      'The estimate is permit-ready.',
    );

    expect(findings).toEqual([
      expect.objectContaining({
        code: 'permit-ready-claim',
      }),
    ]);
  });
});
