# Core Contracts

This document defines the initial contract set for GOSP Forge. Contracts should be implemented as TypeScript + Zod schemas in `packages/contracts`.

## ProblemDefinition

A project begins with a real-world problem.

```ts
type ProblemDefinition = {
  problemVersion: 1;
  problemId: string;
  title: string;
  domain: string;
  realWorldNeed: string;
  targetUsers: string[];
  constraints: Constraint[];
  successMetrics: Metric[];
  baselineSolutions: BaselineSolution[];
  allowedModes: DesignMode[];
  safetyProfileRef?: string;
  evidenceRequirements: EvidenceRequirement[];
};
```

## Constraint

```ts
type Constraint = {
  constraintId: string;
  label: string;
  type:
    | "budget"
    | "time"
    | "materials"
    | "tools"
    | "labor"
    | "site"
    | "safety"
    | "regulatory"
    | "performance"
    | "education"
    | "availability";
  value: unknown;
  unit?: string;
  required: boolean;
  notes: string;
};
```

## Metric

```ts
type Metric = {
  metricId: string;
  label: string;
  unit?: string;
  direction: "minimize" | "maximize" | "target";
  targetValue?: number;
  weight: number;
  explanation: string;
};
```

## BaselineSolution

```ts
type BaselineSolution = {
  baselineId: string;
  title: string;
  description: string;
  whyCommon: string;
  knownStrengths: string[];
  knownWeaknesses: string[];
  expectedMetrics: Record<string, unknown>;
  sourceRefs: string[];
};
```

## DesignMode

```ts
type DesignMode =
  | "dream"
  | "soft-simulation"
  | "scoring"
  | "professional"
  | "research"
  | "education";
```

## ModePolicy

```ts
type ModePolicy = {
  policyVersion: 1;
  mode: DesignMode;
  allowIncompleteProjects: boolean;
  allowUnverifiedProducts: boolean;
  allowUnfabricatedCustomParts: boolean;
  allowMissingCostData: boolean;
  allowMissing3DRepresentation: boolean;
  requireAttribution: boolean;
  requireSafetyProfile: boolean;
  requireSimulationConfidence: boolean;
  canSubmitToLeaderboard: boolean;
  canGenerateProfessionalReport: boolean;
  maxComputeClass: string;
};
```

## ProjectManifestV2

```ts
type ProjectManifestV2 = {
  manifestVersion: 2;
  projectId: string;
  projectTitle: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  designMode: DesignMode;
  problemDefinitionRef?: string;
  designDocument: DesignDocument;
  moduleRefs: string[];
  productBindingRefs: string[];
  graphRefs: string[];
  simulationRuns: SimulationRunSummary[];
  scorecards: string[];
  aiProposals: string[];
  metadata: {
    notes: string;
    author?: string;
    tags: string[];
  };
};
```

## DesignDocument

```ts
type DesignDocument = {
  designVersion: 1;
  designId: string;
  title: string;
  description: string;
  userAnnotations: string[];
  intendedUse: "education" | "prototype" | "game" | "research" | "professional-review";
  tags: string[];
};
```

## ModulePackage

```ts
type ModulePackage = {
  packageVersion: 1;
  moduleId: string;
  name: string;
  summary: string;
  moduleType:
    | "physical"
    | "digital"
    | "logical"
    | "process"
    | "service"
    | "economic"
    | "biological"
    | "hybrid";
  capabilities: ModuleCapabilities;
  attribution: ModuleAttribution;
  license: ModuleLicense;
  representationProfile?: RepresentationProfile;
  inputs: ModulePort[];
  outputs: ModulePort[];
  safetyProfile?: SafetyProfile;
  educationProfile?: EducationProfile;
  scorecard?: ModuleScorecard;
  validationStatus: ModuleTrustLevel;
};
```

## ModuleCapabilities

```ts
type ModuleCapabilities = {
  hasResourceFlowModel: boolean;
  hasControlLogic: boolean;
  hasPhysicalGeometry: boolean;
  has3DRepresentation: boolean;
  hasFabricationProfile: boolean;
  hasMaterialProfile: boolean;
  hasLaborProfile: boolean;
  hasManufacturingRoute: boolean;
  hasExecutableSimulation: boolean;
  hasCostModel: boolean;
  hasScoringProfile: boolean;
  hasEducationProfile: boolean;
  hasAttribution: boolean;
};
```

