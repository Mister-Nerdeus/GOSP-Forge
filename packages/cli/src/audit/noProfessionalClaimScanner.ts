import fs from 'node:fs';
import path from 'node:path';
import { resolveRepoPath } from '../exampleRegistry.js';

export type ClaimScanFinding = {
  file: string;
  line: number;
  code: string;
  message: string;
  excerpt: string;
  severity: 'blocker';
};

const ScanRoots = ['README.md', 'docs', 'examples', 'apps'];
const TextExtensions = new Set(['.md', '.json', '.ts', '.tsx', '.js', '.mjs']);
const ExcludedPathParts = new Set(['node_modules', 'dist', '.git']);

const RiskPatterns: Array<{ code: string; pattern: RegExp; message: string }> = [
  {
    code: 'potable-certification-claim',
    pattern:
      /\b(certif(?:y|ies|ied|ication)|approve(?:s|d)?|safe to drink|drinkable)\b.{0,60}\b(potable|drinking water|water)\b/i,
    message: 'Content appears to claim potable-water certification or safety.',
  },
  {
    code: 'professional-approval-claim',
    pattern: /\bprofessional(?: engineering)?\b.{0,50}\b(approval|approved|certified|validated)\b/i,
    message: 'Content appears to claim professional approval.',
  },
  {
    code: 'production-manufacturing-claim',
    pattern: /\b(production manufacturing|manufacturing|production[- ]ready)\b.{0,50}\b(approval|approved|certified|ready)\b/i,
    message: 'Content appears to claim production manufacturing approval or readiness.',
  },
  {
    code: 'permit-ready-claim',
    pattern: /\bpermit[- ]ready\b/i,
    message: 'Content appears to claim permit-ready output.',
  },
];

const DisclaimerPattern =
  /\b(no|not|never|without|cannot|can't|does not|do not|must not|is not|are not|non-claim|nonclaims|no-go|claim|claims|blocked|blocker|fail|fails|gate|scanner|scan|prevent|avoid|risk|prohibition)\b/i;

export function scanNoProfessionalClaims(root = '.'): {
  ok: boolean;
  findings: ClaimScanFinding[];
  scannedFiles: number;
} {
  const files = listScanFiles(root);
  const findings = files.flatMap((file) => scanFile(root, file));
  return {
    ok: findings.length === 0,
    findings,
    scannedFiles: files.length,
  };
}

export function scanTextForNoProfessionalClaims(file: string, text: string): ClaimScanFinding[] {
  return text
    .split(/\r?\n/)
    .flatMap((line, index) =>
      RiskPatterns.filter(({ pattern }) => pattern.test(line) && !DisclaimerPattern.test(line)).map(
        ({ code, message }) => ({
          file,
          line: index + 1,
          code,
          message,
          excerpt: line.trim().slice(0, 240),
          severity: 'blocker' as const,
        }),
      ),
    );
}

function listScanFiles(root: string): string[] {
  const repoRoot = resolveRepoPath(root);
  const files: string[] = [];

  for (const scanRoot of ScanRoots) {
    const absolute = path.join(repoRoot, scanRoot);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.isFile()) {
      if (shouldScan(absolute)) files.push(absolute);
      continue;
    }
    walk(absolute, files);
  }

  return files.sort();
}

function walk(dir: string, files: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ExcludedPathParts.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (full.replaceAll(path.sep, '/').includes('/docs/project/')) continue;
    if (entry.isDirectory()) walk(full, files);
    else if (shouldScan(full)) files.push(full);
  }
}

function shouldScan(file: string) {
  if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) return false;
  return TextExtensions.has(path.extname(file));
}

function scanFile(root: string, absoluteFile: string): ClaimScanFinding[] {
  const repoRoot = resolveRepoPath(root);
  const relative = path.relative(repoRoot, absoluteFile).replaceAll(path.sep, '/');
  const text = fs.readFileSync(absoluteFile, 'utf8');
  return scanTextForNoProfessionalClaims(relative, text);
}
