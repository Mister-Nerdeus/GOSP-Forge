import fs from 'node:fs';
import path from 'node:path';

export const REQUIRED_TOP_LEVEL_FIELDS = [
  'scenarioId',
  'metadata',
  'location',
  'geometry',
  'foundation',
  'panelSystem',
  'cnc',
  'envelope',
  'openings',
  'mechanical',
  'solarBattery',
  'smartHome',
  'costAssumptions',
  'optimizationGoals'
];

export const SCORE_WEIGHTS = {
  ownershipCost: 25,
  energyPerformance: 20,
  cncEfficiency: 15,
  buildSimplicity: 15,
  permittingSimplicity: 10,
  comfortResilience: 10,
  repeatability: 5
};

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function listFixtureFiles() {
  const dir = path.resolve('packages/fixtures');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(dir, name))
    .sort();
}

export function validateScenario(scenario) {
  const errors = [];
  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in scenario)) errors.push(`Missing top-level field: ${field}`);
  }

  const geometry = scenario.geometry ?? {};
  for (const field of ['footprintWidthFt', 'footprintLengthFt', 'stories', 'wallHeightFt']) {
    if (typeof geometry[field] !== 'number' || geometry[field] <= 0) {
      errors.push(`geometry.${field} must be a positive number`);
    }
  }

  if (geometry.footprintWidthFt && geometry.footprintWidthFt % 2 !== 0) {
    errors.push('geometry.footprintWidthFt should follow 2 ft module discipline');
  }
  if (geometry.footprintLengthFt && geometry.footprintLengthFt % 2 !== 0) {
    errors.push('geometry.footprintLengthFt should follow 2 ft module discipline');
  }

  const cnc = scenario.cnc ?? {};
  if (!Array.isArray(cnc.sheetOptions) || cnc.sheetOptions.length === 0) {
    errors.push('cnc.sheetOptions must include at least one sheet option');
  } else {
    for (const option of cnc.sheetOptions) {
      if (![8, 12].includes(option.lengthFt) || option.widthFt !== 4) {
        errors.push(`Unsupported CNC sheet option: ${JSON.stringify(option)}`);
      }
    }
  }

  const envelope = scenario.envelope ?? {};
  for (const field of ['wallEffectiveR', 'roofR', 'basementWallR', 'airLeakageAch50']) {
    if (typeof envelope[field] !== 'number' || envelope[field] <= 0) {
      errors.push(`envelope.${field} must be a positive number`);
    }
  }

  if (!scenario.metadata?.modelLevel) {
    errors.push('metadata.modelLevel is required');
  }

  if (scenario.foundation?.basementBedroom === true && scenario.foundation?.egressStrategy !== 'provided') {
    errors.push('Basement bedroom requires egressStrategy: provided');
  }

  if (scenario.panelSystem?.structuralClaim === 'engineered-sip' && scenario.panelSystem?.engineerStamped !== true) {
    errors.push('Engineered SIP claim requires engineerStamped: true');
  }

  return errors;
}

export function simulateScenario(scenario) {
  const g = scenario.geometry;
  const openings = scenario.openings;
  const foundation = scenario.foundation;

  const footprintAreaSqFt = round(g.footprintWidthFt * g.footprintLengthFt);
  const conditionedFloorAreaSqFt = round(footprintAreaSqFt * g.stories);
  const perimeterFt = round(2 * (g.footprintWidthFt + g.footprintLengthFt));
  const grossWallAreaSqFt = round(perimeterFt * g.wallHeightFt * g.stories);
  const openingAreaSqFt = round((openings.windowAreaSqFt ?? 0) + (openings.doorAreaSqFt ?? 0));
  const netOpaqueWallAreaSqFt = round(Math.max(grossWallAreaSqFt - openingAreaSqFt, 0));
  const basementAreaSqFt = foundation.type === 'partial-basement'
    ? round((foundation.basementWidthFt ?? 0) * (foundation.basementLengthFt ?? 0))
    : 0;
  const roofAreaProxySqFt = round(footprintAreaSqFt * (scenario.geometry.roofAreaMultiplier ?? 1.12));
  const solarPlaneCandidateSqFt = round(roofAreaProxySqFt * (scenario.solarBattery.usableRoofPlaneRatio ?? 0.45));

  const cncResults = scenario.cnc.sheetOptions.map((sheet) => {
    const sheetArea = sheet.widthFt * sheet.lengthFt;
    const grossSheetCount = Math.ceil(netOpaqueWallAreaSqFt / sheetArea);
    const moduleBonus = g.footprintWidthFt % sheet.widthFt === 0 && g.footprintLengthFt % sheet.widthFt === 0 ? 0.96 : 1.08;
    const seamPenalty = sheet.lengthFt === 12 ? 0.94 : 1;
    const handlingPenalty = sheet.lengthFt === 12 ? 1.06 : 1;
    const estimatedSheetCount = Math.ceil(grossSheetCount * moduleBonus * seamPenalty);
    const usedArea = netOpaqueWallAreaSqFt;
    const purchasedArea = estimatedSheetCount * sheetArea;
    const wastePercent = round(Math.max((purchasedArea - usedArea) / purchasedArea, 0) * 100);
    return {
      sheet: `${sheet.widthFt}x${sheet.lengthFt}`,
      modelLevel: scenario.metadata.modelLevel,
      estimatedSheetCount,
      wastePercent,
      handlingPenalty,
      note: 'Deterministic proxy only; not full nesting.'
    };
  });

  const warnings = buildWarnings(scenario, { openingAreaSqFt, grossWallAreaSqFt, cncResults });
  const scorecard = buildScorecard(scenario, { cncResults, warnings, conditionedFloorAreaSqFt });

  return {
    scenarioId: scenario.scenarioId,
    modelLevel: scenario.metadata.modelLevel,
    generatedAt: new Date(0).toISOString(),
    quantities: {
      footprintAreaSqFt,
      conditionedFloorAreaSqFt,
      perimeterFt,
      grossWallAreaSqFt,
      openingAreaSqFt,
      netOpaqueWallAreaSqFt,
      basementAreaSqFt,
      roofAreaProxySqFt,
      solarPlaneCandidateSqFt
    },
    cncResults,
    envelopeSummary: {
      wallEffectiveR: scenario.envelope.wallEffectiveR,
      roofR: scenario.envelope.roofR,
      basementWallR: scenario.envelope.basementWallR,
      airLeakageAch50: scenario.envelope.airLeakageAch50,
      qualityBand: envelopeQualityBand(scenario.envelope)
    },
    warnings,
    scorecard,
    limitations: [
      'Planning estimate only.',
      'CNC result is a deterministic proxy, not full nesting.',
      'Energy result is not an external-engine-backed building model.',
      'Cost result is not a construction quote.'
    ]
  };
}

