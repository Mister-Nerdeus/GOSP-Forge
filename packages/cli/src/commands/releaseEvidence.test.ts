import { describe, expect, it } from 'vitest';
import { releaseEvidenceCommand } from './releaseEvidence.js';

describe('releaseEvidenceCommand', () => {
  it('gathers foundation evidence without approving a release', () => {
    const result = releaseEvidenceCommand('foundation');

    expect(result).toMatchObject({
      ok: true,
      kind: 'FoundationReleaseEvidence',
      target: 'foundation',
      evidence: {
        validation: {
          ok: true,
          validationMode: 'repo-refs',
          refs: { declared: 20, resolved: 20 },
        },
        simulation: {
          ok: true,
          confidenceSummary: expect.objectContaining({
            graphWarningCount: 0,
          }),
          graphConsistency: expect.objectContaining({
            missingNodeIds: [],
          }),
        },
        estimate: {
          ok: true,
          qualityReport: expect.objectContaining({
            zeroCostLineIds: ['filter-housing'],
            defaultedQuantityIds: [],
          }),
        },
        audit: {
          ok: true,
          decision: 'GO',
        },
      },
    });
    expect(result.runtime.node).toMatch(/^v/);
    expect(result.limitations.join(' ')).toContain('No professional');
    expect(result.limitations.join(' ')).toContain('release-approval');
  });

  it('rejects unsupported release evidence targets', () => {
    expect(releaseEvidenceCommand('production')).toEqual({
      ok: false,
      error: 'usage: gosp release-evidence foundation',
    });
  });
});
