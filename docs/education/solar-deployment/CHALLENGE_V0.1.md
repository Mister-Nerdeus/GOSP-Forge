# Retractable Flexible-Solar Deployment Challenge — Synthetic Educational v0.1

Status: **Working educational challenge on `cipher/solar-multiobjective`; not physically validated**

## Purpose

This challenge turns the retractable flexible-solar concept into a reproducible GOSP Forge STEM exercise. Ten school teams may explore different deployment and control designs while the first digital benchmark holds the panel specification, weather/environment, soiling condition, and hazard threshold fixed.

The first digital round uses **synthetic educational values only**. It does not establish that any manufacturer panel can safely be rolled, that a mechanism is structurally safe, or that the modeled cleaning or storm behavior will occur in the real world.

## Central engineering question

> Under the same synthetic panel and environment, what retractable deployment design gives the strongest defensible tradeoff among modeled solar power, bend-radius margin, storm-stow response, deployment speed, stow speed, and cleaning recovery — and what evidence is still required before anyone should trust it physically?

## Why the environment is controlled

Teams must not improve a score by silently changing sunlight, wind, panel rating, bend specification, or starting soiling. Those belong to the controlled Scenario in v0.1.

Teams may initially vary design choices such as:

- deployed fraction;
- roll-core radius;
- deployment time;
- stow time;
- wind-stow trigger;
- sensor latency assumption;
- controller latency assumption;
- modeled cleaning-recovery fraction.

Later challenge revisions may deliberately add tracking geometry, actuator energy, mass, cost, structural loads, fatigue, hail, precipitation, wiring flex, storage geometry, and measured manufacturer data as separately sourced/modelled dimensions.

## Current digital hard gates

A candidate cannot dominate if it fails a hard gate.

1. REP evaluation completes successfully.
2. Modeled bend-radius margin is nonnegative:
   `coreRadius - minimumBendRadius >= 0`.
3. Modeled storm-stow timing margin is nonnegative.
4. The simplified temperature factor remains positive.
5. The submitted panel/environment/soiling/hazard boundary matches the controlled Scenario exactly.

Passing these gates does **not** mean a physical design is safe. It only means the candidate passes the current synthetic screening rules.

## Current objectives

The challenge is deliberately multi-objective. GOSP should show Pareto-style tradeoffs rather than force every design into one universal score.

| Objective | Direction | Current result path |
|---|---|---|
| Modeled instantaneous solar power | Maximize | `result.power.instantaneousPowerW` |
| Storm-stow timing margin | Maximize | `result.storm.stowTimeMarginSeconds` |
| Bend-radius margin | Maximize | `result.deployment.bendRadiusMarginM` |
| Deployment time | Minimize | `result.deployment.deployTimeSeconds` |
| Stow time | Minimize | `result.deployment.stowTimeSeconds` |
| Modeled cleaning power recovery | Maximize | `result.power.cleaningRecoveredPowerW` |

A design may be better on some objectives and worse on others. That outcome should be reported as a **tradeoff**, not hidden behind a single score.

## Current analytical relationships

### Solar power screening

```text
P = Prated
    * (irradiance / 1000)
    * max(0, cos(incidenceAngle))
    * [1 + temperatureCoefficient * (cellTemperature - referenceTemperature)]
    * (1 - soilingLoss)
    * deployedFraction
```

This is a reduced analytical educational relationship, not a manufacturer or IEC/STC verification.

### Bend-radius margin

```text
bendRadiusMargin = coreRadius - minimumBendRadius
```

This checks only the stated geometric bend-radius condition. It does not model laminate fatigue, repeated cycles, local wrinkling, wiring, adhesives, or complete roll mechanics.

### Storm-stow timing

```text
availableTime =
  (hazardWindThreshold - currentWind)
  / modeledWindRiseRate

requiredResponseTime =
  sensorLatency
  + controllerLatency
  + stowTime

stowTimeMargin =
  availableTime - requiredResponseTime
```

The wind-rise rate is synthetic in v0.1. This is a controls/timing exercise, not a weather forecast or safety certification.

