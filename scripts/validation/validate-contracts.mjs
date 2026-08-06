import Ajv2020 from 'ajv/dist/2020.js';
import { readJson } from '../../packages/runner/src/lib.mjs';

const core = readJson('packages/contracts/schemas/gosp-core.schema.json');
const repSchema = readJson('packages/contracts/schemas/rep.schema.json');
const challenge = readJson('benchmarks/sandbox-001/challenge.json');
const submission = readJson('benchmarks/sandbox-001/baseline-submission.json');
const invalidSubmission = readJson('benchmarks/sandbox-001/invalid-submission.json');
const rep = readJson('benchmarks/sandbox-001/rep.json');

const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addSchema(core);
ajv.addSchema(repSchema);

const checks = [
  ['challenge', `${core.$id}#/$defs/Challenge`, challenge],
  ['baseline submission', `${core.$id}#/$defs/Submission`, submission],
  ['invalid semantic submission shape', `${core.$id}#/$defs/Submission`, invalidSubmission],
  ['REP manifest', repSchema.$id, rep]
];

let failures = 0;
for (const [name, schemaId, value] of checks) {
  const validate = ajv.getSchema(schemaId);
  if (!validate) throw new Error(`Schema not registered: ${schemaId}`);

  if (!validate(value)) {
    failures += 1;
    console.error(`[FAIL] ${name}`);
    console.error(JSON.stringify(validate.errors, null, 2));
  } else {
    console.log(`[PASS] ${name}`);
  }
}

if (failures > 0) process.exit(1);
console.log('Contract fixtures conform to Phase 0 schemas.');
