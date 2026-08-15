import type {
  Phase1aEvaluationView,
  Phase1aWorkspace,
  Phase1aWorkspaceSelection,
} from '@gosp/contracts';

export type Phase1aClient = {
  loadWorkspace(selection?: Phase1aWorkspaceSelection): Promise<Phase1aWorkspace>;
  createChallenge(value: unknown): Promise<unknown>;
  createSubmission(value: unknown): Promise<unknown>;
  evaluateSubmission(submissionId: string, revision: string): Promise<Phase1aEvaluationView>;
  exportReplay(submissionId: string, revision: string): Promise<unknown>;
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
    loadWorkspace: (selection) => {
      const parameters = new URLSearchParams();
      if (selection) {
        parameters.set('baselineId', selection.baseline.id);
        parameters.set('baselineRevision', selection.baseline.revision);
        parameters.set('candidateId', selection.candidate.id);
        parameters.set('candidateRevision', selection.candidate.revision);
      }
      const query = parameters.size ? `?${parameters.toString()}` : '';
      return request(`/api/phase1a/workspace${query}`) as Promise<Phase1aWorkspace>;
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
  };
}
