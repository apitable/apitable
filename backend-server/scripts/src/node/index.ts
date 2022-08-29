import Vika, {IGetRecordsConfig, IRecord} from '@vikadata/vika';
import {ISetting, ITableConfig, settingConfig} from './setting';
import * as dot from 'dot-object';
import * as fs from 'fs';
import {resolve} from 'path';
import {isArray, isString} from 'lodash';

// 全局缓存
interface CacheRecord {
    id: string;
    dottedObject: object;
}

const recordsCache: { [key: string]: CacheRecord } = {};

// 维格表授权配置
Vika.auth({
    token: 'uskM7PcEPftF4wh0Ni1',
    host: 'https://integration.vika.ltd/fusion/v1',
});

/**
 * 请求配置
 * @param datasheetId 数表id
 * @param setting 配置
 */
const requestData = async (datasheetId: string, setting?: IGetRecordsConfig): Promise<IRecord[]> => {
    const response = await Vika.datasheet(datasheetId).all(setting);
    return response.data?.records || [];
}

/**
 * 解析多个表格
 * @param tableConfigs 表格配置集合
 */
const parseTables = async (tableConfigs: ITableConfig[]): Promise<object> => {
    const tableObjects: { [key: string]: object } = {};
    // 处理生成json所需要的多个表格组合数据
    for (const tableConfig of tableConfigs) {
        const recordList: object[] = [];
        // 请求获取表数据
        const records = await requestData(tableConfig.datasheetId, tableConfig.setting);
        console.log('表:[%s], 行数: %d', tableConfig.datasheetName, records.length);
        const tableIds = new Set<any>();
        // 循环行记录
        for (const record of records) {
            const {fields, recordId} = record;
            if (fields.id !== undefined) {
                // 没写id列的，就跳过 id列的数据 行数据ID
                const fieldId = fields.id;
                const dotObj = dot.object(fields);
                // 移除为空的KEY，因为是注释
                delete dotObj[''];
                if (tableIds.has(fieldId)) {
                    console.warn('行记录ID字段存在重复的值，tableId: %s, recordId: %s,record: %s', fieldId, recordId, JSON.stringify(record));
                }
                tableIds.add(fieldId);
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
const handleRelateRecord = () => {
    const cacheRecordIds = Object.keys(recordsCache);
    for (const [recordId, recordObj] of Object.entries(recordsCache)) {
        const rowObject = recordObj.dottedObject;
        for (const [key, cell] of Object.entries(rowObject)) {
            if (isArray(cell)) {
                let rowValue: string[] = [];
                for (const cellValue of cell) {
                    if (isString(cellValue) && cellValue.startsWith('rec') && cellValue != 'record' && cellValue.toString().indexOf('_') <= 0) {
                        if (cacheRecordIds.includes(cellValue)) {
                            rowValue.push(recordsCache[cellValue].id);
                        } else {
                            console.warn('关联数据不存在: %s', recordId);
                        }
                    } else if (cell.length === 1) {
                        rowValue = cellValue;
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
const generateJsonFile = async (config: ISetting) => {
    // 只处理.json文件
    if (config.fileType !== 'json') {
        return;
    }
    const rootDir = process.env.TARGET_DIR || process.cwd() + '/../system-config';
    const outputPath = resolve(rootDir, 'src/main/resources', config.fileName);
    console.log('\n==========开始============');
    console.log('写入文件路径开始: %s', outputPath);
    const begin = +new Date();
    // 解析多个表返回对象
    let tableData = await parseTables(config.tables);
    // 处理关联表数据替换
    handleRelateRecord();
    // 写入文件
    if (config.create) {
        // 过滤出不需要生成的key
        const removeKeys = config.tables.reduce<string[]>((pre, cur) => {
            if (!cur.create) {
                pre.push(cur.datasheetName);
            }
            return pre;
        }, []) as string[];
        console.log('需要删除的Key: %s', removeKeys);
        const filterData = removeKeys.length > 0 ? dot.remove(removeKeys, tableData) : tableData;
        const outputJson: string = JSON.stringify(filterData, null, 4);
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
    } else {
        console.log('不需要生成文件 %s ', config.fileName);
        console.log('==========结束============');
    }

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

