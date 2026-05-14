import { describe, expect, it } from 'vitest';
import { SignedSubmissionSchema } from './signedSubmission.js';

const envelope = {
  id: 'submission-1',
  projectId: 'automated-water-filter',
  inputHash: 'a'.repeat(64),
  modelVersion: '0.1.0',
  scoringProfileId: 'clean-water-scoring-profile',
  submittedAt: '2026-05-14T00:00:00.000Z',
};

describe('SignedSubmissionSchema', () => {
  it('accepts signed submission metadata with server re-simulation status', () => {
    expect(
      SignedSubmissionSchema.safeParse({
        envelope,
        signature: {
          algorithm: 'ed25519',
          keyId: 'foundation-test-key',
          signature: 'signature-bytes-placeholder',
        },
        reviewStatus: 'server-resimulated',
      }).success,
    ).toBe(true);
  });

  it('rejects missing signature metadata', () => {
    expect(
      SignedSubmissionSchema.safeParse({
        envelope,
        signature: {
          algorithm: '',
          keyId: 'foundation-test-key',
          signature: 'signature-bytes-placeholder',
        },
        reviewStatus: 'submitted',
      }).success,
    ).toBe(false);
  });
});
