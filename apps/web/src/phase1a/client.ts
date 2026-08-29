import type {
  Phase1aEvaluationView,
  Phase1aWorkspace,
  Phase1aWorkspaceSelection,
  StemLearningDepth,
} from '@gosp/contracts';

export type Phase1aClient = {
  loadWorkspace(selection?: Phase1aWorkspaceSelection, learningDepth?: StemLearningDepth): Promise<Phase1aWorkspace>;
  loadChallenge(challengeId: string, revision: string, learningDepth?: StemLearningDepth): Promise<Phase1aWorkspace>;
  createChallenge(value: unknown): Promise<unknown>;
  createSubmission(value: unknown): Promise<unknown>;
  evaluateSubmission(submissionId: string, revision: string): Promise<Phase1aEvaluationView>;
  exportReplay(submissionId: string, revision: string): Promise<unknown>;
  exportEvidencePackage(submissionId: string, revision: string): Promise<unknown>;
  validateEvidencePackage(value: unknown): Promise<unknown>;
  exportArchive(): Promise<unknown>;
  importArchive(value: unknown): Promise<unknown>;
};

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, init);
  const body = (await response.json()) as {
    error?: string;
    issues?: Array<{ path?: string; message?: string }>;
  };
  if (!response.ok) {
    const details = body.issues?.map((issue) => `${issue.path || '(record)'}: ${issue.message}`).join('; ');
    throw new Error([body.error ?? `HTTP ${response.status}`, details].filter(Boolean).join(' — '));
  }
  return body;
}

const jsonRequest = (value: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(value),
});

export function createPhase1aClient(): Phase1aClient {
  return {
    loadWorkspace: (selection, learningDepth) => {
      const parameters = new URLSearchParams();
      if (selection) {
        parameters.set('baselineId', selection.baseline.id);
        parameters.set('baselineRevision', selection.baseline.revision);
        parameters.set('candidateId', selection.candidate.id);
        parameters.set('candidateRevision', selection.candidate.revision);
      }
      if (learningDepth) parameters.set('learningDepth', learningDepth);
      const query = parameters.size ? `?${parameters.toString()}` : '';
      return request(`/api/phase1a/workspace${query}`) as Promise<Phase1aWorkspace>;
    },
    loadChallenge: (challengeId, revision, learningDepth) => {
      const parameters = new URLSearchParams({ challengeId, challengeRevision: revision });
      if (learningDepth) parameters.set('learningDepth', learningDepth);
      return request(`/api/phase1a/workspace?${parameters.toString()}`) as Promise<Phase1aWorkspace>;
    },
    createChallenge: (value) => request('/api/phase1a/challenges', jsonRequest(value)),
    createSubmission: (value) => request('/api/phase1a/submissions', jsonRequest(value)),
    evaluateSubmission: (submissionId, revision) =>
      request(
        '/api/phase1a/evaluations',
        jsonRequest({ submissionId, revision }),
      ) as Promise<Phase1aEvaluationView>,
    exportReplay: (submissionId, revision) =>
      request(
        `/api/phase1a/export?submissionId=${encodeURIComponent(submissionId)}&revision=${encodeURIComponent(revision)}`,
      ),
    exportEvidencePackage: (submissionId, revision) =>
      request(
        `/api/phase1a/evidence-package?submissionId=${encodeURIComponent(submissionId)}&revision=${encodeURIComponent(revision)}`,
      ),
    validateEvidencePackage: (value) =>
      request('/api/phase1a/evidence-package/validate', jsonRequest(value)),
    exportArchive: () => request('/api/phase1a/archive'),
    importArchive: (value) => request('/api/phase1a/archive', jsonRequest(value)),
  };
}
