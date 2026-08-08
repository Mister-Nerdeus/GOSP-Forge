import { auditCommand } from './commands/audit.js';
import { estimateCommand } from './commands/estimate.js';
import { releaseEvidenceCommand } from './commands/releaseEvidence.js';
import { simulateCommand } from './commands/simulate.js';
import { validateCommand } from './commands/validate.js';
import { repCommand } from './commands/rep.js';
const [command, target = '', secondaryTarget = ''] = process.argv.slice(2);
const handlers = {
  validate: validateCommand,
  simulate: simulateCommand,
  estimate: estimateCommand,
  'release-evidence': releaseEvidenceCommand,
  audit: auditCommand,
} as const;
if (!command || (command !== 'rep' && !(command in handlers))) {
  console.error(
    JSON.stringify({
      ok: false,
      error: 'usage: gosp <validate|simulate|estimate|audit|release-evidence> <target> | gosp rep <evaluate|replay> <record.json>',
    }),
  );
  process.exit(1);
}
const result =
  command === 'rep'
    ? repCommand(target, secondaryTarget)
    : handlers[command as keyof typeof handlers](target);
console.log(JSON.stringify(result, null, 2));
if ('ok' in result && result.ok === false) process.exit(1);
