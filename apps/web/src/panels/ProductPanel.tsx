import { createPanel, list, row } from './ProjectPanel';

export type ProductSummary = {
  id: string;
  name: string;
  sponsored: boolean;
  specs?: Array<{ name: string; value: string | number; unit?: string; simulationUse?: string }>;
  confidence?: { level: string; rationale: string };
  provenance?: { status?: string };
};

export function createProductPanel(products: ProductSummary[]) {
  return createPanel(
    'Products',
    [
      row('Count', String(products.length)),
      row(
        'Confidence',
        products
          .map((product) => product.confidence?.level ?? 'unknown')
          .filter((level, index, levels) => levels.indexOf(level) === index)
          .join(', '),
      ),
      list(
        products.map((product) => {
          const specCount = product.specs?.length ?? 0;
          const status = product.provenance?.status ?? 'unknown';
          return `${product.name}: ${specCount} specs, ${status}, sponsored=${product.sponsored}`;
        }),
      ),
    ],
    'wide',
  );
}
