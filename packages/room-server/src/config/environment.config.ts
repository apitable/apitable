import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  // 适配pkg加载配置文件，如果远程配置文件没有就加载本地的
  let config: string;
  try {
    config = readFileSync(join(process.cwd(), './bin/config/config.yaml'), 'utf8');
  } catch (e) {
    config = null;
  }
  return yaml.load(config ?? readFileSync(join(__dirname, './config.yaml'), 'utf8')) as Record<string, any>;
};