### Cleaning recovery

The model reduces the starting synthetic soiling loss by a submitted modeled cleaning-recovery fraction, bounded at zero soiling loss, then recomputes screened power.

This is an assumption to investigate. It is not measured cleaning effectiveness.

## Ten-school competition structure

The recommended educational deployment is ten teams using the same challenge package and shared GOSP evidence rules.

Each school should receive the same baseline digital problem, documentation, safety rules, control-tool guidance, and comparable core materials budget. When physical kits are eventually assembled, manufacturer donations and general-purpose tools should be distributed as evenly as practical so the competition measures engineering decisions rather than unequal access.

Suggested stages:

1. **Understand** — identify the problem, assumptions, unknowns, and current non-claims.
2. **Model** — reproduce the baseline equations and result.
3. **Design** — create candidate deployment/control concepts.
4. **Compare** — use GOSP multi-objective comparison and hard gates.
5. **Sensitivity** — determine which assumptions control the result.
6. **Document** — explain why the design changed and what evidence supports it.
7. **Prototype** — only after a physical-kit specification and safety plan are separately approved.
8. **Measure** — collect real deployment, power, cleaning, and durability data.
9. **Reconcile** — compare simulation with physical results, including failures.
10. **Combine** — identify which ideas from different teams can form a stronger shared design rather than treating the winner as the only useful result.

## Learning-depth mapping

The same challenge can support the canonical GOSP learning progression.

### Explore

Visualize deployment, roll radius, sunlight angle, cleaning, and emergency stow behavior.

### Measure

Work with watts, seconds, meters, wind speed, angles, fractions, and percentage changes.

### Model

Use trigonometry, rates, ratios, temperature corrections, and controlled-variable comparisons.

### Solve

Optimize multiple objectives, write control logic, calculate sensitivity, and create parametric designs.

### Verify

Reproduce runs, inspect hashes/model identity, challenge assumptions, and compare with measured prototype data.

### Research / Professional

Extend the model with sourced material behavior, structural dynamics, cycle fatigue, reliability, uncertainty, standards, test plans, and independent review.

## Evidence rules

Teams must distinguish:

- synthetic inputs;
- manufacturer-sourced specifications;
- calculations;
- simulation;
- independent reproduction;
- measured prototype evidence;
- expert review;
- professional approval;
- certification.

No result may move from one category to another merely because it scored well.

Failure is evidence. A torn panel, jammed mechanism, false trigger, slow stow, bad cleaning result, overheated component, or simulation mismatch should be preserved with the exact design version and test conditions.

## Manufacturer-data transition

Manufacturer products may later be introduced as sourced ComponentData records. For every property used by an evaluator, GOSP should retain the source, product/version identity where available, retrieval date, units, scope, and evidence status.

A public product page or marketing statement is not automatically a verified engineering property. The challenge should test the underlying engineering question rather than inherit promotional claims.

## Physical-round proof obligations still open

Before a real mechanism is treated as anything beyond an educational prototype, the challenge would need additional evidence for at least:

- allowable bend radius and repeated roll-cycle behavior for the exact panel construction;
- mechanical stresses and support geometry;
- actuator torque/force and fail-safe behavior;
- cable/connector flex life and electrical protection;
- wind loading and dynamic response;
- stow reliability under realistic gust behavior;
- hail, rain, dust, ice, temperature, and contamination effects where relevant;
- cleaning effectiveness and abrasion risk;
- emergency/manual recovery;
- electrical and fire safety;
- applicable professional, laboratory, code, or certification review for the intended deployment.

Those obligations are intentionally outside v0.1 rather than silently assumed solved.

## Current implementation mapping

The working implementation lives in:

```text
packages/vertical-solar-deployment/
packages/api/src/phase1a/evaluatorRegistry.ts
packages/api/src/phase1a/service.ts
packages/contracts/src/application/phase1a.ts
```

The working branch is:

```text
cipher/solar-multiobjective
```

The exact branch must pass local repository verification and focused code review before any canonical merge or status upgrade.
