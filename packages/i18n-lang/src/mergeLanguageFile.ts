/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as fs from 'fs';
import * as path from 'path';

if (process.argv.length < 5) {
  throw new Error('Expected at least 4 arguments, but got ' + process.argv.length);
}

const sourceFolders = process.argv.slice(6);
const sourceName = process.argv[2];
const languageManifestFile = process.argv[3];
const generateType = process.argv[4];
const outputFolder = process.argv[5];

const languageManifest = new Set(Object.keys(JSON.parse(fs.readFileSync(languageManifestFile, 'utf-8'))));

const readFolder = (folderPath: string): Record<string, any> => {
  const files = fs.readdirSync(folderPath);
  const result: Record<string, any> = {};
  for (const file of files) {
    if (file.endsWith('.json') && file.startsWith(sourceName)) {
      const filePath = path.join(folderPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const fileJson = JSON.parse(fileContent);
      const locale = file.replace(sourceName, '')
        .replace('.', '')
        .replace('.json', '');
      if (languageManifest.has(locale)) {
        result[locale] = fileJson;
      }
    }
  }
  return result;
};

const mergeFolders = (folders: string[]): Record<string, any> => {
  const mergedContent: Record<string, any> = {};

  for (const folder of folders) {
    if (!folder){
      continue;
    }
    const folderContent = readFolder(folder);
    for (const locale in folderContent) {
      mergedContent[locale] = {
        ...(mergedContent[locale] || {}),
        ...(folderContent[locale] || {}),
      };
    }
  }

  return mergedContent;
};

const writeMergedContent = (outputFolder: string, mergedContent: Record<string, any>) => {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const sortObjectKeysRecursively = (obj: Record<string, any>) => {
    const sortedObj = {};
    const sortedKeys = Object.keys(obj).sort();
    for (const key of sortedKeys) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        sortedObj[key] = sortObjectKeysRecursively(obj[key]);
      } else {
        sortedObj[key] = obj[key];
      }
    }
    return sortedObj;
  };

  const sortedMergedContent = sortObjectKeysRecursively(mergedContent);
  if (generateType === 'json') {
    // generate stringkeys.interface.ts
    fs.writeFileSync(
      path.join(outputFolder, 'stringkeys.interface.ts'),
      '/* eslint-disable max-len */\nexport type StringKeysMapType = {\n  ' +
        Object.keys(sortedMergedContent['en-US']).map(k => `'${k}': '${k}'`).join(',\n  ') +
        '\n};\n\n' +
        'export type StringKeysType = keyof StringKeysMapType;'
    );
    Object.keys(sortedMergedContent).forEach(key => {
      fs.writeFileSync(path.join(outputFolder, `strings.${key}.json`), JSON.stringify(sortedMergedContent[key], null, 2), 'utf-8');
    });
    fs.writeFileSync(path.join(outputFolder, 'strings.json'), JSON.stringify(sortedMergedContent, null, 2), 'utf-8');
  }
  if (generateType === 'properties') {
    for (const locale in sortedMergedContent) {
      const fileName = `messages_${locale.replace('-', '_')}.properties`;
      const filePath = path.join(outputFolder, fileName);
      const fileContent = Object.entries(sortedMergedContent[locale])
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      if (locale.startsWith('zh') && locale.endsWith('CN')) {
        fs.writeFileSync(path.join(outputFolder, 'messages.properties'), fileContent, 'utf-8');
      }
      fs.writeFileSync(filePath, fileContent, 'utf-8');
    }
  }
};
const mergedContent = mergeFolders(sourceFolders);
writeMergedContent(outputFolder, mergedContent);

