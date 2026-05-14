import { evaluateRules } from '../logic/ruleEngine.js';
export function runWaterWarningController(turbidityNtu: number) {
  return evaluateRules({ turbidityNtu, pumpEnabled: true, dashboardStatus: 'ok' }, [
    {
      when: { field: 'turbidityNtu', op: 'gt', value: 5 },
      then: { field: 'pumpEnabled', value: false },
    },
    {
      when: { field: 'turbidityNtu', op: 'gt', value: 5 },
      then: { field: 'dashboardStatus', value: 'warning' },
    },
  ]);
}
