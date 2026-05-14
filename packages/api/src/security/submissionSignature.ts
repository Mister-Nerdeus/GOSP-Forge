import { SignedSubmissionSchema } from '@gosp/contracts';

type VerificationIssue = {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'blocker';
};

export function verifySubmissionSignatureMetadata(value: unknown) {
  const parsed = SignedSubmissionSchema.safeParse(value);
  if (!parsed.success) {
    return {
      ok: false,
      trusted: false,
      requiresServerResimulation: true,
      issues: parsed.error.issues.map(
        (issue): VerificationIssue => ({
          code: 'signed-submission-invalid',
          message: issue.message,
          severity: 'blocker',
        }),
      ),
    };
  }

  return {
    ok: true,
    trusted: false,
    requiresServerResimulation: parsed.data.reviewStatus !== 'server-resimulated',
    signature: {
      algorithm: parsed.data.signature.algorithm,
      keyId: parsed.data.signature.keyId,
      present: true,
    },
    issues: [
      {
        code: 'signature-metadata-not-correctness-proof',
        message:
          'Signature metadata is not proof of simulation correctness; server re-simulation is required.',
        severity: 'warning' as const,
      },
    ],
  };
}