function buildWarnings(scenario, derived) {
  const warnings = [];
  const g = scenario.geometry;
  if (g.footprintWidthFt % 4 !== 0 || g.footprintLengthFt % 4 !== 0) {
    warnings.push({ level: 'warning', code: 'NON_4FT_MODULE', message: 'Footprint does not align cleanly to 4 ft material module.' });
  }
  const windowToWallRatio = derived.grossWallAreaSqFt > 0 ? derived.openingAreaSqFt / derived.grossWallAreaSqFt : 0;
  if (windowToWallRatio > 0.25) {
    warnings.push({ level: 'warning', code: 'HIGH_OPENING_RATIO', message: 'Opening ratio may increase envelope and HVAC loads.' });
  }
  if (scenario.geometry.cornerCount > 4) {
    warnings.push({ level: 'warning', code: 'EXCESS_CORNERS', message: 'Extra corners increase shell cost and complexity.' });
  }
  if (scenario.geometry.roofComplexity !== 'simple') {
    warnings.push({ level: 'warning', code: 'ROOF_COMPLEXITY', message: 'Roof complexity may reduce solar practicality and increase maintenance.' });
  }
  if (scenario.envelope.airLeakageAch50 <= 2.5 && scenario.mechanical.erv !== true) {
    warnings.push({ level: 'warning', code: 'TIGHT_WITHOUT_ERV', message: 'Tight envelope should include ventilation planning.' });
  }
  if (scenario.foundation.type === 'partial-basement' && scenario.foundation.radonStrategy !== 'planned') {
    warnings.push({ level: 'warning', code: 'RADON_UNPLANNED', message: 'Basement strategy should include radon planning.' });
  }
  if (derived.cncResults.some((result) => result.wastePercent > 18)) {
    warnings.push({ level: 'warning', code: 'CNC_WASTE_HIGH', message: 'CNC waste proxy exceeds target band.' });
  }
  return warnings;
}

function buildScorecard(scenario, derived) {
  const bestWaste = Math.min(...derived.cncResults.map((item) => item.wastePercent));
  const ownershipCost = clamp(92 - derived.conditionedFloorAreaSqFt / 120);
  const energyPerformance = clamp(45 + scenario.envelope.wallEffectiveR + scenario.envelope.roofR / 2 - scenario.envelope.airLeakageAch50 * 5);
  const cncEfficiency = clamp(100 - bestWaste * 2);
  const buildSimplicity = clamp(96 - Math.max((scenario.geometry.cornerCount ?? 4) - 4, 0) * 8 - (scenario.geometry.roofComplexity === 'simple' ? 0 : 12));
  const permittingSimplicity = clamp(90 - (scenario.panelSystem.structuralClaim === 'engineered-sip' ? 30 : 0));
  const comfortResilience = clamp(55 + scenario.envelope.wallEffectiveR / 2 + (scenario.mechanical.erv ? 8 : 0) + (scenario.solarBattery.batteryReady ? 6 : 0));
  const repeatability = clamp(90 - Math.max((scenario.panelSystem.uniquePanelRatio ?? 0.3) - 0.3, 0) * 80);

  const domains = {
    ownershipCost,
    energyPerformance,
    cncEfficiency,
    buildSimplicity,
    permittingSimplicity,
    comfortResilience,
    repeatability
  };

  const weightedTotal = round(Object.entries(domains).reduce((sum, [key, value]) => {
    return sum + value * SCORE_WEIGHTS[key] / 100;
  }, 0));

  return {
    modelLevel: scenario.metadata.modelLevel,
    weights: SCORE_WEIGHTS,
    domains,
    weightedTotal,
    warningsCount: derived.warnings.length,
    method: 'Inspectable deterministic starter scorecard.'
  };
}

function envelopeQualityBand(envelope) {
  if (envelope.wallEffectiveR >= 32 && envelope.roofR >= 55 && envelope.airLeakageAch50 <= 2) return 'high-performance';
  if (envelope.wallEffectiveR >= 24 && envelope.roofR >= 49 && envelope.airLeakageAch50 <= 3) return 'good';
  return 'basic';
}

function clamp(value) {
  return round(Math.max(0, Math.min(100, value)));
}

function round(value) {
  return Math.round(value * 100) / 100;
}