## RepresentationProfile

```ts
type RepresentationProfile = {
  representationVersion: 1;
  moduleId: string;
  representationModes: (
    | "none"
    | "symbolic-2d"
    | "symbolic-3d"
    | "proxy-3d"
    | "asset-3d"
    | "cad"
    | "animated"
    | "dashboard"
    | "node-graph"
  )[];
  defaultRepresentation: string;
  visualNotes: string;
  assetRefs: string[];
};
```

## ModuleAttribution

```ts
type ModuleAttribution = {
  attributionVersion: 1;
  creatorId: string;
  creatorDisplayName: string;
  organization?: string;
  originalCreatedAtUtc: string;
  contributors: {
    contributorId: string;
    displayName: string;
    contributionType:
      | "design"
      | "simulation"
      | "fabrication"
      | "documentation"
      | "testing"
      | "data"
      | "remix"
      | "review";
    contributionSummary: string;
  }[];
  parentModuleIds: string[];
  remixOf?: string;
  citationText: string;
};
```

## ModuleLicense

```ts
type ModuleLicense = {
  licenseVersion: 1;
  licenseId:
    | "MIT"
    | "Apache-2.0"
    | "GPL-3.0"
    | "CC-BY-4.0"
    | "CC-BY-SA-4.0"
    | "CERN-OHL-S-2.0"
    | "CERN-OHL-W-2.0"
    | "CERN-OHL-P-2.0"
    | "custom";
  attributionRequired: boolean;
  commercialUseAllowed: boolean;
  derivativeWorksAllowed: boolean;
  shareAlikeRequired: boolean;
  licenseTextRef?: string;
};
```

## ProductBinding

```ts
type ProductBinding = {
  bindingVersion: 1;
  productId: string;
  moduleId: string;
  manufacturerName: string;
  productName: string;
  modelNumber: string;
  category: string;
  datasheetRefs: string[];
  specs: ProductSpec[];
  geometryProfileRef?: string;
  costEstimateRef?: string;
  availabilityProfileRef?: string;
  warrantyProfileRef?: string;
  compatibilityRules: string[];
  provenance: ProductProvenance;
  sponsorship?: SponsorDisclosure;
};
```

## ProductSpec

```ts
type ProductSpec = {
  specId: string;
  label: string;
  value: number | string | boolean;
  unit?: string;
  meaning: string;
  affects: string[];
  simulationUse:
    | "capacity"
    | "cost"
    | "energy"
    | "flow"
    | "labor"
    | "safety"
    | "geometry"
    | "maintenance"
    | "lifespan"
    | "compatibility";
  sourceRef?: string;
  confidence: "low" | "medium" | "high";
};
```

## ProductProvenance

```ts
type ProductProvenance = {
  source: "community" | "manufacturer" | "distributor" | "expert-reviewed";
  verifiedByManufacturer: boolean;
  reviewedByExpert: boolean;
  lastVerifiedUtc: string;
  simulationConfidence: "low" | "medium" | "high";
};
```

## SafetyProfile

```ts
type SafetyProfile = {
  safetyVersion: 1;
  moduleId?: string;
  safetyLevel: "classroom-safe" | "supervised" | "restricted" | "professional-only" | "not-for-real-world-use";
  hazards: string[];
  requiredPpe: string[];
  ageGuidance?: string;
  warnings: string[];
  reviewRequired: boolean;
};
```

## EducationProfile

```ts
type EducationProfile = {
  educationVersion: 1;
  moduleId?: string;
  gradeBands: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  learningObjectives: string[];
  estimatedClassTimeMinutes?: number;
  teamSize?: number;
  teacherNotes: string[];
  studentInstructionsRef?: string;
};
```

## ModuleTrustLevel

```ts
type ModuleTrustLevel =
  | "draft"
  | "simulated"
  | "fabricated"
  | "tested"
  | "reviewed"
  | "field-used"
  | "restricted"
  | "deprecated"
  | "removed";
```

## SimulationConfidence

```ts
type SimulationConfidence = {
  confidenceVersion: 1;
  level:
    | "conceptual"
    | "estimated"
    | "model-based"
    | "catalog-backed"
    | "manufacturer-verified"
    | "tested"
    | "reviewed"
    | "field-validated";
  knownInputs: string[];
  defaultedInputs: string[];
  unknownInputs: string[];
  limitations: string[];
};
```
