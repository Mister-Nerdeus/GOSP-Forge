# Scope and Invariants

## Scope

GOSP Forge is a problem-first modular STEM systems simulator.

It should support:

- physical modules
- digital modules
- logic/control modules
- process modules
- service modules
- economic modules
- biological/agricultural modules
- manufactured products
- custom fabricated parts
- 3D/symbolic representation
- pricing and estimation
- labor and manufacturing simulation
- scoring and confidence
- open-source attribution and remixing
- sponsor-supported free public education

## In scope

### Problem-solving

- define real-world problems
- define constraints
- define metrics
- compare baseline solutions
- simulate user-created alternatives

### Modules

- physical product modules
- custom part modules
- software/digital modules
- logic/control modules
- manufacturing process modules
- economic/cost modules
- service modules

### Simulation

- resource flow
- cost
- labor
- manufacturing process
- material quantity
- lifecycle cost
- schedule
- maintenance
- failure modes
- compatibility
- scoring
- confidence

### Representation

- symbolic 2D
- symbolic 3D
- proxy 3D
- real 3D assets
- CAD/fabrication files when applicable
- dashboards
- node graphs
- timelines
- diagrams

### Fabrication

- STL/DXF/SVG/STEP references
- material specs
- BOM
- manufacturing routes
- machine time
- labor time
- people required
- skill level
- assembly instructions
- inspection/testing steps

### Education

- teacher guides
- student project modes
- difficulty levels
- safety levels
- classroom challenges
- free public school use

### Sponsorship

- AI credits
- cloud credits
- hosting
- hardware donations
- manufacturer spec submission
- module pack sponsorship
- challenge sponsorship

## Out of scope for early phases

The project should not begin by trying to build:

- full CAD software
- full CAM/G-code generation
- advanced FEA/CFD engine
- professional engineering approval
- permit-ready construction documents
- full Unreal/VR world
- unrestricted user code execution
- uncontrolled marketplace
- paid product ranking
- hidden scoring formulas

These may be future integrations or advanced modes, but not the initial scope.

## Core invariants

### Product invariants

1. GOSP Forge is problem-first.
2. A community is one possible assembly, not the base product.
3. Everything is a module, but not every module is physical.
4. 3D representation is a feature, not a requirement.
5. Manufactured products and custom parts must coexist.
6. Scoring must be transparent and mode-specific.
7. Public school teachers and students should have free core access.
8. Sponsors can support the commons but cannot own or control it.

### Simulation invariants

1. Same input + same seed + same model version = same deterministic result where deterministic mode applies.
2. All units must be explicit.
3. All assumptions must be visible.
4. All source data must declare provenance.
5. Every output must declare model fidelity.
6. Every estimate must declare confidence.
7. The simulator must not overstate accuracy.
8. The simulator should expose direct and downstream impacts.

### Module invariants

1. Every module must have identity.
2. Every module must have attribution.
3. Every module must declare license.
4. Every module must declare capabilities.
5. Every module must declare input/output interface if it participates in a system graph.
6. Every module must declare representation type.
7. Every module must declare validation status.
8. Every module must declare scoring status if scored.
9. Every module must preserve remix lineage.

### Manufactured product invariants

1. Verified product specs improve confidence, not ranking.
2. Manufacturer sponsorship cannot improve a product’s score.
3. Product listings must disclose source and verification status.
4. Community-submitted product data must remain possible.
5. Manufacturer-submitted specs should be importable by AI but human-verifiable.
6. Product specs should explain what they mean and what they affect.

### Custom fabrication invariants

1. Custom parts must expose materials.
2. Custom parts must expose manufacturing route if fabrication is simulated.
3. Manufacturing estimates must include machine time and labor time.
4. Fabrication confidence must be declared.
5. Safety notes are required for physical/fabricated modules.
6. Fabrication output is not guaranteed production-ready unless validated.

### Education invariants

1. Core public school access must be free.
2. Student privacy must be protected.
3. Student-facing outputs should be explainable.
4. Dangerous modules should be restricted or clearly marked.
5. Teacher modes should expose safety, learning objectives, time, and materials.

### Sponsor invariants

1. Sponsors cannot control scoring.
2. Sponsors cannot suppress competitors.
3. Sponsors cannot claim ownership of public modules.
4. Sponsored products/modules must be labeled.
5. Sponsor involvement must be disclosed.
6. Sponsor funding cannot buy governance majority.
7. In-kind support must be tracked and portable.

### AI invariants

1. AI proposes; simulation tests; evidence decides.
2. AI-generated outputs must be tagged.
3. AI cannot approve safety.
4. AI cannot alter scoring rules invisibly.
5. AI extraction of manufacturer specs must expose field confidence.
6. AI should cite source documents where possible.
7. AI should not hide missing data.

### Security invariants

1. User-uploaded assets must be treated as untrusted.
2. User-supplied executable logic must be sandboxed or disallowed.
3. File size, type, and processing limits are required.
4. Module submissions need trust levels.
5. Leaderboard scoring requires deterministic verification.
6. Safety-sensitive modules require moderation controls.
7. Attribution and license disputes require a takedown process.

## Key non-negotiable statement

> The platform should help people solve real-world problems using STEM, but it must never pretend an educational or conceptual simulation is professional engineering approval.
