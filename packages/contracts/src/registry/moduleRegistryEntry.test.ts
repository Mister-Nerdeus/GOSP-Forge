import { describe, expect, it } from 'vitest';
import { ModuleRegistryEntrySchema } from './moduleRegistryEntry.js';

const baseEntry = {
  moduleId: 'pump',
  version: '0.1.0',
  trustLevel: 'simulated',
  moderationStatus: 'approved',
  license: {
    id: 'CC-BY-4.0',
    shareAlike: false,
  },
  attribution: {
    creators: [{ name: 'GOSP Forge' }],
    sourceRefs: [],
  },
};

describe('ModuleRegistryEntrySchema', () => {
  it('accepts visible trust and moderation status', () => {
    expect(ModuleRegistryEntrySchema.safeParse(baseEntry).success).toBe(true);
  });

  it('requires safety and moderation reasons for restricted entries', () => {
    expect(
      ModuleRegistryEntrySchema.safeParse({
        ...baseEntry,
        trustLevel: 'restricted',
        moderationStatus: 'restricted',
      }).success,
    ).toBe(false);

    expect(
      ModuleRegistryEntrySchema.safeParse({
        ...baseEntry,
        trustLevel: 'restricted',
        moderationStatus: 'restricted',
        safetyReason: 'Requires supervised review.',
        moderationReason: 'Restricted pending safety review.',
      }).success,
    ).toBe(true);
  });

  it('preserves an audit record for removed entries', () => {
    expect(
      ModuleRegistryEntrySchema.safeParse({
        ...baseEntry,
        trustLevel: 'removed',
        moderationStatus: 'removed',
        moderationReason: 'Removed for unsafe claim.',
      }).success,
    ).toBe(false);

    expect(
      ModuleRegistryEntrySchema.safeParse({
        ...baseEntry,
        trustLevel: 'removed',
        moderationStatus: 'removed',
        moderationReason: 'Removed for unsafe claim.',
        auditRecord: [
          {
            at: '2026-05-14T00:00:00.000Z',
            status: 'removed',
            reason: 'Removed for unsafe claim.',
          },
        ],
      }).success,
    ).toBe(true);
  });
});
