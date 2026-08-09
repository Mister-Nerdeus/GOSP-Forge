import { Phase1aService } from '../../packages/api/dist/phase1a/service.js';

const workspace = await new Phase1aService(undefined, () => '2026-08-09T00:00:00.000Z').getWorkspace();

console.log(
  JSON.stringify({
    milestone: workspace.milestone,
    persistence: workspace.persistence,
    challenge: {
      id: workspace.challenge.record.id,
      revision: workspace.challenge.record.revision,
      model: workspace.challenge.model.id,
      solver: workspace.challenge.model.solver,
    },
    evaluations: workspace.evaluations.map((view) => ({
      submission: `${view.evaluation.submissionRef.id}@${view.evaluation.submissionRef.revision}`,
      evaluation: `${view.evaluation.id}@${view.evaluation.revision}`,
      result: view.evaluation.result,
      materialInputHash: view.evaluation.materialInputHash,
      materialResultHash: view.evaluation.materialResultHash,
      hardGatesPassed: view.hardGates.every((gate) => gate.passed),
      evidenceReadiness: view.claim.evidenceReadiness,
      deploymentReadiness: view.claim.deploymentReadiness,
      replay: view.replay,
      unresolvedProofObligationIds: view.claim.proofObligations
        .filter((obligation) => obligation.status === 'open')
        .map((obligation) => obligation.id),
    })),
    comparison: {
      comparable: workspace.comparison.comparable,
      changedInputPaths: workspace.comparison.changedInputPaths,
      fixedInputPathCount: workspace.comparison.fixedInputPaths.length,
      resultDeltas: workspace.comparison.resultDeltas,
      hardGateChanges: workspace.comparison.hardGateChanges,
      explanation: workspace.comparison.explanation,
    },
    explainability: {
      equationIds: workspace.evaluations[0].evaluation.explainability.equations.map(
        (equation) => equation.id,
      ),
      intermediateValueIds:
        workspace.evaluations[0].evaluation.explainability.intermediateValues.map(
          (value) => value.id,
        ),
      modelFidelity: workspace.challenge.model.fidelity.level,
      runner: workspace.evaluations[0].evaluation.runner,
    },
    nonClaims: workspace.evaluations[0].limitations,
  }),
);
