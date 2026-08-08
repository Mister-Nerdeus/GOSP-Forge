import { RepReplayRecordSchema } from '@gosp/contracts';
import { replayRep, runSandbox001 } from '@gosp/sim-core';
import { readJsonFile } from '../exampleRegistry.js';

export function repCommand(action: string, file: string) {
  if (!['evaluate', 'replay'].includes(action) || !file) {
    return { ok: false, error: 'usage: gosp rep <evaluate|replay> <record.json>' };
  }

  const record = RepReplayRecordSchema.parse(readJsonFile(file));
  if (action === 'evaluate') {
    const evaluated = runSandbox001(record.materialInput);
    return { ok: true, action, record: file, ...evaluated };
  }

  return { action, record: file, ...replayRep(record) };
}
