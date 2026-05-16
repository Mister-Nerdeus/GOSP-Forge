import { execFileSync, execSync } from 'node:child_process';
import { auditCommand } from './audit.js';
import { estimateCommand } from './estimate.js';
import { simulateCommand } from './simulate.js';
import { validateCommand } from './validate.js';

function gitSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function gitBranch() {
  try {
    return execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function pnpmVersion() {
  try {
    return execSync('pnpm -v', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

export function releaseEvidenceCommand(target: string) {
  if (target !== 'foundation') {
    return { ok: false, error: 'usage: gosp release-evidence foundation' };
  }

  const projectPath = 'examples/projects/automated-water-filter.project-v2.json';
  const validation = validateCommand(projectPath);
  const simulation = simulateCommand(projectPath);
  const estimate = estimateCommand(projectPath);
  const audit = auditCommand('foundation');
  const simulationInput = simulation.ok ? simulation.input : undefined;
  const simulationEnvelope = simulation.ok ? simulation.envelope : undefined;

  return {
    ok: validation.ok && simulation.ok && estimate.ok && audit.ok,
    kind: 'FoundationReleaseEvidence',
    target,
    gitSha: gitSha(),
    branch: gitBranch(),
    generatedAt: new Date().toISOString(),
    runtime: {
      node: process.version,
      pnpm: pnpmVersion(),
    },
    evidence: {
      validation: {
        ok: validation.ok,
        validationMode: validation.validationMode,
        projectId: validation.projectId,
        refs: validation.refs,
        errors: validation.errors.length,
        warnings: validation.warnings.length,
      },
      simulation: {
        ok: simulation.ok,
        projectId: simulationInput?.projectId,
        defaultedInputs: simulationInput?.defaultedInputs.length,
        unknownInputs: simulationInput?.unknownInputs.length,
        confidence: simulationInput?.confidence.level,
        confidenceSummary: simulationEnvelope?.confidenceSummary,
        graphConsistency: simulationInput?.graphConsistency,
      },
      estimate: {
        ok: estimate.ok,
        qualityReport: estimate.ok ? estimate.qualityReport : undefined,
        modeGate: estimate.modeGate,
      },
      audit: {
        ok: audit.ok,
        decision: audit.decision,
        counts: audit.counts,
        claimScan: audit.claimScan,
      },
    },
    limitations: [
      'Evidence bundle gathers existing foundation outputs only.',
      'No professional, procurement, potable-water, manufacturing, or release-approval claim.',
    ],
  };
}
