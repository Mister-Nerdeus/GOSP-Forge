import { RepReplayRecordSchema } from '@gosp/contracts';
import { runSandbox001 } from './sandbox001.js';

export function replayRep(rawRecord: unknown) {
  const record = RepReplayRecordSchema.parse(rawRecord);
  const evaluated = runSandbox001(record.materialInput);
  const inputHashMatches =
    !record.expectedMaterialInputHash ||
    record.expectedMaterialInputHash === evaluated.materialInputHash;
  const resultHashMatches =
    !record.expectedMaterialResultHash ||
    record.expectedMaterialResultHash === evaluated.materialResultHash;

  return {
    ok: inputHashMatches && resultHashMatches,
    inputHashMatches,
    resultHashMatches,
    ...evaluated,
  };
}
