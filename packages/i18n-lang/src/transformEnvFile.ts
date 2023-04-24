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

if (process.argv.length < 4) {
  throw new Error('Expected at least 3 arguments, but got ' + process.argv.length);
}

const envFilePath = process.argv[2];
const outputFilePath = process.argv[3];

const jsonData = fs.readFileSync(envFilePath, 'utf-8');
const parsedData = JSON.parse(jsonData);

fs.writeFileSync(outputFilePath, '', 'utf-8');

const keys = Object.keys(parsedData).sort();

for (const key of keys) {
  if (parsedData.hasOwnProperty(key)) {
    if (parsedData[key].description) {
      fs.appendFileSync(outputFilePath, `# ${parsedData[key].description
        .replaceAll('\n', '\n# ')} \n`, 'utf-8');
    }
    let envLine = '';
    if (typeof parsedData[key].value === 'string') {
      envLine = `${key}=${parsedData[key].value}`;
    }else {
      envLine = `${key}=${JSON.stringify(parsedData[key].value)}`;
    }
    fs.appendFileSync(outputFilePath, envLine + '\n\n', 'utf-8');
  }
}
