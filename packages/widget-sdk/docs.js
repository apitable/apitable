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

/* tslint:disable */
/* eslint-disable */
const path = require('path');
const fs = require('fs'); 
const TypeDoc = require('typedoc');

const CLASSES = 'classes';
const MODULES = 'modules';
const UI = 'ui';
const RELATIVE_PATH = '../../../../dev-book/docs/widget';
const API_PATH = 'api-reference';

const MODAL_FIELD_REPLACE_KEYS = [
  [/\*\*property\*\*\(\):.+/, '**property**(): [FieldType](../enums/interface_field_types.FieldType.md)'],
  [/\${deleteStart}(.|\n)*\${deleteEnd}/, '#### Returns \n\n']
]

function hiddenProperties(data) {
  const ls = data.split('\n');
  let start = -1;
  let end = -1
  ls.forEach((item, index) => {
    if (item.indexOf('## Properties') === 0) {
      start = index;
    } else if (end === -1 && start > -1 && item.indexOf('## ') === 0) {
      end = index;
    }
  })

  if (start) {
    ls[start] = '<!-- ' + ls[start];
  }
  if (end) {
    ls[end - 1] += ' -->';
  }
  return ls.join('\n');
}

function toHump(name, isFirstUpper) {
  return name.replace(/\_(\w)/g, function(all, letter){
      return letter.toUpperCase();
  }).replace(/^\w+/, function(word){
    return isFirstUpper ? word.substring(0,1).toUpperCase()+word.substring(1) : word;
  });
}


async function main() {
  const outputDir = `${RELATIVE_PATH}/${API_PATH}`;
  const targetPath = path.join(__dirname, outputDir);
  const outputParent = path.join(targetPath, '..');
  if (!fs.existsSync(outputParent)) {
    throw new Error(`Destination directory ${outputParent} does not exist`);
  }

  fs.rmdirSync(outputDir, { recursive: true });

  const app = new TypeDoc.Application();

  // load tsconfig.json files
  app.options.addReader(new TypeDoc.TSConfigReader());

  app.bootstrap({
    entryPoints: ['src/hooks', 'src/model', 'src/ui', 'src/interface', 'src/utils'],
    exclude: ['**/*+(index).ts', '**/__tests__/*', '**/private/*'],
    plugin: ['typedoc-plugin-markdown'],
    entryDocument: `index.md`,
    excludePrivate: true,
    excludeInternal: true,
    readme: 'none',
    name: 'API Reference',
    watch: true,
    disableSources: true,
    hideSources: true,
    hideGenerator: true,
    // sort by the order of appearance in the document
    sort: 'source-order',
    // typedoc-plugin-markdown configuration
    // hidden the table of contents
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,
  });
  app.convertAndWatch(async (project) => {
    await app.generateDocs(project, outputDir);

    // formatting the contents of the hooks file under the modules folder
    const destModulePath = `${outputDir}/${MODULES}`;
    const modulesFiles = fs.readdirSync(destModulePath);
    modulesFiles.forEach(file => {
      let [pre, targetFile] = file.split(/\_(.+)/);
      let fileData = fs.readFileSync(`${destModulePath}/${file}`, { encoding:'utf8' });
      if (pre === 'hooks' || pre === 'utils' || pre === 'ui') {
        // remove the hooks title and function definitions
        const data = fileData.split('\n');
        data.splice(0, 5);
        // if fileData has no content, return the empty files
        if (!data.join('')) {
          return fs.writeFileSync(`${destModulePath}/${file}`, '', { encoding:'utf8' });
        }
        fileData = data.join('\n');
      }
      if (pre === 'ui') {
        targetFile = targetFile.slice(0, Math.floor((targetFile.length - 3) / 2));
      }
      fileData = `---
title: ${toHump(targetFile, pre === 'ui').replace('.md', '')}
---

` + fileData;
      fs.writeFileSync(`${destModulePath}/${file}`, fileData, { encoding:'utf8' });
    })

    // format the  content of the modal file under the classes folder
    const destClassPath = `${outputDir}/${CLASSES}`;
    const classesFiles = fs.readdirSync(destClassPath);
    classesFiles.forEach(file => {
      const [pre, targetFile] = file.split(/\.(.+)/);
      let fileData = fs.readFileSync(`${destClassPath}/${file}`, { encoding:'utf8' });
      // hide Properties
      fileData = hiddenProperties(fileData);
      // replace the useless of the modal_field
      if (pre === 'model_field') {
        MODAL_FIELD_REPLACE_KEYS.forEach(rk => {
          fileData = fileData.replace(rk[0], rk[1]);
        })
      }
      fileData = `---
title: ${targetFile.replace('.md', '')}
---

` + fileData;
      fs.writeFileSync(`${destClassPath}/${file}`, fileData, { encoding:'utf8' });
    })
  });
}

main().catch(console.error);