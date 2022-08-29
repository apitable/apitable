// styleguide/setup.js
import * as VikaUIComponent from './src/components/index';
// import { Box } from './src/sg_components/box';

// (global as any).Box = Box;
Object.assign(global, VikaUIComponent);