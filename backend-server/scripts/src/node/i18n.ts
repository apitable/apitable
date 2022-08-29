import Vika, {IGetRecordsConfig, IRecord} from '@vikadata/vika';
import {ISetting, ITableConfig, settingConfig} from './setting';
import * as dot from 'dot-object';
import {resolve} from 'path';
import {isArray, isString, join, last, split, template, templateSettings} from 'lodash';
import * as fs from "fs";

// 全局缓存
interface CacheRecord {
    id: string;
    dottedObject: object;
}

const recordsCache: { [key: string]: CacheRecord } = {};
// 默认语言
const DEFAULT_I18N_LANGUAGE = 'zh_CN';
// 使用自定义的模板分隔符
templateSettings.interpolate = /{{([\s\S]+?)}}/g;

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
async function requestData(datasheetId: string, setting?: IGetRecordsConfig): Promise<IRecord[]> {
    const response = await Vika.datasheet(datasheetId).all(setting);
    return response.data?.records || [];
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
            const {fields, recordId} = record;
            if (fields.id !== undefined) {
                // 没写id列的，就跳过
                const fieldId = fields.id;
                const dotObj = dot.object(fields);
                // 移除为空的KEY，因为是注释
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
    const cacheRecordIds = Object.keys(recordsCache);
    for (const [recordId, recordObj] of Object.entries(recordsCache)) {
        const rowObject = recordObj.dottedObject;
        for (const [key, cell] of Object.entries(rowObject)) {
            if (isArray(cell)) {
                let rowValue: string[] = [];
                for (const cellValue of cell) {
                    if (isString(cellValue) && cellValue.startsWith('rec') && cellValue != 'record') {
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
 * 生成properties文件
 * @param config 配置信息
 */
async function generateJsonFile(config: ISetting) {
    // 只处理.properties文件
    if (config.fileType !== 'properties') {
        return;
    }
    const rootDir = process.env.TARGET_DIR || process.cwd() + '/../system-config';
    console.time(`解析数据完成，耗时`);
    // 解析多个表返回对象
    let tableData = await parseTables(config.tables);
    // 处理关联表数据替换
    handleRelateRecord();
    console.timeEnd(`解析数据完成，耗时`);
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
        for (const i18nModule in filterData) {
            const outputPathTemplate = resolve(rootDir, 'src/main/resources/i18n/auto', i18nModule, config.fileName);
            const outJson = filterData[i18nModule];

            // 自动生成文件类型
            /*
             * [0]：messages.properties （默认）
             * [1]：messages_zh_CN.properties
             * [2]：messages_en_US.properties
             */
            const i18nTypes = [DEFAULT_I18N_LANGUAGE, 'zh_CN', 'en_US'];

            i18nTypes.forEach((i18nType, i) => {
                const compiled = template(outputPathTemplate);
                const outputPath = compiled({'language': i === 0 ? '' : `_${i18nType}`})
                const outputFileName = last(split(outputPath, '/'));

                console.log('\n==========开始============');
                console.log('写入文件路径开始: %s', outputPath);

                console.time(`写入文件「${i18nModule}/${outputFileName}」完成，耗时`);
                const default_i18n: string[] = [];
                for (const key in outJson) {
                    if (outJson[key][i18nType]) {
                        default_i18n.push(`${key!}=${outJson[key][i18nType]}`);
                    }
                }
                const outPropertiesStr = join(default_i18n, '\r\n');
                fs.writeFile(outputPath, outPropertiesStr, err => {
                    if (err !== null) {
                        console.error('写入失败');
                        console.error(err);
                        return;
                    }
                });
                console.timeEnd(`写入文件「${i18nModule}/${outputFileName}」完成，耗时`);
                console.log('==========结束============');
            })
        }
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

