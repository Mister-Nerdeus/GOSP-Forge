# Foundation UI Inspection

The builder UI foundation view is a read-only inspector for bundled example data. It does not edit projects, persist data, generate CAD, certify potable water, provide professional approval, or approve production manufacturing.

## Panels

- Project: manifest identity, mode, version, status, and required-ref count.
- Modules: bundled module list with type, validation status, and simulation/estimation/fabrication flags.
- Products: bundled product bindings with spec count, confidence level, provenance status, and sponsorship state.
- Safety: declared safety profiles and real-world use limits.
- Education: teacher/student guide reference count, grade bands, and visible learning objectives.
- Outputs: current foundation assumptions, confidence summaries, defaulted input counts, and limitations.

## Validation Boundary

The UI loads static examples bundled at build time. The CLI remains the source of validation, simulation, estimate, and audit behavior. UI inspection is intended to make foundation data visible before future editor or workflow claims are added.

## Claim Gate

The UI claim gate text preserves the foundation limitation: no CAD editing, persistence, manufacturing approval, professional validation, procurement guidance, or potable-water certification.
