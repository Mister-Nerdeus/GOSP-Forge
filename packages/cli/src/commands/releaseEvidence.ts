import { execFileSync } from 'node:child_process';
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

  return {
    ok: validation.ok && simulation.ok && estimate.ok && audit.ok,
    kind: 'FoundationReleaseEvidence',
    gitSha: gitSha(),
    generatedAt: new Date().toISOString(),
    evidence: {
      validation: {
        ok: validation.ok,
        validationMode: validation.validationMode,
        errors: validation.errors.length,
        warnings: validation.warnings.length,
      },
      simulation: {
        ok: simulation.ok,
        defaultedInputs: simulationInput?.defaultedInputs.length,
        confidence: simulationInput?.confidence.level,
      },
      estimate: {
        ok: estimate.ok,
        qualityReport: estimate.ok ? estimate.qualityReport : undefined,
        modeGate: estimate.modeGate,
      },
      audit: {
        ok: audit.ok,
      },
    },
    limitations: [
      'Evidence bundle gathers existing foundation outputs only.',
      'No professional, procurement, potable-water, manufacturing, or release-approval claim.',
    ],
  };
}
