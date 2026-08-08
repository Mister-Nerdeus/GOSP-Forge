import { describe, expect, it } from 'vitest';
import { repCommand } from './rep.js';

const record = 'examples/rep/sandbox-001.replay.json';

describe('REP CLI command', () => {
  it('evaluates and replays a recorded input', () => {
    expect(repCommand('evaluate', record)).toMatchObject({ ok: true, action: 'evaluate' });
    expect(repCommand('replay', record)).toMatchObject({
      ok: true,
      action: 'replay',
      inputHashMatches: true,
      resultHashMatches: true,
    });
  });

  it('rejects incomplete usage', () => {
    expect(repCommand('replay', '')).toEqual({
      ok: false,
      error: 'usage: gosp rep <evaluate|replay> <record.json>',
    });
  });
});
