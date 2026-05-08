import fs from 'node:fs';
import { resolveRepoPath } from '../exampleRegistry.js';
export function claimCheck(files: string[]): Array<{ file: string; exists: boolean }> {
  return files.map((file) => ({ file, exists: fs.existsSync(resolveRepoPath(file)) }));
}
