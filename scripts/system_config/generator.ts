import { Vika, IFieldValueMap, IRecord, IGetRecordsReqParams } from '@vikadata/vika';
import * as dot from 'dot-object';
import * as fs from 'fs';
import { isArray, isString } from 'lodash';
import { resolve } from 'path';
import { ISetting, ITableConfig, settingConfig } from './setting';

// 全局缓存
interface CacheRecord {
  id: string;
  dottedObject: object;
}

const recordsCache: { [key: string]: CacheRecord } = {};

// 维格表授权配置
const vika = new Vika({
  token: 'uskM7PcEPftF4wh0Ni1',
  host: 'https://integration.vika.ltd/fusion/v1',
});

/**
 * 请求配置
 * @param datasheetId 数表id
 */
async function requestData(datasheetId: string, setting?: IGetRecordsReqParams): Promise<IRecord[]> {
  let records: IRecord[] = [];

  try {
    for await (const eachPageRecords of vika.datasheet(datasheetId).records.queryAll({ ...setting })) {
      records = [...records, ...eachPageRecords];
    }

    return records;
  } catch (err) {
    console.warn('拉取数据失败');

    return [];
  }
}

function filter(obj: IFieldValueMap) {
  const ret: IFieldValueMap = {};
  for (let key in obj) {
    key = key.trim();
    if (key && key[0] !== '.') {
      ret[key] = obj[key];
    }
  }
  return ret;
}

/**
 * 解析多个表格
 * @param tableConfigs 表格配置集合
 */
async function parseTables(tableConfigs: ITableConfig[]): Promise<object> {
  const tableObjects: { [key: string]: object } = {};
  // 处理生成json所需要的多个表格组合数据
  for (const tableConfig of tableConfigs) {
    const recordList: object[] = [];
    // 请求获取表数据
    const records = await requestData(tableConfig.datasheetId, tableConfig.setting);
    console.log('表:[%s], 行数: %d', tableConfig.datasheetName, records.length);
    // 循环行记录
    for (const record of records) {
      const { fields, recordId } = record;
      if (fields.id !== undefined) {
        // 没写id列的，就跳过
        const fieldId = fields.id;
        // 移除 . 开头的用于注释的 key，再解析。
        const dotObj = dot.object(filter(fields));
        // 移除为空的 KEY
        delete dotObj[''];
        // 缓存记录，以recordId作为key存储，为了后置关联数据处理
        recordsCache[recordId] = {
          id: fieldId as string,
          // 缓存起来 (Ref 指针引用)
          dottedObject: dotObj,
        };
        recordList.push(dotObj);
      } else {
        console.warn('行记录不存在id字段，recordId: %s, record: %s', recordId, JSON.stringify(record));
      }
    }
    // 以表名作为key构造json对象或数组
    if (tableConfig.schema === 'array') {
      tableObjects[tableConfig.datasheetName] = recordList;
    } else if (tableConfig.schema === 'object') {
      let bigObject: object = {};
      for (const recordObj of recordList) {
        const key = recordObj['id'];
        // isPrivateDeployment && privateModeHostTransform(tableConfig.datasheetName, recordObj);
        if (!tableConfig.id) {
          // 不用生成id
          delete recordObj['id'];
        }
        bigObject[key] = recordObj;
      }
      bigObject = dot.object(bigObject);
      delete bigObject[''];
      tableObjects[tableConfig.datasheetName] = bigObject;
    }
  }
  const res = dot.object(tableObjects);
  delete res[''];
  return res;
}

/**
 * 处理关联数据
 */
function handleRelateRecord() {
  for (const [recordId, recordObj] of Object.entries(recordsCache)) {
    const rowObject = recordObj.dottedObject;
    for (const [key, cell] of Object.entries(rowObject)) {
      if (isArray(cell)) {
        let rowValue: string[] = [];
        for (const cellValue of cell) {
          if (isString(cellValue) && cellValue.startsWith('rec')) {
            if (Object.keys(recordsCache).includes(cellValue)) {
              rowValue.push(recordsCache[cellValue].id);
            } else {
              console.warn('关联数据不存在: %s', recordId);
            }
          } else if (cell.length === 1) {
            rowValue = cellValue;
            continue;
          } else {
            rowValue.push(cellValue);
          }
        }
        rowObject[key] = rowValue;
      }
    }
  }
}

/**
 * 生成json文件
 * @param config 配置信息
 */
async function generateJsonFile(config: ISetting) {
  const rootDir = process.cwd();
  const outputPath = resolve(rootDir, config.dirName, config.fileName);
  console.log('\n==========开始============');
  console.log('写入文件路径开始: %s', outputPath);
  const begin = +new Date();
  // 解析多个表返回对象
  const tableData = await parseTables(config.tables);
  // 处理关联表数据替换
  handleRelateRecord();
  // 写入文件
  const outputJson = JSON.stringify(tableData, null, 4);
  fs.writeFile(outputPath, outputJson, err => {
    if (err !== null) {
      console.error('写入失败');
      console.error(err);
      return;
    }
  });
  const end = +new Date();
  console.log('写入文件完成，耗时: %d 秒', (end - begin) / 1000);
  console.log('==========结束============');
}

/**
 * 生成配置文件
 */
async function main() {
  // 循环配置
  for (const config of settingConfig) {
    await generateJsonFile(config);
  }
}

main();
