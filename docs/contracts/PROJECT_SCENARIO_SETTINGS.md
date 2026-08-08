# Project Scenario Settings

`ProjectManifestV2.scenarioSettings` is a domain-neutral compatibility surface. It may contain an exact canonical `Scenario` reference and generic parameters.

Vertical-specific extension data is accepted during migration but is interpreted only by the owning vertical. Generic contracts and runners do not inspect vertical extension keys.

New protocol work should use the first-class canonical `Scenario` object, which binds system elements, environment, components, schedules, operating conditions, assumptions, parameters, datasets, model choice, and constraints.
