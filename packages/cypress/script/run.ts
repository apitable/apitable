import * as path from 'path';
import * as fs from 'fs';

const PIPE_LINE = process.env.CI_PIPELINE_ID || 0;
const JSON_PATH = path.resolve('./', 'cypress.json');

const getBranch = () => {
  // if (!process.env.CI_COMMIT_REF_NAME) {
  //   return 'local';
  // }
  // switch (process.env.CI_COMMIT_REF_NAME) {
  //   case 'integration':
  //   case 'test':
  //     return process.env.CI_COMMIT_REF_NAME;
  //   default:
  //     return 'integration';
  // }
  return 'integration';
};

const writeJson = () => {
  const branch = getBranch();
  const baseUrl = branch === 'local' ? 'http://127.0.0.1:3000/' : `https://${branch}.vika.ltd/`;
  const json = `{
    "baseUrl": "${baseUrl}",
    "viewportWidth": 1920,
    "viewportHeight": 920,
    "projectId": "efk8au",
    "env": {
      "pipeline": ${branch === 'test' ? PIPE_LINE : 0}
    }
  }`;

  fs.writeFileSync(JSON_PATH, json, 'utf-8');
};

writeJson();
