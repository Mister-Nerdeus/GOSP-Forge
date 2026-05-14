import { describe, expect, it } from 'vitest';
import { AIProposalSchema } from './aiProposal.js';

const baseProposal = {
  kind: 'AIProposal',
  id: 'clean-water-module-ai-draft',
  proposalType: 'module-draft',
  draftStatus: 'draft',
  truthStatus: 'unreviewed-draft',
  sourceRefs: ['examples/projects/automated-water-filter.project-v2.json'],
  confidence: {
    level: 'low',
    rationale: 'AI draft based on incomplete example context.',
  },
  missingData: ['domain review', 'physical test data'],
  review: {
    status: 'pending-human-review',
    notes: ['Needs domain review before use.'],
  },
  proposedChange: {
    moduleId: 'filter-housing',
    summary: 'Draft note for review.',
  },
  limitations: ['Draft proposal only.', 'No potable-water or professional-use claim.'],
};

describe('AIProposalSchema', () => {
  it('accepts draft-plane AI proposals with review metadata', () => {
    const parsed = AIProposalSchema.parse(baseProposal);

    expect(parsed.draftStatus).toBe('draft');
    expect(parsed.truthStatus).toBe('unreviewed-draft');
    expect(parsed.sourceRefs).toHaveLength(1);
    expect(parsed.missingData).toContain('domain review');
  });

  it('rejects attempts to mark truth as approved', () => {
    expect(
      AIProposalSchema.safeParse({
        ...baseProposal,
        truthStatus: 'approved',
      }).success,
    ).toBe(false);
  });

  it('rejects AI review notes that claim verification', () => {
    expect(
      AIProposalSchema.safeParse({
        ...baseProposal,
        review: {
          status: 'pending-human-review',
          notes: ['AI verified this safety status.'],
        },
      }).success,
    ).toBe(false);
  });

  it('requires source refs and visible limitations', () => {
    expect(
      AIProposalSchema.safeParse({
        ...baseProposal,
        sourceRefs: [],
        limitations: [],
      }).success,
    ).toBe(false);
  });
});
