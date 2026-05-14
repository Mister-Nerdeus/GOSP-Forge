export type RegisteredAssumption = {
  id: string;
  description: string;
  value?: unknown;
  unit?: string;
  sourceRefs?: string[];
};
export class AssumptionRegistry {
  private assumptions = new Map<string, RegisteredAssumption>();
  register(a: RegisteredAssumption): void {
    this.assumptions.set(a.id, a);
  }
  require(id: string): RegisteredAssumption {
    const f = this.assumptions.get(id);
    if (!f) throw new Error('Missing assumption: ' + id);
    return f;
  }
  list(): RegisteredAssumption[] {
    return [...this.assumptions.values()].sort((a, b) => a.id.localeCompare(b.id));
  }
}
