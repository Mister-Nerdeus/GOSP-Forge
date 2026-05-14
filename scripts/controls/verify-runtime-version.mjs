import fs from 'node:fs';
import path from 'node:path';

function readText(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8').trim();
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function parseToolVersions(text) {
  const entries = new Map();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [tool, version] = trimmed.split(/\s+/, 2);
    entries.set(tool, version);
  }
  return entries;
}

function majorFromVersion(value) {
  const match = String(value).match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

const packageJson = readJson('package.json');
const policy = packageJson.gosp?.runtimePolicy;

if (!policy) {
  console.error(JSON.stringify({ ok: false, error: 'missing package.json gosp.runtimePolicy' }));
  process.exit(1);
}

const preferred = Number(policy.preferredNodeMajor);
const temporary = (policy.temporarySupportedNodeMajors ?? []).map(Number);
const supported = [preferred, ...temporary].sort((a, b) => a - b);
const actual = majorFromVersion(process.versions.node);
const nvmrc = majorFromVersion(readText('.nvmrc'));
const toolVersions = parseToolVersions(readText('.tool-versions'));
const asdfNode = majorFromVersion(toolVersions.get('nodejs'));
const engineRange = packageJson.engines?.node;

const errors = [];
if (!Number.isInteger(preferred)) errors.push('preferredNodeMajor must be an integer');
if (nvmrc !== preferred) errors.push(`.nvmrc declares Node ${nvmrc}, expected preferred Node ${preferred}`);
if (asdfNode !== preferred) errors.push(`.tool-versions declares Node ${asdfNode}, expected preferred Node ${preferred}`);
if (!engineRange) errors.push('package.json engines.node is required');
if (!supported.includes(actual)) errors.push(`Current Node ${actual} is not declared in runtime policy`);

const result = {
  ok: errors.length === 0,
  node: process.version,
  actualMajor: actual,
  preferredNodeMajor: preferred,
  temporarySupportedNodeMajors: temporary,
  supportedNodeMajors: supported,
  declarations: {
    packageEnginesNode: engineRange,
    nvmrcNodeMajor: nvmrc,
    toolVersionsNodeMajor: asdfNode,
  },
  errors,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
