# HouseSim Vertical

HouseSim Challenge is the first building-oriented vertical used to test GOSP Forge against a real, nontrivial domain.

The repository contains earlier HouseSim implementation files under `scripts/lib/`, `scripts/simulation/`, and `packages/fixtures/`. The Phase 0 rebaseline deliberately preserves them in place to avoid a risky code move before the new core contracts and runner are verified.

## Migration rule

HouseSim will progressively consume GOSP Forge contracts. The migration must not add house-specific concepts to universal core solely to preserve the old implementation shape.

Examples that stay vertical-specific include:

- bedrooms/bathrooms;
- Michigan climate assumptions;
- wall/roof R-values;
- HVAC/ERV/heat-pump details;
- CNC 4x8/4x12 sheet proxies;
- building-code/permitting assumptions;
- HouseSim score weights.

The existing HouseSim outputs remain planning/simulation estimates, not permit documents, professional approvals, fabrication instructions, construction quotes, or certification.
