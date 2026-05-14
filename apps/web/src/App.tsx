import manifest from '../../../examples/projects/automated-water-filter.project-v2.json';
import controllerLogic from '../../../examples/modules/control/controller-logic.module.json';
import statusDashboard from '../../../examples/modules/digital/status-dashboard.module.json';
import classroomBattery from '../../../examples/modules/power/classroom-battery.module.json';
import assemblyTestProcess from '../../../examples/modules/process/assembly-test-process.module.json';
import cleanWaterTank from '../../../examples/modules/water/clean-water-tank.module.json';
import filterHousing from '../../../examples/modules/water/filter-housing.module.json';
import filterMedia from '../../../examples/modules/water/filter-media.module.json';
import pump from '../../../examples/modules/water/pump.module.json';
import rawWaterTank from '../../../examples/modules/water/raw-water-tank.module.json';
import waterQualitySensor from '../../../examples/modules/water/water-quality-sensor.module.json';
import basicWaterQualitySensor from '../../../examples/products/basic-water-quality-sensor.product.json';
import classroomBatteryPack from '../../../examples/products/classroom-battery-pack.product.json';
import classroomDiaphragmPump from '../../../examples/products/classroom-diaphragm-pump.product.json';
import filterMediaCartridge from '../../../examples/products/filter-media-cartridge.product.json';
import { createEducationPanel } from './panels/EducationPanel';
import { createModulePanel } from './panels/ModulePanel';
import { createOutputPanel } from './panels/OutputPanel';
import { createProductPanel, type ProductSummary } from './panels/ProductPanel';
import { createProjectPanel, type ProjectSummary } from './panels/ProjectPanel';
import { createSafetyPanel, type SafetyModuleSummary } from './panels/SafetyPanel';

const project = manifest as ProjectSummary;
const modules = [
  rawWaterTank,
  pump,
  filterHousing,
  cleanWaterTank,
  filterMedia,
  waterQualitySensor,
  controllerLogic,
  statusDashboard,
  classroomBattery,
  assemblyTestProcess,
] as SafetyModuleSummary[];
const products = [
  classroomDiaphragmPump,
  basicWaterQualitySensor,
  classroomBatteryPack,
  filterMediaCartridge,
] as ProductSummary[];

export function renderApp(root: HTMLElement) {
  root.replaceChildren(createShell());
}

function createShell() {
  const app = document.createElement('main');
  app.className = 'app-shell';

  app.append(
    createProjectPanel(project),
    createOutputPanel(),
    createModulePanel(modules),
    createProductPanel(products),
    createSafetyPanel(modules),
    createEducationPanel(project, modules),
  );

  return app;
}
