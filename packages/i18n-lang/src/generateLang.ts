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
// import path from 'path';

type HashMap = { [key: string]: string };

// configs
const baseInputPath = 'apitable/packages/i18n-lang/src/config/strings.auto.json'; // source to parse
const editionInputPath = 'apitable/packages/i18n-lang/src/config/strings.edition.auto.json'; // source to parse
const allPkgPath = 'apitable/packages/i18n-lang/src/config/strings.json'; // export location
// const pkgsPath = 'static/lang'; // languages packs
const map: HashMap = {
  'zh-CN': 'zh_CN',
  'en-US': 'en_US',
};
const backupLang = 'zh-CN'; // If you can't find other language copy for a specific key, use zh-CN copy.
const keysTypeOutputPath = 'apitable/packages/core/src/config/stringkeys.interface.ts'; // interface type of key

console.log('==========start============');
console.log('generating language pack...');
type Strings = { [key: string]: HashMap };
const allLang = {};

const generateJSON = (inputPath) => {
  const stringsStr = fs.readFileSync(inputPath, { encoding: 'utf8' });
  const strings: Strings = JSON.parse(stringsStr).strings;
  for (const langKey in map) {
    const pkgContent: HashMap = {}; // single language pack
    const langKeyInJSON = map[langKey];
    for (const stringKey in strings) {
      let val = strings[stringKey][langKeyInJSON];
      if (!val) {
        val = strings[stringKey][map[backupLang]];
      }
      pkgContent[stringKey] = val;
    }
    if (allLang[langKey]) {
      allLang[langKey] = { ...allLang[langKey], ...pkgContent };
    } else {
      allLang[langKey] = pkgContent;
    }

  }
  return strings;
};

const baseStrings = generateJSON(baseInputPath);
const editionStrings = generateJSON(editionInputPath);

const strings = { ...baseStrings, ...editionStrings };

fs.writeFileSync(
  allPkgPath,
  JSON.stringify(allLang, null, 2),
);
console.log('Successfully generated all language packs', allPkgPath);

const keys: string[] = [];
for (const stringKey in strings) {
  keys.push(stringKey);
}
// generate stringkeys.interface.ts
fs.writeFileSync(
  keysTypeOutputPath,
  '/* eslint-disable max-len */\nexport type StringKeysMapType = {\n  ' +
  keys.map(k => `'${k}': '${k}'`).join(',\n  ') +
  '\n};\n\n' +
  'export type StringKeysType = keyof StringKeysMapType;'
);
console.log('Generating type files successfully stringkeys.interface.ts', keysTypeOutputPath);

console.log('==========End============');
