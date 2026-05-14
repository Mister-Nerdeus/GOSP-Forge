export type BomInputLine = {
  id: string;
  kind: 'product' | 'material' | 'custom-part' | 'labor' | 'process';
  description: string;
  quantity?: number;
  unit: string;
  sourceModuleId?: string;
};
export type BomBuildResult = {
  lines: Array<
    BomInputLine & { quantity: number; confidence: { level: 'low' | 'medium'; rationale: string } }
  >;
  warnings: string[];
};
