import fs from 'fs';
import path from 'path';

const [keysTypeOutputPath, source] = process.argv.slice(2);

const filePath = path.join(process.cwd(), source);
const fileContent = fs.readFileSync(filePath, 'utf-8');
const jsonData = JSON.parse(fileContent);

const keys: string[] = [];
for (const stringKey in jsonData) {
  keys.push(stringKey);
}
// generate stringkeys.interface.ts
fs.writeFileSync(
  keysTypeOutputPath,
  '/* eslint-disable max-len */\ntype StringKeysMapType = {\n  ' +
  keys.map(k => `${k} : string`).join(',\n  ') +
  '\n};\n\n' +
  'export type L10nKeys = keyof StringKeysMapType;'
);
console.log('Generating type files successfully stringkeys.interface.ts', keysTypeOutputPath);