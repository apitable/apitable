/* tslint:disable */
/* eslint-disable */
const path = require('path');
const fs = require('fs'); 
const TypeDoc = require('typedoc');

const CLASSES = 'classes';
const MODULES = 'modules';
const UI = 'ui';
const RELATIVE_PATH = '../../../developers/widget';
const API_PATH = 'api-reference';
const REPLACE_KEYS = [
  ['## Functions', ''],
  ['# Returns', '# 返回值'],
  ['# Parameters', '# 参数'],
  ['# Properties', '# 属性'],
  ['# Accessors', '# 配件'],
  ['# Methods', '# 方法']
]

const MODAL_FIELD_REPLACE_KEYS = [
  [/\*\*property\*\*\(\):.+/, '**property**(): [FieldType](../enums/interface_field_types.FieldType.md)'],
  [/\${deleteStart}(.|\n)*\${deleteEnd}/, '#### Returns \n\n']
]

function hiddenProperties(data) {
  const ls = data.split('\n');
  let start = -1;
  let end = -1
  ls.forEach((item, index) => {
    if (item.indexOf('## Properties') === 0 || item.indexOf('## 属性') === 0) {
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
    throw new Error(`目标目录 ${outputParent} 不存在`);
  }

  fs.rmdirSync(outputDir, { recursive: true });

  const app = new TypeDoc.Application();

  // load tsconfig.json files
  app.options.addReader(new TypeDoc.TSConfigReader());

  app.bootstrap({
    entryPoints: ['src/hooks', 'src/model', 'src/ui', 'src/interface', 'src/utils'],
    exclude: ['**/*+(index).ts', '**/__test__/*', '**/private/*'],
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
    // 根据文件中出现的顺序排序
    sort: 'source-order',
    // typedoc-plugin-markdown 配置
    // 隐藏 Table of contents
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,
  });
  app.convertAndWatch(async (project) => {
    await app.generateDocs(project, outputDir);

    // 格式化 modules 文件夹下面的 hooks 文件内容
    const destModulePath = `${outputDir}/${MODULES}`;
    const modulesFiles = fs.readdirSync(destModulePath);
    modulesFiles.forEach(file => {
      let [pre, targetFile] = file.split(/\_(.+)/);
      let fileData = fs.readFileSync(`${destModulePath}/${file}`, { encoding:'utf8' });
      // 调整生成字符
      REPLACE_KEYS.forEach(rk => {
        fileData = fileData.replace(new RegExp(rk[0], 'g'), rk[1]);
      })
      if (pre === 'hooks' || pre === 'utils' || pre === 'ui') {
        // 去掉 hooks 标题和函数定义
        const data = fileData.split('\n');
        data.splice(0, 5);
        // 如果 fileData 没有内容，则返回空文件
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

    // 格式化 classes 文件夹下面的 model 文件内容
    const destClassPath = `${outputDir}/${CLASSES}`;
    const classesFiles = fs.readdirSync(destClassPath);
    classesFiles.forEach(file => {
      const [pre, targetFile] = file.split(/\.(.+)/);
      let fileData = fs.readFileSync(`${destClassPath}/${file}`, { encoding:'utf8' });
      // 隐藏掉 Properties
      fileData = hiddenProperties(fileData);
      // 替换掉 modal_field 里面无用的
      if (pre === 'model_field') {
        MODAL_FIELD_REPLACE_KEYS.forEach(rk => {
          fileData = fileData.replace(rk[0], rk[1]);
        })
      }
      // 调整生成字符
      REPLACE_KEYS.forEach(rk => {
        fileData = fileData.replace(new RegExp(rk[0], 'g'), rk[1]);
      })
      fileData = `---
title: ${targetFile.replace('.md', '')}
---

` + fileData;
      fs.writeFileSync(`${destClassPath}/${file}`, fileData, { encoding:'utf8' });
    })
  });
}

main().catch(console.error);