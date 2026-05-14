import { describe, expect, it } from 'vitest';
import { verifySubmissionSignatureMetadata } from './submissionSignature.js';

const submission = {
  envelope: {
    id: 'submission-1',
    projectId: 'automated-water-filter',
    inputHash: 'a'.repeat(64),
    modelVersion: '0.1.0',
    scoringProfileId: 'clean-water-scoring-profile',
    submittedAt: '2026-05-14T00:00:00.000Z',
  },
  signature: {
    algorithm: 'ed25519',
    keyId: 'foundation-test-key',
    signature: 'signature-bytes-placeholder',
  },
  reviewStatus: 'submitted',
};

describe('verifySubmissionSignatureMetadata', () => {
  it('parses metadata but does not trust correctness before server re-simulation', () => {
    expect(verifySubmissionSignatureMetadata(submission)).toMatchObject({
      ok: true,
      trusted: false,
      requiresServerResimulation: true,
      signature: {
        present: true,
        keyId: 'foundation-test-key',
      },
    });
  });

  it('still does not treat server-resimulated metadata as cryptographic trust', () => {
    expect(
      verifySubmissionSignatureMetadata({ ...submission, reviewStatus: 'server-resimulated' }),
    ).toMatchObject({
      ok: true,
      trusted: false,
      requiresServerResimulation: false,
    });
  });

  it('rejects invalid signed submission envelopes', () => {
    expect(verifySubmissionSignatureMetadata({ ...submission, envelope: {} })).toMatchObject({
      ok: false,
      trusted: false,
      requiresServerResimulation: true,
    });
  });
});
