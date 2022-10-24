import { ServerException } from 'exception/server.exception';
import {
  IMeta, IRecordMap, FieldType, ILinkFieldProperty, ILookUpProperty, IMemberProperty, ICreatedByProperty,
  IFieldMap, IFormulaField, IViewProperty, IDatasheetUnits, IForeignDatasheetMap, IUnitValue, IUserValue
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { InjectLogger } from 'common';
import { DatasheetRepository } from 'modules/repository/datasheet.repository';
import { RecordMap } from 'models';
import { IFetchDataOriginOptions, ILinkedRecordMap, IAuthHeader } from 'interfaces';
import { head, difference, intersection } from 'lodash';
import { RoomResourceRelService } from 'modules/socket/room.resource.rel.service';
import { Logger } from 'winston';
import { NodeService } from '../node/node.service';
import { UnitService } from '../unit/unit.service';
import { UserService } from '../user/user.service';
import { ComputeFieldReferenceManager } from './compute.field.reference.manager';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';
import { PermissionException } from 'exception/permission.exception';

/**
 * <p>
 * Datasheet Fields Handler & Processor
 * </p>
 * @author Chambers
 * @date 2021/2/18
 */
@Injectable()
export class DatasheetFieldHandler {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly unitService: UnitService,
    private readonly nodeService: NodeService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly datasheetRepository: DatasheetRepository,
    private readonly computeFieldReferenceManager: ComputeFieldReferenceManager,
    private readonly roomResourceRelService: RoomResourceRelService,
  ) { }

  initGlobalParameter(mainDstId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions, withoutPermission?: boolean) {
    origin.main = false;
    return {
      mainDstId,
      auth,
      origin,
      // 关联表返回数据结构 { [foreignDatasheetId: string]: IBaseDatasheetPack }
      foreignDstMap: {},
      // 数据结构：数表ID -> 首列字段ID
      dstIdToHeadFieldIdMap: new Map<string, string>(),
      // 成员字段的组织单元集合
      memberFieldUnitIds: new Set<string>(),
      // 创建/编辑人字段的 uuid 集合
      createdByFieldUuids: new Set<string>(),
      // 数表的ID -> 已处理的字段ID集合。总记录，避免循环引用无限递归解析。{ [dstId: string]: string[] } 
      dstIdToProcessedFldIdsMap: {},
      // 数表的ID -> 出现新纪录标志。引入新的纪录时，需要循环解析字段
      dstIdToNewRecFlagMap: new Map<string, boolean>(),
      // 忽略权限获取基础用户无关的基础表格信息
      withoutPermission,
    };
  }

  async parse(
    mainDstId: string,
    auth: IAuthHeader,
    mainMeta: IMeta,
    mainRecordMap: IRecordMap,
    origin: IFetchDataOriginOptions,
    linkedRecordMap?: ILinkedRecordMap,
    fieldIds?: string[],
    withoutPermission?: boolean
  ): Promise<IForeignDatasheetMap & IDatasheetUnits> {
    const beginTime = +new Date();
    this.logger.info(`处理特殊字段开始[${mainDstId}]`);
    const globalParam = this.initGlobalParameter(mainDstId, auth, origin, withoutPermission);

    // 解析本表所有字段
    const fldIds = fieldIds?.length ? fieldIds : Object.keys(mainMeta.fieldMap);
    await this.parseField(mainDstId, mainMeta.fieldMap, mainRecordMap, fldIds, globalParam, linkedRecordMap);

    // 定义返回数据结构
    const combineResult: IForeignDatasheetMap & IDatasheetUnits = {};
    combineResult.foreignDatasheetMap = globalParam.foreignDstMap;
    // 获取数表所在空间
    const spaceId = await this.getSpaceIdByDstId(mainDstId);
    let tempUnitMap: (IUnitValue | IUserValue)[] = [];
    // 批量查询成员信息
    if (globalParam.memberFieldUnitIds.size > 0) {
      const unitMap = await this.unitService.getUnitInfo(spaceId, Array.from(globalParam.memberFieldUnitIds));
      tempUnitMap = [...unitMap];
    }
    if (globalParam.createdByFieldUuids.size > 0) {
      const userMap = await this.userService.getUserInfo(spaceId, Array.from(globalParam.createdByFieldUuids));
      tempUnitMap = [...tempUnitMap, ...userMap];
    }
    if (tempUnitMap.length) {
      combineResult.units = tempUnitMap;
    }

    const endTime = +new Date();
    this.logger.info(`处理特殊字段结束,总耗时[${mainDstId}]: ${endTime - beginTime}ms`);
    return combineResult;
  }

  /**
   * 解析字段
   * @param dstId 数表ID
   * @param fieldMap 表字段数据结构
   * @param recordMap 表行记录
   * @param processFieldIds 解析的字段ID集合
   * @param globalParam 全局参数
   * @param linkedRecordMap 关联列数据
   */
  private async parseField(dstId: string, fieldMap: IFieldMap, recordMap: RecordMap,
    processFieldIds: string[], globalParam: any, linkedRecordMap?: ILinkedRecordMap) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('解析字段', processFieldIds);
    }
    // 提取数表已处理的字段ID集合
    const processedFldIds = [...Object.values(globalParam.dstIdToProcessedFldIdsMap[dstId] || {})] as string[];
    // 差集结果
    let diff = difference<string>(processFieldIds, processedFldIds);
    // 新出现的字段，记入已处理字段集合
    if (diff.length > 0) {
      DatasheetFieldHandler.setIfExist(globalParam.dstIdToProcessedFldIdsMap, dstId, diff);
    }
    // 引入新的纪录时，解析所有待处理字段
    if (globalParam.dstIdToNewRecFlagMap.has(dstId)) {
      diff = processFieldIds;
      globalParam.dstIdToNewRecFlagMap.delete(dstId);
    }
    // 无差集则代表不存在未处理过的字段
    if (diff.length === 0) {
      return;
    }

    // 数据结构：fieldId 字段ID -> foreignDstId 关联表ID
    const fieldIdToLinkDstIdMap = new Map<string, string>();
    // Lookup字段：关联表ID -> 字段ID集合
    const foreignDstIdToLookupFldIdsMap: { [dstId: string]: string[] } = {};

    for (const fieldId of diff) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug('字段:' + fieldId);
      }
      // 表存在此字段才能处理
      if (!(fieldId in fieldMap)) { continue; }
      // 列数据结构
      const fieldInfo = fieldMap[fieldId];
      // 列的类型
      const fieldType = fieldInfo.type;
      if (this.logger.isDebugEnabled()) {
        this.logger.debug('字段类型:' + fieldType);
      }
      switch (fieldType) {
        // 关联字段类型
        case FieldType.Link:
          const fieldProperty = fieldInfo.property as ILinkFieldProperty;
          const linkDatasheetId = fieldProperty.foreignDatasheetId;
          // 主表自关联或被关联，跳过
          if (linkDatasheetId === globalParam.mainDstId) { continue; }
          // 存储关联列所对应的关联表ID
          fieldIdToLinkDstIdMap.set(fieldId, linkDatasheetId);
          break;
        // Lookup字段类型，可能会递归
        case FieldType.LookUp:
          const { relatedLinkFieldId, lookUpTargetFieldId, openFilter, filterInfo } = fieldInfo.property as ILookUpProperty;
          // 本表不存在此列，跳过
          if (!fieldMap[relatedLinkFieldId]) { continue; }
          // 引用的列不是关联类型，跳过
          if (fieldMap[relatedLinkFieldId].type !== FieldType.Link) { continue; }
          // 获得引用的关联表ID
          const { foreignDatasheetId } = fieldMap[relatedLinkFieldId].property as ILinkFieldProperty;
          const foreignFieldIds = [lookUpTargetFieldId];
          // 解析引用过滤条件
          if (openFilter && filterInfo?.conditions.length) {
            filterInfo.conditions.forEach(condition => foreignFieldIds.push(condition.fieldId));
          }
          // 创建双向引用关系
          await this.computeFieldReferenceManager.createReference(dstId, fieldId, foreignDatasheetId, foreignFieldIds);
          // 主表自关联或被关联，跳过
          if (foreignDatasheetId === globalParam.mainDstId) { continue; }
          // 存储关联列所对应的关联表ID
          fieldIdToLinkDstIdMap.set(relatedLinkFieldId, foreignDatasheetId);
          // 存储引用的关联表对应字段
          DatasheetFieldHandler.setIfExist(foreignDstIdToLookupFldIdsMap, foreignDatasheetId, foreignFieldIds);
          break;
        // 成员字段类型，不会递归
        case FieldType.Member:
          const { unitIds } = fieldInfo.property as IMemberProperty;
          if (unitIds && unitIds.length) {
            unitIds.forEach((unitId: string) => globalParam.memberFieldUnitIds.add(unitId));
          }
          break;
        // 编辑/创建人字段类型，不会递归
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy:
          const { uuids } = fieldInfo.property as ICreatedByProperty;
          uuids.forEach((uuid: string) => globalParam.createdByFieldUuids.add(uuid));
          break;
        // 公式字段类型
        case FieldType.Formula:
          await this.processFormulaField(fieldMap, fieldInfo as IFormulaField, globalParam, recordMap);
          break;
        default:
          break;
      }
    }

    // ======= 加载关联表的结构信息（不包含记录） BEGIN =======
    for (const [fldId, foreignDstId] of fieldIdToLinkDstIdMap.entries()) {
      // 已存在跳过，避免多列关联同一个数表重复加载
      if (globalParam.foreignDstMap[foreignDstId]) { continue; }
      const { datasheet, meta, fieldPermissionMap } = await this.initLinkDstSnapshot(foreignDstId, globalParam);
      // 若关联表无法访问，则跳过不加载数据
      if (!datasheet || !meta) {
        fieldIdToLinkDstIdMap.delete(fldId);
        continue;
      }
      globalParam.foreignDstMap[foreignDstId] = { snapshot: { meta, recordMap: {}, datasheetId: datasheet.id }, datasheet, fieldPermissionMap };
    }
    // ======= 加载关联表的结构信息（不包含记录） END   =======

    // 遍历表行记录，处理得到关联表ID和对应的关联记录
    const foreignDstIdRecordIdsMap = linkedRecordMap || this.forEachRecordMap(recordMap, fieldIdToLinkDstIdMap);
    // 主表关联字段存在关联记录的，都已经保存在【foreignDstIdRecordIdsMap】里面
    if (!isEmpty(foreignDstIdRecordIdsMap)) {
      // 查询关联表信息和关联记录
      for (const [foreignDstId, recordIds] of Object.entries(foreignDstIdRecordIdsMap)) {
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`查询新的记录[${foreignDstId}] --- [${recordIds}]`);
        }
        // 机器人事件的 linkedRecordMap，关联表可能无法访问，跳过
        if (!globalParam.foreignDstMap[foreignDstId]) { continue; }

        if (globalParam.foreignDstMap[foreignDstId].snapshot.recordMap) {
          const existRecordIds = [...Object.keys(globalParam.foreignDstMap[foreignDstId].snapshot.recordMap)];
          if (this.logger.isDebugEnabled()) {
            this.logger.debug(`新记录: ${Array.from(recordIds)} - 原记录: ${existRecordIds} `);
          }
          const theDiff = difference(Array.from(recordIds), existRecordIds);
          if (this.logger.isDebugEnabled()) {
            this.logger.debug(`过滤后: ${theDiff}`);
          }
          if (theDiff.length > 0) {
            const addRecordMap = await this.fetchRecordMap(foreignDstId, Array.from(new Set<string>(theDiff)));
            const existRecordMap = globalParam.foreignDstMap[foreignDstId].snapshot.recordMap;
            globalParam.foreignDstMap[foreignDstId].snapshot.recordMap = { ...addRecordMap, ...existRecordMap };
            globalParam.dstIdToNewRecFlagMap.set(foreignDstId, true);
          }
        } else {
          globalParam.foreignDstMap[foreignDstId].snapshot.recordMap = await this.fetchRecordMap(foreignDstId, Array.from(recordIds));
        }
      }
    }

    // 处理关联表的首列，若是公式字段需递归处理
    for (const [fldId, foreignDstId] of fieldIdToLinkDstIdMap.entries()) {
      // 已存在，跳过
      if (globalParam.dstIdToHeadFieldIdMap.has(foreignDstId)) {
        // 创建双向引用关系
        const headFieldId = globalParam.dstIdToHeadFieldIdMap.get(foreignDstId);
        await this.computeFieldReferenceManager.createReference(dstId, fldId, foreignDstId, [headFieldId]);
        continue;
      }
      // 提取关联表的视图和字段类型结构
      const { views, fieldMap } = globalParam.foreignDstMap[foreignDstId].snapshot.meta;
      // 首列字段ID
      const { fieldId } = head((head(views) as IViewProperty).columns)!;
      // 首列字段信息
      const indexField = fieldMap[fieldId];
      globalParam.dstIdToHeadFieldIdMap.set(foreignDstId, fieldId);
      // 创建双向引用关系
      await this.computeFieldReferenceManager.createReference(dstId, fldId, foreignDstId, [fieldId]);
      // 公式字段才需要处理
      if (indexField.type === FieldType.Formula) {
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`关联表[${foreignDstId}]存在Formula字段`, indexField);
        }
        // 处理关联表的首列，公式字段
        await this.processFormulaField(fieldMap, indexField, globalParam);
      }
    }

    // 处理LookUp字段，递归处理
    if (!isEmpty(foreignDstIdToLookupFldIdsMap)) {
      for (const [foreignDstId, fieldIds] of Object.entries(foreignDstIdToLookupFldIdsMap)) {
        // 关联表必须存在，否则跳过
        if (!Object.keys(globalParam.foreignDstMap).includes(foreignDstId)) { continue; }
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`递归处理新的Lookup字段[${foreignDstId}] --- [${fieldIds}]`);
        }
        const foreignFieldMap = globalParam.foreignDstMap[foreignDstId].snapshot.meta.fieldMap;
        const foreignRecordMap = globalParam.foreignDstMap[foreignDstId].snapshot.recordMap;
        await this.parseField(foreignDstId, foreignFieldMap, foreignRecordMap, Array.from(fieldIds), globalParam);
      }
    }
  }

  /**
   * 处理公式字段
   * @param fieldMap 表字段数据结构
   * @param formulaField 公式字段数据
   * @param globalParam
   */
  private async processFormulaField(fieldMap: IFieldMap, formulaField: IFormulaField, globalParam: any, recordMap?: RecordMap) {
    // 处理Formula字段
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('处理Formula字段', formulaField);
    }
    // 提取公式表达式以及公式所在的数表
    const { expression, datasheetId } = formulaField.property;
    // 是否引用了字段
    const formulaRefFieldIds = expression.match(/fld\w{10}/g);
    // match函数返回可能是null或者空数组
    if (!formulaRefFieldIds || isEmpty(formulaRefFieldIds)) return;
    // 打印信息
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('Formula引用字段列表', formulaRefFieldIds);
    }
    // 创建双向引用关系
    await this.computeFieldReferenceManager.createReference(datasheetId, formulaField.id, datasheetId, formulaRefFieldIds);
    // 取出当前表的对应行记录
    if (!recordMap) {
      recordMap = globalParam.foreignDstMap[datasheetId].snapshot.recordMap;
    }
    // 递归处理
    await this.parseField(datasheetId, fieldMap, recordMap || {}, formulaRefFieldIds, globalParam);
  }

  /**
   * 遍历行记录
   * @param recordMap 行记录
   * @param fieldLinkDstMap 字段映射关联表键值对
   * @returns 返回关联表对应被选择关联记录
   */
  private forEachRecordMap(recordMap: RecordMap, fieldLinkDstMap: Map<string, string>) {
    const beginTime = +new Date();
    this.logger.info('开始遍历主表行记录数');
    if (Object.keys(recordMap).length === 0) return {};
    const foreignDstIdRecordIdsMap = Object.values(recordMap).reduce<{ [foreignDstId: string]: string[] }>((pre, cur) => {
      // 空值跳过下个循环
      if (!isEmpty(cur) && !isEmpty(cur.data)) {
        // 存在关联字段再处理
        if (fieldLinkDstMap.size > 0) {
          // 每一行存在数据的单元格
          const fieldIds = [...Object.keys(cur.data)];
          // 处理关联列的单元格数据，取出关联列的单元格选择的关联记录
          // 提取关联列类型的字段ID
          const linkFieldIds = [...fieldLinkDstMap.keys()];
          // 交集结果
          const inter = intersection<string>(fieldIds, linkFieldIds);
          // 有交集则代表存在关联表的记录
          if (inter.length > 0) {
            // 存储的关联表对应的记录
            for (const [fieldId, foreignDstId] of fieldLinkDstMap.entries()) {
              // 存储非空的情况下才拿出记录ID
              if (fieldIds.includes(fieldId)) {
                // 关联表的记录ID集合
                const recordIds = cur.data[fieldId] as string[];
                if (recordIds?.length > 0) {
                  // 过滤关联字段，异常的单元格数据
                  const filterRecordIds = recordIds.filter(recId => typeof recId === 'string');
                  if (filterRecordIds.length === 0) {
                    continue;
                  }
                  // 存储关联表以及对应的记录ID
                  DatasheetFieldHandler.setIfExist(pre, foreignDstId, filterRecordIds);
                }
              }
            }
          }
        }
      }
      return pre;
    }, {});
    const endTime = +new Date();
    this.logger.info(`结束遍历主表行记录数,总耗时: ${endTime - beginTime}ms`);
    return foreignDstIdRecordIdsMap;
  }

  /**
   * 查询记录
   * @param dstId 数表ID
   * @param recordIds 记录ID集合
   */
  private async fetchRecordMap(dstId: string, recordIds: string[]): Promise<RecordMap> {
    return await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);
  }

  /**
   * 初始化数表基本信息
   * @param dstId 数表ID
   * @param globalParam 全局参数
   */
  private async initLinkDstSnapshot(dstId: string, globalParam: any) {
    try {
      const meta = await this.datasheetMetaService.getMetaDataMaybeNull(dstId);

      if (globalParam.withoutPermission) {
        const nodeBaseInfoList = await this.datasheetRepository.selectBaseInfoByDstIds([dstId]);
        const node = nodeBaseInfoList[0];
        return { datasheet: node, meta };
      }
      const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(dstId, globalParam.auth, globalParam.origin);
      return { datasheet: node, meta, fieldPermissionMap };
    } catch {
      return {};
    }
  }

  /**
   * 设置键值对，如果key存在，增量增加；不存在则直接设置
   * @param map 键值对
   * @param key 键
   * @param value 值
   */
  private static setIfExist(map: { [dstId: string]: any[] }, key: string, value: any[]) {
    if (key in map) {
      map[key] = [...map[key], ...value];
    } else {
      map[key] = value;
    }
  }

  static getHeadFieldId(meta: IMeta): string {
    return head((head(meta.views) as IViewProperty).columns)!.fieldId;
  }

  async computeFormulaReference(dstId: string, toChangeFormulaExpressions: any[]) {
    for (const { fieldId, createExpression, deleteExpression } of toChangeFormulaExpressions) {
      // 解析新增的公式表达式
      if (createExpression) {
        const formulaRefFieldIds = createExpression.match(/fld\w{10}/g);
        if (!isEmpty(formulaRefFieldIds)) {
          // 创建双向引用关系（属于覆盖操作，残余部分会解除双向引用关系，所以直接跳过，无需处理删除部分）
          const members = await this.computeFieldReferenceManager.createReference(dstId, fieldId, dstId, formulaRefFieldIds);
          // 反向计算引用
          await this.reverseComputeReference(dstId, fieldId, dstId,
            difference<string>(formulaRefFieldIds, members), difference<string>(members, formulaRefFieldIds));
          continue;
        }
      }
      // 解析删除的公式表达式
      if (deleteExpression) {
        const formulaRefFieldIds = deleteExpression.match(/fld\w{10}/g);
        if (!isEmpty(formulaRefFieldIds)) {
          await this.computeFieldReferenceManager.deleteReference(dstId, fieldId, dstId, formulaRefFieldIds);
          // 反向计算引用
          await this.reverseComputeReference(dstId, fieldId, dstId, undefined, formulaRefFieldIds);
        }
      }
    }
  }

  async computeDatasheetReference(dstId: string, fieldMap: IFieldMap, dstToMetaMap: Map<string, IMeta>): Promise<string[]> {
    // 数表的ID -> 已处理的字段ID集合
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
    // 解析主表，获取所有引用的资源
    const specialFieldTypes = [FieldType.Link, FieldType.LookUp, FieldType.Formula];
    const refFieldIds = Object.values(fieldMap).reduce((pre, field) => {
      if (specialFieldTypes.includes(field.type)) {
        pre.push(field.id);
        return pre;
      }
      DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, dstId, [field.id]);
      return pre;
    }, []);
    await this.parseFieldReference(dstId, dstId, refFieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
    delete dstIdToProcessedFldIdsMap[dstId];
    return Object.keys(dstIdToProcessedFldIdsMap);
  }

  async deleteLinkFieldReference(dstId: string, mainDstMeta: IMeta,
    fldIdToForeignDatasheetIdMap: Map<string, string>): Promise<string[] | undefined> {
    // 解除关联，需确认资源完全不被引用了才能退出
    // 1.可能同时多列关联了同一个关联表，未全部删除前不会解除映射关系; 
    // 2.仍存在间接引用该关联表(如 A 关联 BC，B 关联 C 且首列引用 LinkC 字段。A 与 C 解除关联，LinkB 字段的引用仍需监控 C 数据)

    // 处理关联字段引用
    const { dstIdToMetaMap, dstIdToProcessedFldIdsMap } =
      await this.processLinkFieldReference(dstId, mainDstMeta, fldIdToForeignDatasheetIdMap, false);

    // 加载数表数为一，代表仅解除自关联，无资源需要退出，直接结束
    if (dstIdToMetaMap.size === 1) {
      return undefined;
    }
    // 解析主表，获取所有引用的资源
    const retainedDstIds = await this.computeDatasheetReference(dstId, mainDstMeta.fieldMap, dstIdToMetaMap);
    // 差集结果
    return difference<string>(Object.keys(dstIdToProcessedFldIdsMap), retainedDstIds);
  }

  async computeLinkFieldReference(dstId: string, mainDstMeta: IMeta, fldIdToForeignDatasheetIdMap: Map<string, string>): Promise<string[]> {
    // 处理关联字段引用
    const { dstIdToMetaMap } = await this.processLinkFieldReference(dstId, mainDstMeta, fldIdToForeignDatasheetIdMap, true);

    dstIdToMetaMap.delete(dstId);
    return Array.from(dstIdToMetaMap.keys());
  }

  async processLinkFieldReference(dstId: string, mainDstMeta: IMeta, fldIdToForeignDatasheetIdMap: Map<string, string>, creatable: boolean) {
    // 数表的ID -> Meta
    const dstIdToMetaMap = new Map<string, IMeta>();
    dstIdToMetaMap.set(dstId, mainDstMeta);
    // 数表的ID -> 已处理的字段ID集合
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};

    // 关联字段ID -> 本表映射的 LookUp 字段信息集合
    const linkFldIdToLookUpFieldMap: { [fldId: string]: any[] } = Object.values(mainDstMeta.fieldMap).reduce((pre, field) => {
      if (field.type !== FieldType.LookUp) {
        return pre;
      }
      const { relatedLinkFieldId } = field.property as ILookUpProperty;
      if (fldIdToForeignDatasheetIdMap.has(relatedLinkFieldId)) {
        DatasheetFieldHandler.setIfExist(pre, relatedLinkFieldId, [{ ...field.property, lookUpFieldId: field.id }]);
      }
      return pre;
    }, {});

    const updateReference = creatable ? this.computeFieldReferenceManager.createReference :
      this.computeFieldReferenceManager.deleteReference;

    for (const [fldId, foreignDatasheetId] of fldIdToForeignDatasheetIdMap.entries()) {
      const meta = await this.getMeta(foreignDatasheetId, dstIdToMetaMap);
      if (!meta) { continue; }
      // 首列字段ID
      const { fieldId } = head((head(meta.views) as IViewProperty).columns)!;
      // 更新 Link 字段的双向引用关系
      await updateReference(dstId, fldId, foreignDatasheetId, [fieldId]);
      // 统计关联表所有受影响字段
      const allForeignFieldIds = [fieldId];
      if (fldId in linkFldIdToLookUpFieldMap) {
        for (const { lookUpFieldId, lookUpTargetFieldId, openFilter, filterInfo } of linkFldIdToLookUpFieldMap[fldId]) {
          const foreignFieldIds = [lookUpTargetFieldId];
          // 解析引用过滤条件
          if (openFilter && filterInfo?.conditions.length) {
            filterInfo.conditions.forEach(condition => foreignFieldIds.push(condition.fieldId));
          }
          // 更新 LookUp 字段的双向引用关系
          await updateReference(dstId, lookUpFieldId, foreignDatasheetId, foreignFieldIds);
          allForeignFieldIds.push(...foreignFieldIds);
        }
      }
      // 自关联，跳过
      if (foreignDatasheetId === dstId) { continue; }
      // 解析字段引用
      await this.parseFieldReference(dstId, foreignDatasheetId, allForeignFieldIds, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
      // 反向计算引用
      creatable ? await this.reverseComputeReference(dstId, fldId, foreignDatasheetId, allForeignFieldIds, undefined) :
        await this.reverseComputeReference(dstId, fldId, foreignDatasheetId, undefined, allForeignFieldIds);
    }
    return { dstIdToMetaMap, dstIdToProcessedFldIdsMap };
  }

  async removeLookUpReference(dstId: string, meta: IMeta, toDeleteLookUpProperties: any[]): Promise<string[] | undefined> {
    // 计算移除 LookUp 引用，可能引起的 ROOM 资源的变更，需确认资源完全不被引用了才能退出
    // 处理神奇引用字段引用
    const { dstIdToMetaMap, dstIdToProcessedFldIdsMap, foreignDatasheetIds } =
      await this.processLookUpFieldReference(dstId, meta, toDeleteLookUpProperties, false);

    // 若变化的资源都是关联表，直接结束
    if (foreignDatasheetIds.length === Object.keys(dstIdToProcessedFldIdsMap).length) {
      return undefined;
    }
    // 解析主表，获取所有引用的资源
    const retainedDstIds = await this.computeDatasheetReference(dstId, meta.fieldMap, dstIdToMetaMap);
    // 差集结果
    return difference<string>(Object.keys(dstIdToProcessedFldIdsMap), retainedDstIds);
  }

  async computeLookUpReference(dstId: string, meta: IMeta, toCreateLookUpProperties: any[]): Promise<string[] | undefined> {
    // 处理神奇引用字段引用
    const { dstIdToProcessedFldIdsMap, foreignDatasheetIds } =
      await this.processLookUpFieldReference(dstId, meta, toCreateLookUpProperties, true);

    if (!foreignDatasheetIds.length || foreignDatasheetIds.length === Object.keys(dstIdToProcessedFldIdsMap).length) {
      return undefined;
    }
    // 差集结果
    return difference<string>(Object.keys(dstIdToProcessedFldIdsMap), foreignDatasheetIds);
  }

  private async processLookUpFieldReference(dstId: string, meta: IMeta, properties: any[], creatable: boolean) {
    // 数表的ID -> Meta
    const dstIdToMetaMap = new Map<string, IMeta>();
    dstIdToMetaMap.set(dstId, meta);
    // 数表的ID -> 已处理的字段ID集合
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
    const foreignDatasheetIds: string[] = [];

    const updateReference = creatable ? this.computeFieldReferenceManager.createReference :
      this.computeFieldReferenceManager.deleteReference;

    const fieldMap = meta.fieldMap;
    for (const { fieldId, relatedLinkFieldId, lookUpTargetFieldId, openFilter, filterInfo } of properties) {
      // 本表不存在此列，跳过
      if (!(relatedLinkFieldId in fieldMap)) { continue; }
      // 引用的列不是关联类型，跳过
      if (fieldMap[relatedLinkFieldId].type !== FieldType.Link) { continue; }
      const { foreignDatasheetId } = fieldMap[relatedLinkFieldId].property;
      const lookUpReferFieldIds = [lookUpTargetFieldId];
      // 解析引用过滤条件
      if (openFilter && filterInfo?.conditions.length) {
        filterInfo.conditions.forEach(condition => lookUpReferFieldIds.push(condition.fieldId));
      }
      // 更新 LookUp 字段的双向引用关系
      updateReference(dstId, fieldId, foreignDatasheetId, lookUpReferFieldIds);
      // 引用本表，跳过
      if (foreignDatasheetId === dstId) { continue; }
      // 记录关联表ID，关联表资源必定不会退出 ROOM
      foreignDatasheetIds.push(foreignDatasheetId);
      // 解析引用字段
      await this.parseFieldReference(dstId, foreignDatasheetId, lookUpReferFieldIds, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
      // 反向计算引用（强依赖于字段引用关系缓存，在字段解析之后调用）
      creatable ? await this.reverseComputeReference(dstId, fieldId, foreignDatasheetId, lookUpReferFieldIds, undefined) :
        await this.reverseComputeReference(dstId, fieldId, foreignDatasheetId, undefined, lookUpReferFieldIds);
    }
    return { dstIdToMetaMap, dstIdToProcessedFldIdsMap, foreignDatasheetIds };
  }

  private async parseFieldReference(mainDstId: string, foreignDstId: string, refFieldIds: string[],
    dstToMetaMap: Map<string, IMeta>, dstIdToProcessedFldIdsMap: { [dstId: string]: string[] }) {
    // 判断是否处理过该关联表的字段，是则差集与已处理字段的结果
    const diff = foreignDstId in dstIdToProcessedFldIdsMap ? difference<string>(refFieldIds, dstIdToProcessedFldIdsMap[foreignDstId]) : refFieldIds;
    // 无未处理的字段直接结束
    if (!diff.length) {
      return;
    }
    // 新未处理的字段，记入已处理字段集合
    DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, foreignDstId, refFieldIds);

    for (const refFieldId of diff) {
      // 读取引用关系
      const dstToFiledMap = await this.computeFieldReferenceManager.getRefDstToFieldMap(foreignDstId, refFieldId);
      if (dstToFiledMap) {
        for (const [datasheetId, fieldIds] of dstToFiledMap.entries()) {
          // 引用本表，跳过
          if (datasheetId === mainDstId) { continue; }
          // 递归解析字段引用
          await this.parseFieldReference(mainDstId, datasheetId, fieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
        }
        continue;
      }

      // 引用关系读取失败，解析字段加载
      const meta = await this.getMeta(foreignDstId, dstToMetaMap);
      if (!meta) { return; }
      const fieldMap = meta.fieldMap;
      const fieldInfo = fieldMap[refFieldId];
      if (!fieldInfo) { continue; }
      switch (fieldInfo.type) {
        // 关联字段类型
        case FieldType.Link:
          const fieldProperty = fieldInfo.property as ILinkFieldProperty;
          const linkDatasheetId = fieldProperty.foreignDatasheetId;
          // 引用主表，跳过
          if (linkDatasheetId === mainDstId) { break; }
          const linkDstMeta = await this.getMeta(linkDatasheetId, dstToMetaMap);
          if (!linkDstMeta) { break; }
          // 首列字段ID
          const { fieldId } = head((head(linkDstMeta.views) as IViewProperty).columns)!;
          // 创建双向引用关系
          await this.computeFieldReferenceManager.createReference(foreignDstId, refFieldId, linkDatasheetId, [fieldId]);
          // 递归解析字段引用
          await this.parseFieldReference(mainDstId, linkDatasheetId, [fieldId], dstToMetaMap, dstIdToProcessedFldIdsMap);
          break;
        // Lookup字段类型
        case FieldType.LookUp:
          const { relatedLinkFieldId, lookUpTargetFieldId, openFilter, filterInfo } = fieldInfo.property as ILookUpProperty;
          // 本表不存在此列，跳过
          if (!fieldMap[relatedLinkFieldId]) { break; }
          // 引用的列不是关联类型，跳过
          if (fieldMap[relatedLinkFieldId].type !== FieldType.Link) { break; }
          // 获得引用的关联表ID
          const { foreignDatasheetId } = fieldMap[relatedLinkFieldId].property as ILinkFieldProperty;
          const foreignFieldIds = [lookUpTargetFieldId];
          // 解析引用过滤条件
          if (openFilter && filterInfo?.conditions.length) {
            filterInfo.conditions.forEach(condition => foreignFieldIds.push(condition.fieldId));
          }
          // 创建双向引用关系
          await this.computeFieldReferenceManager.createReference(foreignDstId, refFieldId, foreignDatasheetId, foreignFieldIds);
          // 引用主表，跳过
          if (foreignDatasheetId === mainDstId) { break; }
          // 递归解析字段引用
          await this.parseFieldReference(mainDstId, foreignDatasheetId, foreignFieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
          break;
        // 公式字段类型
        case FieldType.Formula:
          // 解析公式表达式
          const formulaRefFieldIds = fieldInfo.property.expression.match(/fld\w{10}/g);
          // match函数返回可能是null或者空数组
          if (!formulaRefFieldIds || isEmpty(formulaRefFieldIds)) { continue; }
          // 创建双向引用关系
          await this.computeFieldReferenceManager.createReference(foreignDstId, refFieldId, foreignDstId, formulaRefFieldIds);
          // 递归解析字段引用
          await this.parseFieldReference(mainDstId, foreignDstId, formulaRefFieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
          break;
        default:
          break;
      }
    }
  }

  private async getMeta(datasheetId: string, dstToMetaMap: Map<string, IMeta>): Promise<IMeta> {
    let meta;
    if (dstToMetaMap.has(datasheetId)) {
      meta = dstToMetaMap.get(datasheetId);
    } else {
      meta = await this.datasheetMetaService.getMetaDataMaybeNull(datasheetId);
      dstToMetaMap.set(datasheetId, meta);
    }
    return meta;
  }

  /**
   * 反向计算字段引用，更新被动触发资源变更的 ROOM
   * 如 A B 关联，A 房间中原来仅有 A、B 两个资源。
   * 这时在 B 房间中将 B 首列改为引用 LinkC 的公式，则 A 表的 LinkB 字段的引用需监控 C 数据，所有处理该 op 时需将 C 资源加入 A 房间
   */
  private async reverseComputeReference(dstId: string, fieldId: string, relDstId: string, addRefFldIds?: string[], delRefFldIds?: string[]) {
    let addResourceIds: string[] = [];
    let delResourceIds: string[] = [];
    // 计算新增的引用字段
    if (addRefFldIds?.length > 0) {
      // 数表的ID -> 已处理的字段ID集合
      const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
      await this.recurseComputeFieldReference(relDstId, addRefFldIds, dstIdToProcessedFldIdsMap);
      delete dstIdToProcessedFldIdsMap[dstId];
      addResourceIds = Object.keys(dstIdToProcessedFldIdsMap);
    }

    // 计算删除的引用字段
    if (delRefFldIds?.length > 0) {
      // 数表的ID -> 已处理的字段ID集合
      const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
      await this.recurseComputeFieldReference(relDstId, delRefFldIds, dstIdToProcessedFldIdsMap);
      delete dstIdToProcessedFldIdsMap[dstId];
      delResourceIds = difference<string>(Object.keys(dstIdToProcessedFldIdsMap), addResourceIds);
    }

    // 不存在变更资源集，直接结束 
    if (!addResourceIds.length && !delResourceIds.length) {
      return;
    }

    // 读取反向引用关系
    const dstToFiledMap = await this.computeFieldReferenceManager.getReRefDstToFieldMap(dstId, fieldId);
    // 不存在引用该列的关系，直接结束
    if (!dstToFiledMap) {
      return;
    }
    // 数表的ID -> Meta
    const dstIdToMetaMap = new Map<string, IMeta>();
    // 数表的ID -> 已处理的字段ID集合
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
    // 递归更新被动触发资源变更的 ROOM
    await this.recurseUpdateReverseRoom(dstId, addResourceIds, delResourceIds, dstToFiledMap, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
  }

  private async recurseComputeFieldReference(dstId: string, fieldIds: string[], dstIdToProcessedFldIdsMap: { [dstId: string]: string[] }) {
    // 提取数表已处理的字段ID集合
    const processedFldIds = [...Object.values(dstIdToProcessedFldIdsMap[dstId] || {})] as string[];
    // 差集结果
    const diff = difference<string>(fieldIds, processedFldIds);
    // 无差集则代表不存在未处理过的字段
    if (diff.length === 0) {
      return;
    }
    // 新出现的字段，记入已处理字段集合
    DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, dstId, diff);

    for (const fieldId of diff) {
      // 读取引用关系
      const dstToFiledMap = await this.computeFieldReferenceManager.getRefDstToFieldMap(dstId, fieldId);
      if (!dstToFiledMap) {
        continue;
      }
      for (const [datasheetId, fieldIds] of dstToFiledMap.entries()) {
        // 递归计算字段引用
        await this.recurseComputeFieldReference(datasheetId, fieldIds, dstIdToProcessedFldIdsMap);
      }
    }
  }

  private async recurseUpdateReverseRoom(dstId: string, addResourceIds: string[], delResourceIds: string[],
    dstToFiledMap: Map<string, string[]>, dstIdToMetaMap: Map<string, IMeta>, dstIdToProcessedFldIdsMap: { [dstId: string]: string[] }) {
    for (const [datasheetId, fieldIds] of dstToFiledMap.entries()) {
      // 提取数表已处理的字段ID集合
      const processedFldIds = [...Object.values(dstIdToProcessedFldIdsMap[datasheetId] || {})] as string[];
      // 差集结果
      const diff = difference<string>(fieldIds, processedFldIds);
      // 无差集则代表不存在未处理过的字段
      if (diff.length === 0) {
        continue;
      }
      // 新出现的字段，记入已处理字段集合
      DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, datasheetId, diff);

      // 非本表，且第一次出现在处理集的关联表，更新 ROOM（防止重复更新同一个 ROOM）
      if (datasheetId !== dstId && !processedFldIds.length) {
        if (addResourceIds.length) {
          await this.roomResourceRelService.createOrUpdateRel(datasheetId, addResourceIds);
        }
        if (delResourceIds.length) {
          const meta = await this.getMeta(datasheetId, dstIdToMetaMap);
          if (!meta) { continue; }
          // 解析主表，获取所有引用的资源
          const retainedDstIds = await this.computeDatasheetReference(datasheetId, meta.fieldMap, dstIdToMetaMap);
          // 差集结果
          const delDstIds = difference<string>(delResourceIds, retainedDstIds);
          await this.roomResourceRelService.removeRel(datasheetId, delDstIds);
        }
      }

      for (const fieldId of diff) {
        // 读取反向引用关系
        const dstIdToFiledIdsMap = await this.computeFieldReferenceManager.getReRefDstToFieldMap(datasheetId, fieldId);
        if (!dstIdToFiledIdsMap) {
          continue;
        }
        // 递归更新被动触发资源变更的 ROOM
        await this.recurseUpdateReverseRoom(dstId, addResourceIds, delResourceIds, dstIdToFiledIdsMap, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
      }
    }
  }

  async getSpaceIdByDstId(dstId: string): Promise<string> {
    const rawData = await this.datasheetRepository.selectSpaceIdByDstId(dstId);
    if (rawData?.spaceId) {
      return rawData.spaceId;
    }
    throw new ServerException(PermissionException.NODE_NOT_EXIST);
  }
}
