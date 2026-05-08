import fs from 'node:fs';
import path from 'node:path';

function findRepoRoot(start = process.cwd()): string {
  let current = start;
  while (true) {
    const packagePath = path.join(current, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as { name?: string };
      if (packageJson.name === 'gosp-forge') return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return start;
    current = parent;
  }
}

export function resolveRepoPath(file: string): string {
  return path.isAbsolute(file) ? file : path.join(findRepoRoot(), file);
}

export function readJsonFile(file: string): unknown {
  return JSON.parse(fs.readFileSync(resolveRepoPath(file), 'utf8'));
}

export function listExampleJson(root = 'examples'): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.json')) out.push(full);
    }
  };
  walk(resolveRepoPath(root));
  return out.sort();
}
