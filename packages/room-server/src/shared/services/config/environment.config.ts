import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  // load config.yaml, use the local configuration file while there is no configuration in the remote
  let config: string;
  try {
    config = readFileSync(join(process.cwd(), './bin/config/config.yaml'), 'utf8');
  } catch (e) {
    config = null;
  }
  return yaml.load(config ?? readFileSync(join(__dirname, './config.yaml'), 'utf8')) as Record<string, any>;
};
