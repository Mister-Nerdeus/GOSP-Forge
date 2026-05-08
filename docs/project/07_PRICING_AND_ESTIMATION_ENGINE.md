# Pricing and Estimation Engine

## Thesis

GOSP Forge should be usable as a flexible, real-world, assumption-based pricing and estimation tool for projects ranging from a classroom STEM build to a solar farm or whole community.

The pricing engine should combine:

- manufactured products
- custom fabricated parts
- materials
- labor
- manufacturing steps
- installation steps
- equipment rental
- regional price packs
- lifecycle cost
- maintenance
- replacement
- risk and contingency
- simulation confidence

## What pricing should output

A cost estimate should include:

```text
BOM
quantity takeoff
manufactured product costs
custom fabrication costs
machine time
labor-hours
people required
installation time
operating cost
maintenance cost
replacement reserve
lifecycle cost
risk/contingency
confidence
assumptions
source data
```

## Estimate classes

| Estimate Class | Use |
|---|---|
| Educational | teaching and STEM learning |
| Concept | early feasibility |
| Comparative | compare options and variants |
| Budgetary | rough planning |
| Quoted | supplier/contractor quotes attached |
| Professional reviewed | reviewed evidence package |

The platform should not claim permit-ready or professionally approved estimates unless a proper professional workflow exists.

## PricePack

Regional pricing matters.

```ts
type PricePack = {
  pricePackVersion: 1;
  pricePackId: string;
  title: string;
  region: string;
  currency: string;
  laborRates: LaborRate[];
  materialPrices: MaterialPrice[];
  utilityRates: UtilityRate[];
  equipmentRentalRates: EquipmentRentalRate[];
  taxAssumptions: TaxAssumption[];
  shippingAssumptions: ShippingAssumption[];
  lastUpdatedUtc: string;
  confidence: "low" | "medium" | "high";
};
```

## LaborRate

```ts
type LaborRate = {
  role: string;
  hourlyRate: number;
  burdenMultiplier: number;
  region?: string;
  confidence: "low" | "medium" | "high";
};
```

## MaterialPrice

```ts
type MaterialPrice = {
  materialId: string;
  unit: string;
  unitCost: number;
  source: "generic" | "supplier" | "manufacturer" | "community" | "quote";
  lastVerifiedUtc?: string;
};
```

## CostEstimate

```ts
type CostEstimate = {
  estimateVersion: 1;
  estimateId: string;
  projectId?: string;
  moduleId?: string;
  estimateClass: "educational" | "concept" | "comparative" | "budgetary" | "quoted" | "professional-reviewed";
  currency: string;
  capex: CostLine[];
  opex: CostLine[];
  labor: LaborCostLine[];
  manufacturing: CostLine[];
  maintenance: CostLine[];
  replacement: CostLine[];
  contingency: CostLine[];
  totalEstimatedCost: number;
  lifecycleCost?: LifecycleCost;
  assumptions: string[];
  confidence: "low" | "medium" | "high";
  sourceRefs: string[];
};
```

## CostLine

```ts
type CostLine = {
  lineId: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  source: "default" | "price-pack" | "manufacturer" | "supplier" | "quote" | "community";
  confidence: "low" | "medium" | "high";
};
```

## QuantityTakeoff

```ts
type QuantityTakeoff = {
  takeoffVersion: 1;
  takeoffId: string;
  projectId: string;
  items: {
    itemId: string;
    description: string;
    quantity: number;
    unit: string;
    derivedFrom: string;
    confidence: "low" | "medium" | "high";
  }[];
};
```

## LifecycleCost

```ts
type LifecycleCost = {
  lifecycleVersion: 1;
  horizonYears: number;
  upfrontCost: number;
  annualOperatingCost: number;
  annualMaintenanceCost: number;
  scheduledReplacementCost: number;
  estimatedTotalLifecycleCost: number;
  notes: string[];
};
```

## Solar farm example

A solar farm cost estimate should include:

- land/site preparation
- panels
- racking
- inverters
- wiring
- conduit
- trenching
- transformers
- monitoring
- roads
- fencing
- foundations
- labor
- equipment rental
- grid connection assumptions
- maintenance
- replacement
- degradation
- lifecycle cost

Swapping panels should affect:

- panel cost
- energy output
- land usage
- racking
- labor
- wiring
- inverter compatibility
- maintenance
- lifecycle cost
- confidence

## Variant and swap pricing

Every project should support variants:

```text
Baseline
Variant A
Variant B
Variant C
```

Each variant should show:

- cost delta
- performance delta
- labor delta
- schedule delta
- maintenance delta
- lifecycle delta
- risk delta
- confidence delta

## Estimate confidence policy

Estimates should show data source quality.

| Confidence | Example |
|---|---|
| Low | generic default prices |
| Medium | catalog product prices |
| High | manufacturer specs + verified regional price pack |
| Professional | quotes and expert review attached |

## Manufactured vs custom cost

### Manufactured product

Cost comes from:

- manufacturer MSRP
- distributor/supplier data
- quotes
- product catalog
- availability/lead time

### Custom part

Cost comes from:

- material
- machine time
- setup
- labor
- inspection
- rework risk
- assembly
- post-processing

## Use in education

Students should see:

- what each item costs
- why specs matter
- how swaps change total cost
- why labor matters
- why maintenance and replacement matter

## Use in professional contexts

Professional users should see:

- assumptions
- source data
- confidence
- quote status
- limitations
- exportable estimate package

## Non-negotiable warning

GOSP Forge estimates are transparent, assumption-based outputs. Real procurement, construction, engineering, safety, and permitting decisions require professional review.
