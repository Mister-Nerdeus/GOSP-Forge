import { spawnSync } from 'node:child_process';
import process from 'node:process';

const result = spawnSync(process.execPath, ['--test'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
