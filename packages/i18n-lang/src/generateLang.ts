import * as fs from 'fs';
// import path from 'path';

type HashMap = { [key: string]: string };

// 配置项
const inputPath = 'apitable/packages/i18n-lang/src/config/strings.auto.json'; // 解析源
const allPkgPath = 'apitable/packages/i18n-lang/src/config/strings.json'; // 全语言包导出的位置
// const pkgsPath = 'apitable/packages/datasheet/src/static/lang'; // 各种语言包
const map: HashMap = {
  'zh-CN': 'zh_CN',
  'en-US': 'en_US',
};
const backupLang = 'zh-CN'; // 特定 key 的其他语言文案找不到，就用 zh-CN 文案。
const keysTypeOutputPath = 'apitable/packages/core/src/config/stringkeys.interface.ts'; // key 的接口类型

console.log('==========开始============');
console.log('生成语言包中...');
type Strings = { [key: string]: HashMap };
const stringsStr = fs.readFileSync(inputPath, { encoding: 'utf8' });
const strings: Strings = JSON.parse(stringsStr).strings;

const allLang = {}; // 全量语言包
for (const langKey in map) {
  const pkgContent: HashMap = {}; // 单语言包
  const langKeyInJSON = map[langKey];
  for (const stringKey in strings) {
    let val = strings[stringKey][langKeyInJSON];
    if (!val) {
      val = strings[stringKey][map[backupLang]];
    }
    pkgContent[stringKey] = val;
  }
  allLang[langKey] = pkgContent;
  // const langPkgPath = path.resolve(pkgsPath, langKey + '.js');
  // TODO: 优化点。开发环境可以不生成这个（本地环境使用全量语言包），部署的时候才生成。
  // fs.writeFileSync(
  //   langPkgPath,
  //   'window.vika_i18n =\n' + JSON.stringify(pkgContent, null, 2),
  // );
  // console.log(`成功生成 ${langKey} 语言包`, langPkgPath);
}

fs.writeFileSync(
  allPkgPath,
  JSON.stringify(allLang, null, 2),
);
console.log('成功生成全量语言包', allPkgPath);

const keys: string[] = [];
for (const stringKey in strings) {
  keys.push(stringKey);
}
// 生成 stringkeys.interface.ts
fs.writeFileSync(
  keysTypeOutputPath,
  '/* eslint-disable max-len */\nexport type StringKeysMapType = {\n  ' +
  keys.map(k => `'${k}': '${k}'`).join(',\n  ') +
  '\n};\n\n' +
  'export type StringKeysType = keyof StringKeysMapType;'
);
console.log('成功生成类型文件 stringkeys.interface.ts', keysTypeOutputPath);

console.log('==========结束============');
