import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { canonicalJson } from '../hash/canonicalJson.js';
import { sha256 } from '../hash/sha256.js';

export const SOURCE_IMPLEMENTATION_IDENTITY_FORMAT = 'gosp-source-implementation-v1' as const;

export type SourceImplementationInput = {
  id: string;
  revision: string;
  files: Array<{ path: string; content: string }>;
  toolchain: Record<string, string>;
  runtimeDependencies: Record<string, string>;
};

export type SourceImplementationSpec = {
  kind: 'runner' | 'solver';
  id: string;
  revision: string;
  sourcePaths: readonly string[];
};

function normalizeSourceContent(content: string) {
  return content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function normalizedRelativePath(value: string) {
  const normalized = value.replaceAll('\\', '/');
  if (
    normalized.length === 0 ||
    normalized.startsWith('/') ||
    /^[A-Za-z]:\//.test(normalized) ||
    normalized.split('/').includes('..')
  ) {
    throw new Error(`Source implementation paths must be repository-relative: ${value}`);
  }
  return normalized;
}

export function createSourceImplementationManifest(input: SourceImplementationInput) {
  const seen = new Set<string>();
  const files = input.files
    .map((file) => {
      const relativePath = normalizedRelativePath(file.path);
      if (seen.has(relativePath)) {
        throw new Error(`Duplicate source implementation path: ${relativePath}`);
      }
      seen.add(relativePath);
      return {
        path: relativePath,
        contentHash: sha256(normalizeSourceContent(file.content)),
      };
    })
    .sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));

  return {
    format: SOURCE_IMPLEMENTATION_IDENTITY_FORMAT,
    id: input.id,
    revision: input.revision,
    files,
    toolchain: input.toolchain,
    runtimeDependencies: input.runtimeDependencies,
  };
}

export function sourceImplementationContentHash(input: SourceImplementationInput) {
  return sha256(canonicalJson(createSourceImplementationManifest(input)));
}

function findWorkspaceRoot() {
  let current = path.dirname(fileURLToPath(import.meta.url));
  for (;;) {
    if (fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('Unable to locate the GOSP Forge workspace root.');
    current = parent;
  }
}

function installedPackageVersion(packageName: string) {
  const require = createRequire(import.meta.url);
  let current = path.dirname(require.resolve(packageName));
  for (;;) {
    const packageJsonPath = path.join(current, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
        name?: string;
        version?: string;
      };
      if (packageJson.name === packageName && packageJson.version) return packageJson.version;
    }
    const parent = path.dirname(current);
    if (parent === current) throw new Error(`Unable to resolve installed package ${packageName}.`);
    current = parent;
  }
}

function sourceImplementationInput(spec: SourceImplementationSpec): SourceImplementationInput {
  const root = findWorkspaceRoot();
  return {
    id: spec.id,
    revision: spec.revision,
    files: spec.sourcePaths.map((sourcePath) => ({
      path: normalizedRelativePath(sourcePath),
      content: fs.readFileSync(path.join(root, sourcePath), 'utf8'),
    })),
    toolchain: { typescript: installedPackageVersion('typescript') },
    runtimeDependencies: { zod: installedPackageVersion('zod') },
  };
}

export function loadSourceImplementationManifest(spec: SourceImplementationSpec) {
  return createSourceImplementationManifest(sourceImplementationInput(spec));
}

export function sourceImplementationIdentity(spec: SourceImplementationSpec) {
  return {
    kind: spec.kind,
    id: spec.id,
    revision: spec.revision,
    contentHash: sourceImplementationContentHash(sourceImplementationInput(spec)),
  };
}

export const REFERENCE_RUNNER_SOURCE_PATHS = [
  'tsconfig.base.json',
  'packages/contracts/tsconfig.json',
  'packages/contracts/src/shared/primitives.ts',
  'packages/contracts/src/shared/sourceRefs.ts',
  'packages/contracts/src/canonical/identity.ts',
  'packages/contracts/src/canonical/truthModel.ts',
  'packages/contracts/src/canonical/executionModel.ts',
  'packages/contracts/src/rep/rep.ts',
  'packages/sim-core/tsconfig.json',
  'packages/sim-core/src/hash/canonicalJson.ts',
  'packages/sim-core/src/hash/sha256.ts',
  'packages/sim-core/src/rep/sourceImplementationIdentity.ts',
  'packages/sim-core/src/rep/referenceRunner.ts',
] as const;

export const referenceRunnerSourceManifest = () =>
  loadSourceImplementationManifest({
    kind: 'runner',
    id: 'gosp.rep.reference-runner',
    revision: '0.1.0',
    sourcePaths: [...REFERENCE_RUNNER_SOURCE_PATHS],
  });
