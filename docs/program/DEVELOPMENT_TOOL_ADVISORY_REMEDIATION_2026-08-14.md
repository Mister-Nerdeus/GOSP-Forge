# Development-Tool Advisory Remediation

Date: 2026-08-14 (America/New_York)
Status: Included in the locally verified publication candidate; publication remains owner-gated

## Starting observation

The complete `pnpm audit --json` result reported 16 development-tool advisories: 12 high, 3 moderate, and 1 low. `pnpm audit --prod --json` reported zero production dependency advisories.

Affected transitive packages were `brace-expansion`, `js-yaml`, `nanoid`, `postcss`, `vite`, and `esbuild`. Their observed paths were limited to lint, TypeScript lint integration, test, build, and local development tooling.

## Remediation

The maintenance refresh stayed on the existing major lines:

| Direct dependency | Previous resolved version | Remediated range / resolved version |
| --- | --- | --- |
| `tsx` | 4.21.0 | `^4.23.12` / 4.23.12 |
| `typescript-eslint` | 8.59.2 | `^8.67.0` / 8.67.0 |
| `vite` | 7.3.3 | `^7.3.6` / 7.3.6 |
| `vitest` | 4.1.5 | `^4.1.10` / 4.1.10 |
| `eslint` | 9.39.4 | `^9.39.5` / 9.39.5 |
| `@eslint/js` | 9.39.4 | `^9.39.5` / 9.39.5 |
| `@types/node` | 25.6.2 | `^25.9.5` / 25.9.5 |

The resolved transitive fixes include `brace-expansion` 1.1.18 and 5.0.9, `js-yaml` 4.3.1, `nanoid` 3.3.18, `postcss` 8.5.26, and `esbuild` 0.28.2.

No Vite, Vitest, ESLint, typescript-eslint, tsx, TypeScript, pnpm, Node, or Zod major-version transition was performed. TypeScript remains 5.9.3, Zod remains 3.25.76, and pnpm remains 9.15.5.

## Executed audit result

- Complete `pnpm audit --json`: exit 0; 0 info, 0 low, 0 moderate, 0 high, and 0 critical advisories.
- Production-only `pnpm audit --prod --json`: exit 0; 0 advisories.
- Frozen-lockfile install: exit 0.

The package audit is registry advisory evidence for the resolved dependency graph. It does not prove that the repository has no security defect.

## Material-identity boundary

The REP source-implementation manifests bind the relevant resolved toolchain/runtime identities to TypeScript 5.9.3 and Zod 3.25.76. Those identities were not changed by this maintenance refresh. Material-result and source-implementation identity readers must nevertheless be rerun after the lockfile change, and any mismatch is a stop condition.

## Verification executed

- `pnpm verify`: exit 0 on Node v22.16.0, which is temporarily supported by repository policy.
- Test discovery: 31 intended / 31 discovered; 139 tests passed.
- Foundation audit: `GO`, 23 pass / 0 warn / 0 fail; final candidate scan checked 213 files with zero claim findings.
- `node scripts/phase-0b/read-material-results.mjs`: exit 0; sandbox and Clean Water protected hashes and source-implementation identities unchanged.
- `node scripts/phase-1a/read-product-loop-results.mjs`: exit 0; both evaluations replayed and compared successfully.
- Documentation link check: 352 Markdown files inspected and 115 relative links checked, zero missing.
- `git diff --check`: exit 0.
- Live local browser smoke: complete Phase-1A surface rendered; Challenge creation and Submission import/evaluation succeeded; zero console errors observed.

Docker/Linux was not rerun because no REP source, canonical contract, TypeScript version, Zod version, or material source-implementation identity changed. This Windows result does not create a new cross-environment reproduction claim.
