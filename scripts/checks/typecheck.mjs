import { spawnSync } from 'node:child_process';
import process from 'node:process';

const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const result = spawnSync(command, ['exec', 'tsc', '--noEmit'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
