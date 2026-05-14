import { describe, expect, it } from 'vitest';
import { ScoringProfileSchema } from './scoringProfile.js';

const baseProfile = {
  kind: 'ScoringProfile',
  id: 'clean-water-neutral-profile',
  version: '0.1.0',
  sponsorNeutral: true,
  components: [
    {
      id: 'clean-water-volume',
      label: 'Clean water volume',
      weight: 1,
      formula: 'min(cleanWaterLiters / targetLiters, 1)',
      source: 'simulation output',
    },
  ],
};

describe('ScoringProfileSchema sponsor neutrality', () => {
  it('accepts sponsor-neutral profiles', () => {
    expect(ScoringProfileSchema.safeParse(baseProfile).success).toBe(true);
  });

  it('requires the sponsorNeutral flag to be true', () => {
    expect(
      ScoringProfileSchema.safeParse({
        ...baseProfile,
        sponsorNeutral: false,
      }).success,
    ).toBe(false);
  });

  it('rejects sponsor status in scoring formulas', () => {
    expect(
      ScoringProfileSchema.safeParse({
        ...baseProfile,
        components: [
          {
            ...baseProfile.components[0],
            formula: 'sponsored ? 100 : cleanWaterLiters',
          },
        ],
      }).success,
    ).toBe(false);
  });

  it('rejects sponsor status in labels and sources', () => {
    expect(
      ScoringProfileSchema.safeParse({
        ...baseProfile,
        components: [
          {
            ...baseProfile.components[0],
            label: 'Sponsor bonus',
            source: 'sponsorship tier',
          },
        ],
      }).success,
    ).toBe(false);
  });
});
