import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendJson, HttpError } from './http/errors.js';
import { readJsonBody } from './http/readJsonBody.js';
import { rateLimit } from './http/rateLimit.js';
import { healthResponse } from './routes/health.js';
import { validateProjectBody } from './routes/validate.js';
import { versionResponse } from './routes/version.js';
import { Phase1aService, Phase1aValidationError } from './phase1a/service.js';
import { LocalFileSystemStorage } from './storage/localFileSystemStorage.js';

export const PHASE1A_LOCAL_HOST = '127.0.0.1';

export function createGospServer(options: { phase1a?: Phase1aService } = {}) {
  const phase1a = options.phase1a ?? new Phase1aService();
  return createServer(async (req, res) => {
    try {
      const key = req.socket.remoteAddress ?? 'unknown';
      if (!rateLimit(key)) return sendJson(res, 429, { error: 'rate_limited' });
      if (req.method === 'GET' && req.url === '/health')
        return sendJson(res, 200, healthResponse());
      if (req.method === 'GET' && req.url === '/version')
        return sendJson(res, 200, versionResponse());
      const requestUrl = new URL(req.url ?? '/', 'http://localhost');
      if (req.method === 'GET' && requestUrl.pathname === '/api/phase1a/workspace') {
        const selectionValues = {
          baselineId: requestUrl.searchParams.get('baselineId'),
          baselineRevision: requestUrl.searchParams.get('baselineRevision'),
          candidateId: requestUrl.searchParams.get('candidateId'),
          candidateRevision: requestUrl.searchParams.get('candidateRevision'),
        };
        const suppliedSelectionValues = Object.values(selectionValues).filter(
          (value) => value !== null,
        );
        if (suppliedSelectionValues.length !== 0 && suppliedSelectionValues.length !== 4) {
          throw new Phase1aValidationError(
            'Workspace selection requires baselineId, baselineRevision, candidateId, and candidateRevision together.',
          );
        }
        const selection = suppliedSelectionValues.length === 4
          ? {
              baseline: {
                id: selectionValues.baselineId!,
                revision: selectionValues.baselineRevision!,
              },
              candidate: {
                id: selectionValues.candidateId!,
                revision: selectionValues.candidateRevision!,
              },
            }
          : undefined;
        const challengeId = requestUrl.searchParams.get('challengeId');
        const challengeRevision = requestUrl.searchParams.get('challengeRevision');
        if ((challengeId === null) !== (challengeRevision === null)) {
          throw new Phase1aValidationError(
            'Challenge selection requires challengeId and challengeRevision together.',
          );
        }
        if (selection && challengeId) {
          throw new Phase1aValidationError(
            'Choose either an exact Submission pair or a Challenge default selection, not both.',
          );
        }
        const learningDepth = requestUrl.searchParams.get('learningDepth');
        const validDepths = ['explore', 'measure', 'model', 'solve', 'verify', 'research-professional'] as const;
        if (learningDepth !== null && !validDepths.includes(learningDepth as typeof validDepths[number])) {
          throw new Phase1aValidationError(`Unknown STEM learning depth ${learningDepth}.`);
        }
        return sendJson(
          res,
          200,
          await phase1a.getWorkspace(
            selection,
            challengeId && challengeRevision
              ? { id: challengeId, revision: challengeRevision }
              : undefined,
            (learningDepth ?? 'explore') as typeof validDepths[number],
          ),
        );
      }
      if (req.method === 'GET' && requestUrl.pathname === '/api/phase1a/stem-system') {
        const challengeId = requestUrl.searchParams.get('challengeId');
        const challengeRevision = requestUrl.searchParams.get('challengeRevision');
        if ((challengeId === null) !== (challengeRevision === null)) {
          throw new Phase1aValidationError(
            'STEM system selection requires challengeId and challengeRevision together.',
          );
        }
        const learningDepth = requestUrl.searchParams.get('learningDepth');
        const validDepths = ['explore', 'measure', 'model', 'solve', 'verify', 'research-professional'] as const;
        if (learningDepth !== null && !validDepths.includes(learningDepth as typeof validDepths[number])) {
          throw new Phase1aValidationError(`Unknown STEM learning depth ${learningDepth}.`);
        }
        const workspace = await phase1a.getWorkspace(
          undefined,
          challengeId && challengeRevision
            ? { id: challengeId, revision: challengeRevision }
            : undefined,
          (learningDepth ?? 'explore') as typeof validDepths[number],
        );
        return sendJson(
          res,
          200,
          workspace.stemSystem,
        );
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/challenges') {
        const body = await readJsonBody(req);
        return sendJson(res, 201, { ok: true, challenge: await phase1a.createChallenge(body) });
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/submissions') {
        const body = await readJsonBody(req);
        return sendJson(res, 201, { ok: true, submission: await phase1a.createSubmission(body) });
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/parameter-change') {
        const body = (await readJsonBody(req)) as {
          baseline?: { id?: unknown; revision?: unknown };
          parameterId?: unknown;
          value?: unknown;
          learningDepth?: unknown;
        };
        if (!body.baseline || typeof body.baseline.id !== 'string' || typeof body.baseline.revision !== 'string' || typeof body.parameterId !== 'string') {
          throw new Phase1aValidationError('Parameter change requires baseline identity and parameterId.');
        }
        const validDepths = ['explore', 'measure', 'model', 'solve', 'verify', 'research-professional'] as const;
        if (body.learningDepth !== undefined && (typeof body.learningDepth !== 'string' || !validDepths.includes(body.learningDepth as typeof validDepths[number]))) {
          throw new Phase1aValidationError(`Unknown STEM learning depth ${String(body.learningDepth)}.`);
        }
        return sendJson(res, 200, await phase1a.applyParameterChange({
          baseline: { id: body.baseline.id, revision: body.baseline.revision },
          parameterId: body.parameterId,
          value: body.value,
          learningDepth: body.learningDepth as typeof validDepths[number] | undefined,
        }));
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/evaluations') {
        const body = (await readJsonBody(req)) as { submissionId?: unknown; revision?: unknown };
        if (typeof body.submissionId !== 'string' || typeof body.revision !== 'string') {
          throw new Phase1aValidationError('Evaluation requires string submissionId and revision.');
        }
        return sendJson(
          res,
          200,
          await phase1a.evaluateSubmission(body.submissionId, body.revision),
        );
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/comparisons') {
        const body = (await readJsonBody(req)) as {
          baseline?: { id?: unknown; revision?: unknown };
          candidate?: { id?: unknown; revision?: unknown };
        };
        if (
          typeof body.baseline?.id !== 'string' ||
          typeof body.baseline.revision !== 'string' ||
          typeof body.candidate?.id !== 'string' ||
          typeof body.candidate.revision !== 'string'
        ) {
          throw new Phase1aValidationError('Comparison requires baseline and candidate Submission references.');
        }
        const baseline = await phase1a.evaluateSubmission(body.baseline.id, body.baseline.revision);
        const candidate = await phase1a.evaluateSubmission(body.candidate.id, body.candidate.revision);
        return sendJson(res, 200, await phase1a.compare(baseline, candidate));
      }
      if (req.method === 'GET' && requestUrl.pathname === '/api/phase1a/export') {
        const submissionId = requestUrl.searchParams.get('submissionId');
        const revision = requestUrl.searchParams.get('revision');
        if (!submissionId || !revision) {
          throw new Phase1aValidationError('Export requires submissionId and revision query parameters.');
        }
        const evaluation = await phase1a.evaluateSubmission(submissionId, revision);
        return sendJson(res, 200, evaluation.replayRecord);
      }
      if (req.method === 'GET' && requestUrl.pathname === '/api/phase1a/evidence-package') {
        const submissionId = requestUrl.searchParams.get('submissionId');
        const revision = requestUrl.searchParams.get('revision');
        if (!submissionId || !revision) {
          throw new Phase1aValidationError(
            'Evidence package export requires submissionId and revision query parameters.',
          );
        }
        return sendJson(
          res,
          200,
          await phase1a.exportEvidencePackage(submissionId, revision),
        );
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/evidence-package/validate') {
        return sendJson(res, 200, await phase1a.validateEvidencePackage(await readJsonBody(req)));
      }
      if (req.method === 'GET' && requestUrl.pathname === '/api/phase1a/archive') {
        return sendJson(res, 200, await phase1a.exportWorkspaceArchive());
      }
      if (req.method === 'POST' && requestUrl.pathname === '/api/phase1a/archive') {
        return sendJson(res, 200, await phase1a.importWorkspaceArchive(await readJsonBody(req)));
      }
      if (req.method === 'POST' && requestUrl.pathname === '/validate') {
        const body = await readJsonBody(req);
        const mode = requestUrl.searchParams.get('mode') === 'repo' ? 'repo' : 'schema-only';
        const result = validateProjectBody(body, { mode });
        return sendJson(res, result.status, result.body);
      }
      return sendJson(res, 404, { error: 'not_found' });
    } catch (error) {
      if (error instanceof HttpError)
        return sendJson(res, error.statusCode, { error: error.message });
      if (error instanceof Phase1aValidationError)
        return sendJson(res, 422, { error: error.message, issues: error.issues });
      return sendJson(res, 500, { error: 'internal_error' });
    }
  });
}
const isDirectExecution =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  const port = Number(process.env.PORT ?? 3080);
  const repositoryRoot = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)));
  const workspaceDirectory = path.resolve(
    process.env.GOSP_WORKSPACE_DIR ?? path.join(repositoryRoot, '.gosp/workspaces/default'),
  );
  const phase1a = new Phase1aService(new LocalFileSystemStorage(workspaceDirectory));
  createGospServer({ phase1a }).listen(port, PHASE1A_LOCAL_HOST, () =>
    console.log(JSON.stringify({ ok: true, url: `http://${PHASE1A_LOCAL_HOST}:${port}` })),
  );
}
