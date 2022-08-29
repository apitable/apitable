const fs = require('fs');

const stringInterfacePath = 'packages/core/src/i18n/strings.interface.ts';
const stringJSONPath = 'packages/i18n-lang/src/config/strings.auto.json';

const jsonStr = fs.readFileSync(stringJSONPath);
const stringsObj = JSON.parse(jsonStr)
const tmpStart = `
export interface StringsInterface {
  strings: {
`
const tmpEnd = `
  };
}
`

const testRegx = /^\w+$/i;
const tmpBody = Object.keys(stringsObj.strings)
  .filter(item => {
    if (testRegx.test(item)) {
      return true;
    } else {
      console.warn(`不合法的 key：${item}`)
      return false;
    }
  })
  .map(item => `    ${item}: String;`).join('\n');
const tmp = tmpStart + tmpBody + tmpEnd;
const splitText = `export interface String {`;
const interfaceStr = fs.readFileSync(stringInterfacePath).toString();
const [_, rest] = interfaceStr.split(splitText)
const newInterfaceStr = [tmp, splitText, rest].join('\n');

fs.writeFileSync(stringInterfacePath, newInterfaceStr);

