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

import {
  FieldType, ICreatedByProperty, IDatasheetUnits, IFieldMap, IForeignDatasheetMap, IFormulaField, ILinkFieldProperty, ILookUpProperty,
  IMemberProperty, IMeta, IRecordMap, IUnitValue, IUserValue, IViewProperty
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { difference, head, intersection } from 'lodash';
import { InjectLogger } from 'shared/common';
import { PermissionException, ServerException } from 'shared/exception';
import { IAuthHeader, IFetchDataOriginOptions, ILinkedRecordMap } from 'shared/interfaces';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';
import { Logger } from 'winston';
import { RecordMap } from '../../interfaces';
import { DatasheetRepository } from '../../datasheet/repositories/datasheet.repository';
import { NodeService } from 'node/services/node.service';
import { UnitService } from 'unit/services/unit.service';
import { UserService } from 'user/services/user.service';
import { ComputeFieldReferenceManager } from './compute.field.reference.manager';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';

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
      // linked datasheet data
      // { [foreignDatasheetId: string]: IBaseDatasheetPack }
      foreignDstMap: {},
      // datasheet ID -> primary field ID
      dstIdToHeadFieldIdMap: new Map<string, string>(),
      // unit IDs of a member field
      memberFieldUnitIds: new Set<string>(),
      // UUID set of creator/modifier fields
      createdByFieldUuids: new Set<string>(),
      // datasheet ID -> processed field ID set
      // { [dstId: string]: string[] } 
      dstIdToProcessedFldIdsMap: {},
      // datasheet ID -> if new records are added.
      dstIdToNewRecFlagMap: new Map<string, boolean>(),
      // If obtain datasheet base info unrelated to user base info regardless of permission
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
    this.logger.info(`Start processing special field [${mainDstId}]`);
    const globalParam = this.initGlobalParameter(mainDstId, auth, origin, withoutPermission);

    // Process all fields of the datasheet
    const fldIds = fieldIds?.length ? fieldIds : Object.keys(mainMeta.fieldMap);
    await this.parseField(mainDstId, mainMeta.fieldMap, mainRecordMap, fldIds, globalParam, linkedRecordMap);

    const combineResult: IForeignDatasheetMap & IDatasheetUnits = {};
    combineResult.foreignDatasheetMap = globalParam.foreignDstMap;
    // Get the space ID which the datasheet belongs to
    const spaceId = await this.getSpaceIdByDstId(mainDstId);
    let tempUnitMap: (IUnitValue | IUserValue)[] = [];
    // Batch query member info
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
    this.logger.info(`Finished processing special field, duration [${mainDstId}]: ${endTime - beginTime}ms`);
    return combineResult;
  }

  /**
   * @param dstId datasheet ID
   * @param fieldMap field data
   * @param recordMap record data
   * @param processFieldIds field IDs to be processed
   * @param globalParam global parameters
   * @param linkedRecordMap linked field data
   */
  private async parseField(
    dstId: string,
    fieldMap: IFieldMap,
    recordMap: RecordMap,
    processFieldIds: string[],
    globalParam: any,
    linkedRecordMap?: ILinkedRecordMap
  ) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('Process fields', processFieldIds);
    }
    // Get field IDs that have been processed
    const processedFldIds = [...Object.values(globalParam.dstIdToProcessedFldIdsMap[dstId] || {})] as string[];
    let diff = difference<string>(processFieldIds, processedFldIds);
    // New field, put inside processed fields
    if (diff.length > 0) {
      DatasheetFieldHandler.setIfExist(globalParam.dstIdToProcessedFldIdsMap, dstId, diff);
    }
    // When a record is created, parse its fields to be processed
    if (globalParam.dstIdToNewRecFlagMap.has(dstId)) {
      diff = processFieldIds;
      globalParam.dstIdToNewRecFlagMap.delete(dstId);
    }
    // If difference is empty, no unprocessed fileds exist
    if (diff.length === 0) {
      return;
    }

    // TODO(troy): extract the above codes into multiple functions
    // field ID -> linked datasheet ID
    const fieldIdToLinkDstIdMap = new Map<string, string>();
    // Lookup field: linked datasheet ID -> field ID set
    const foreignDstIdToLookupFldIdsMap: { [dstId: string]: string[] } = {};

    for (const fieldId of diff) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug('Field:' + fieldId);
      }
      // Only handle the field if datasheet contains it
      if (!(fieldId in fieldMap)) {
        continue;
      }
      const fieldInfo = fieldMap[fieldId]!;
      const fieldType = fieldInfo.type;
      if (this.logger.isDebugEnabled()) {
        this.logger.debug('Field type:' + fieldType);
      }
      switch (fieldType) {
        case FieldType.Link:
          const fieldProperty = fieldInfo.property as ILinkFieldProperty;
          const linkDatasheetId = fieldProperty.foreignDatasheetId;
          // main datasheet is self-linking or linked, skip it
          if (linkDatasheetId === globalParam.mainDstId) {
            continue;
          }
          // Store linked datasheet ID corresponding to linked field
          fieldIdToLinkDstIdMap.set(fieldId, linkDatasheetId);
          break;
        // Lookup field, may recurse
        case FieldType.LookUp:
          const { relatedLinkFieldId, lookUpTargetFieldId, openFilter, filterInfo } = fieldInfo.property as ILookUpProperty;
          // The field is not in datasheet, skip
          if (!fieldMap[relatedLinkFieldId]) {
            continue;
          }
          // Linked field is not link field, skip
          if (fieldMap[relatedLinkFieldId]!.type !== FieldType.Link) {
            continue;
          }
          // Get referenced linked datasheet ID
          const { foreignDatasheetId } = fieldMap[relatedLinkFieldId]!.property as ILinkFieldProperty;
          const foreignFieldIds = [lookUpTargetFieldId];
          // Parse reference filter condition
          if (openFilter && filterInfo?.conditions.length) {
            filterInfo.conditions.forEach(condition => foreignFieldIds.push(condition.fieldId));
          }
          // Create two-way reference relation
          await this.computeFieldReferenceManager.createReference(dstId, fieldId, foreignDatasheetId, foreignFieldIds);
          // main datasheet is self-linking or linked, skip
          if (foreignDatasheetId === globalParam.mainDstId) {
            continue;
          }
          // Store linked datasheet ID corresponding to linked field
          fieldIdToLinkDstIdMap.set(relatedLinkFieldId, foreignDatasheetId);
          // Store corresponding fields in referenced linked datasheet 
          DatasheetFieldHandler.setIfExist(foreignDstIdToLookupFldIdsMap, foreignDatasheetId, foreignFieldIds);
          break;
        // member field, not recursive
        case FieldType.Member:
          const { unitIds } = fieldInfo.property as IMemberProperty;
          if (unitIds && unitIds.length) {
            unitIds.forEach((unitId: string) => globalParam.memberFieldUnitIds.add(unitId));
          }
          break;
        // modifier/creator field, not recursive
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy:
          const { uuids } = fieldInfo.property as ICreatedByProperty;
          uuids.forEach((uuid: string) => globalParam.createdByFieldUuids.add(uuid));
          break;
        case FieldType.Formula:
          await this.processFormulaField(fieldMap, fieldInfo as IFormulaField, globalParam, recordMap);
          break;
        default:
          break;
      }
    }

    // ======= Load linked datasheet structure data (not including records) BEGIN =======
    for (const [fldId, foreignDstId] of fieldIdToLinkDstIdMap.entries()) {
      // Avoid redundant loading of a linked datasheet caused by multiple fields linking the same datasheet
      if (globalParam.foreignDstMap[foreignDstId]) {
        continue;
      }
      const { datasheet, meta, fieldPermissionMap } = await this.initLinkDstSnapshot(foreignDstId, globalParam);
      // If linked datasheet is unaccessible, skip loading
      if (!datasheet || !meta) {
        fieldIdToLinkDstIdMap.delete(fldId);
        continue;
      }
      globalParam.foreignDstMap[foreignDstId] = { snapshot: { meta, recordMap: {}, datasheetId: datasheet.id }, datasheet, fieldPermissionMap };
    }
    // ======= Load linked datasheet structure data (not including records) END =======

    // Traverse records, obtain linked datasheet ID and corresponding linked records
    const foreignDstIdRecordIdsMap = linkedRecordMap || this.forEachRecordMap(dstId, recordMap, fieldIdToLinkDstIdMap);
    // All linking records in link field of main datasheet are stored in foreignDstIdRecordIdsMap
    if (!isEmpty(foreignDstIdRecordIdsMap)) {
      // Query linked datasheet data and linked records
      for (const [foreignDstId, recordIds] of Object.entries(foreignDstIdRecordIdsMap)) {
        const foreignDatasheetDataPack = globalParam.foreignDstMap[foreignDstId];
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`Query new record [${foreignDstId}] --- [${recordIds}]`);
        }
        // linkedRecordMap of robot event, linked datasheet may be unaccessible, skip
        if (!foreignDatasheetDataPack) {
          continue;
        }

        const relatedFieldIds = this.getRelatedFieldIds(foreignDstId, foreignDatasheetDataPack, foreignDstIdToLookupFldIdsMap);

        if (foreignDatasheetDataPack.snapshot.recordMap) {
          const existRecordIds = [...Object.keys(foreignDatasheetDataPack.snapshot.recordMap)];
          if (this.logger.isDebugEnabled()) {
            this.logger.debug(`New record: ${Array.from(recordIds)} - original record: ${existRecordIds} `);
          }
          const theDiff = difference(Array.from(recordIds), existRecordIds);
          if (this.logger.isDebugEnabled()) {
            this.logger.debug(`after filter: ${theDiff}`);
          }
          if (theDiff.length > 0) {
            const addRecordMap = await this.fetchRecordMap(foreignDstId, Array.from(new Set<string>(theDiff)), relatedFieldIds);
            const existRecordMap = foreignDatasheetDataPack.snapshot.recordMap;
            foreignDatasheetDataPack.snapshot.recordMap = { ...addRecordMap, ...existRecordMap };
            globalParam.dstIdToNewRecFlagMap.set(foreignDstId, true);
          }
        } else {
          foreignDatasheetDataPack.snapshot.recordMap =
            await this.fetchRecordMap(foreignDstId, Array.from(recordIds), relatedFieldIds);
        }
      }
    }

    // Process primary field of linked datasheet, formula field requires recursive process
    for (const [fldId, foreignDstId] of fieldIdToLinkDstIdMap.entries()) {
      // exists, skip
      if (globalParam.dstIdToHeadFieldIdMap.has(foreignDstId)) {
        // Create two-way reference
        const headFieldId = globalParam.dstIdToHeadFieldIdMap.get(foreignDstId);
        await this.computeFieldReferenceManager.createReference(dstId, fldId, foreignDstId, [headFieldId]);
        continue;
      }
      // Get view and field data of linked datasheet
      const { views, fieldMap } = globalParam.foreignDstMap[foreignDstId].snapshot.meta;
      // Primary field ID
      const { fieldId } = head((head(views) as IViewProperty).columns)!;
      // Primary field data
      const indexField = fieldMap[fieldId];
      globalParam.dstIdToHeadFieldIdMap.set(foreignDstId, fieldId);
      // Create two-way reference
      await this.computeFieldReferenceManager.createReference(dstId, fldId, foreignDstId, [fieldId]);
      // Only handle formula field
      if (indexField.type === FieldType.Formula) {
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`Linked datasheet [${foreignDstId}] contains formula field`, indexField);
        }
        // Process primary field of linked datasheet, which is a formula field
        await this.processFormulaField(fieldMap, indexField, globalParam);
      }
    }

    // Process LookUp field recursively
    if (!isEmpty(foreignDstIdToLookupFldIdsMap)) {
      for (const [foreignDstId, fieldIds] of Object.entries(foreignDstIdToLookupFldIdsMap)) {
        // Linked datasheet must exist, or skip
        if (!Object.keys(globalParam.foreignDstMap).includes(foreignDstId)) {
          continue;
        }
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`Process new Lookup field recursively [${foreignDstId}] --- [${fieldIds}]`);
        }
        const foreignFieldMap = globalParam.foreignDstMap[foreignDstId].snapshot.meta.fieldMap;
        const foreignRecordMap = globalParam.foreignDstMap[foreignDstId].snapshot.recordMap;
        await this.parseField(foreignDstId, foreignFieldMap, foreignRecordMap, Array.from(fieldIds), globalParam);
      }
    }
  }

  private getRelatedFieldIds(datasheetId: string, foreignDatasheetData: any
    , foreignDstIdToLookupFldIdsMap: { [datasheetId: string]: string[] }) {
    const lookupLinkedFieldIds: string[] = foreignDstIdToLookupFldIdsMap[datasheetId] || [];
    const relatedFieldIds = new Set<string>([...lookupLinkedFieldIds]);
    // Get view and field data of linked datasheet
    const { views } = foreignDatasheetData.snapshot.meta;
    // Primary field ID
    const { fieldId } = head((head(views) as IViewProperty).columns)!;
    relatedFieldIds.add(fieldId);
    return [...relatedFieldIds];
  }

  private async processFormulaField(fieldMap: IFieldMap, formulaField: IFormulaField, globalParam: any, recordMap?: RecordMap) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('Process formula field', formulaField);
    }
    // Get formula expression and the datasheet which the formula field belongs to
    const { expression, datasheetId } = formulaField.property;
    // If formula references fields
    const formulaRefFieldIds = expression.match(/fld\w{10}/g);
    if (!formulaRefFieldIds || isEmpty(formulaRefFieldIds)) return;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('Formula reference fields', formulaRefFieldIds);
    }
    // Create two-way reference relation
    await this.computeFieldReferenceManager.createReference(datasheetId, formulaField.id, datasheetId, formulaRefFieldIds);
    // Get corresponding record data of current datasheet
    if (!recordMap) {
      recordMap = globalParam.foreignDstMap[datasheetId].snapshot.recordMap;
    }
    // process recursively
    await this.parseField(datasheetId, fieldMap, recordMap || {}, formulaRefFieldIds, globalParam);
  }

  /**
   * Traverse records
   *
   * @param recordMap record data
   * @param fieldLinkDstMap field ID -> linked datasheet ID
   * @returns linked records in linked datasheets
   */
  private forEachRecordMap(dstId: string, recordMap: RecordMap, fieldLinkDstMap: Map<string, string>) {
    const beginTime = +new Date();
    this.logger.info(`Start traverse main datasheet ${dstId} records`);
    if (Object.keys(recordMap).length === 0) return {};
    const foreignDstIdRecordIdsMap = Object.values(recordMap).reduce<{ [foreignDstId: string]: string[] }>((pre, cur) => {
      if (!isEmpty(cur) && !isEmpty(cur.data)) {
        // Only process records with link fields
        if (fieldLinkDstMap.size > 0) {
          // All cells containing data
          const fieldIds = [...Object.keys(cur.data)];
          // Process cell data of link field, get linking records from cell data
          // get linked field IDs
          const linkFieldIds = [...fieldLinkDstMap.keys()];
          const inter = intersection<string>(fieldIds, linkFieldIds);
          // If difference is not empty, there are linked datasheet records
          if (inter.length > 0) {
            // corresponding records from linked datasheet
            for (const [fieldId, foreignDstId] of fieldLinkDstMap.entries()) {
              // Only get record IDs if field is in fieldIds
              if (fieldIds.includes(fieldId)) {
                // record IDs of linked datasheet
                const recordIds = cur.data[fieldId] as string[];
                if (recordIds?.length > 0) {
                  // filter out invalid cell values of linked fields
                  const filterRecordIds = recordIds.filter(recId => typeof recId === 'string');
                  if (filterRecordIds.length === 0) {
                    continue;
                  }
                  // Store linked datasheet and corresponding record IDs
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
    this.logger.info(`Finished traversing main datasheet ${dstId} records, duration: ${endTime - beginTime}ms`);
    return foreignDstIdRecordIdsMap;
  }

  private async fetchRecordMap(dstId: string, recordIds: string[], _relatedFieldIds: string[]): Promise<RecordMap> {
    return await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);
  }

  /**
   * Initialize linked datasheet snapshot
   *
   * @param dstId datasheet ID
   * @param globalParam global parameters
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
   * Add a value array to a key-values mapping, if key exists, append the array
   */
  private static setIfExist(map: { [dstId: string]: any[] }, key: string, value: any[]) {
    if (key in map) {
      map[key] = [...map[key]!, ...value];
    } else {
      map[key] = value;
    }
  }

  static getHeadFieldId(meta: IMeta): string {
    return head((head(meta.views) as IViewProperty).columns)!.fieldId;
  }

  async computeFormulaReference(dstId: string, toChangeFormulaExpressions: any[]) {
    for (const { fieldId, createExpression, deleteExpression } of toChangeFormulaExpressions) {
      // Parse new formula expression
      if (createExpression) {
        const formulaRefFieldIds = createExpression.match(/fld\w{10}/g);
        if (!isEmpty(formulaRefFieldIds)) {
          // Create two-way reference relation (cover old relations, remaining part will break two-way reference)
          const members = await this.computeFieldReferenceManager.createReference(dstId, fieldId, dstId, formulaRefFieldIds);
          await this.reverseComputeReference(dstId, fieldId, dstId,
            difference<string>(formulaRefFieldIds, members), difference<string>(members, formulaRefFieldIds));
          continue;
        }
      }
      // Parse deleted formula expression
      if (deleteExpression) {
        const formulaRefFieldIds = deleteExpression.match(/fld\w{10}/g);
        if (!isEmpty(formulaRefFieldIds)) {
          await this.computeFieldReferenceManager.deleteReference(dstId, fieldId, dstId, formulaRefFieldIds);
          await this.reverseComputeReference(dstId, fieldId, dstId, undefined, formulaRefFieldIds);
        }
      }
    }
  }

  async computeDatasheetReference(dstId: string, fieldMap: IFieldMap, dstToMetaMap: Map<string, IMeta>): Promise<string[]> {
    // datasheet ID -> processed field ID set
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
    // Parse main datasheet, obtain all referenced resources
    const specialFieldTypes = [FieldType.Link, FieldType.LookUp, FieldType.Formula];
    const refFieldIds = Object.values(fieldMap).reduce((pre, field) => {
      if (specialFieldTypes.includes(field.type)) {
        pre.push(field.id);
        return pre;
      }
      DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, dstId, [field.id]);
      return pre;
    }, [] as string[]);
    await this.parseFieldReference(dstId, dstId, refFieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
    delete dstIdToProcessedFldIdsMap[dstId];
    return Object.keys(dstIdToProcessedFldIdsMap);
  }

  async deleteLinkFieldReference(dstId: string, mainDstMeta: IMeta,
    fldIdToForeignDatasheetIdMap: Map<string, string>): Promise<string[] | undefined> {
    // Break reference, make sure resource is not referenced before resource leaving room
    // 1. many link fields may link the same datasheet, reference will not be broken before all these fields are deleted
    // 2. there exists indirect reference to this datasheet. Example: A links B & C, B links C and primary field references LinkC field.
    //    After A and C is unlinked, LinkB still references C indirectly.

    // Process link field reference
    const { dstIdToMetaMap, dstIdToProcessedFldIdsMap } =
      await this.processLinkFieldReference(dstId, mainDstMeta, fldIdToForeignDatasheetIdMap, false);

    // Loaded one datasheet means break self-linking, no resource will leave room, return
    if (dstIdToMetaMap.size === 1) {
      return undefined;
    }
    // Parse main datasheet, fetch all referenced resources
    const retainedDstIds = await this.computeDatasheetReference(dstId, mainDstMeta.fieldMap, dstIdToMetaMap);
    return difference<string>(Object.keys(dstIdToProcessedFldIdsMap), retainedDstIds);
  }

  async computeLinkFieldReference(dstId: string, mainDstMeta: IMeta, fldIdToForeignDatasheetIdMap: Map<string, string>): Promise<string[]> {
    const { dstIdToMetaMap } = await this.processLinkFieldReference(dstId, mainDstMeta, fldIdToForeignDatasheetIdMap, true);

    dstIdToMetaMap.delete(dstId);
    return Array.from(dstIdToMetaMap.keys());
  }

  async processLinkFieldReference(dstId: string, mainDstMeta: IMeta, fldIdToForeignDatasheetIdMap: Map<string, string>, creatable: boolean) {
    // datasheet ID -> meta
    const dstIdToMetaMap = new Map<string, IMeta>();
    dstIdToMetaMap.set(dstId, mainDstMeta);
    // datasheet ID -> processed field ID set
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};

    // link field ID -> mapped Lookup field data collection in current datasheet
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
      if (!meta) {
        continue;
      }
      // primary field ID
      const { fieldId } = head((head(meta.views) as IViewProperty).columns)!;
      // Update two-way reference relation of link field
      await updateReference(dstId, fldId, foreignDatasheetId, [fieldId]);
      // Count all influenced fields of linked datasheet
      const allForeignFieldIds = [fieldId];
      if (fldId in linkFldIdToLookUpFieldMap) {
        for (const { lookUpFieldId, lookUpTargetFieldId, openFilter, filterInfo } of linkFldIdToLookUpFieldMap[fldId]!) {
          const foreignFieldIds = [lookUpTargetFieldId];
          // Analyze reference filter condition
          if (openFilter && filterInfo?.conditions.length) {
            filterInfo.conditions.forEach((condition: any) => foreignFieldIds.push(condition.fieldId));
          }
          // Update two-way reference of LookUp field
          await updateReference(dstId, lookUpFieldId, foreignDatasheetId, foreignFieldIds);
          allForeignFieldIds.push(...foreignFieldIds);
        }
      }
      // Skip self-linking
      if (foreignDatasheetId === dstId) {
        continue;
      }
      await this.parseFieldReference(dstId, foreignDatasheetId, allForeignFieldIds, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
      creatable ? await this.reverseComputeReference(dstId, fldId, foreignDatasheetId, allForeignFieldIds, undefined) :
        await this.reverseComputeReference(dstId, fldId, foreignDatasheetId, undefined, allForeignFieldIds);
    }
    return { dstIdToMetaMap, dstIdToProcessedFldIdsMap };
  }

  async removeLookUpReference(dstId: string, meta: IMeta, toDeleteLookUpProperties: any[]): Promise<string[] | undefined> {
    // Compute possible ROOM resource changes caused by removing Lookup reference,
    // Resource only leave room after not referenced.
    // Process Lookup field reference
    const { dstIdToMetaMap, dstIdToProcessedFldIdsMap, foreignDatasheetIds } =
      await this.processLookUpFieldReference(dstId, meta, toDeleteLookUpProperties, false);

    // If all resouces are linked datasheet when changing, just return
    if (foreignDatasheetIds.length === Object.keys(dstIdToProcessedFldIdsMap).length) {
      return undefined;
    }
    // Analyze main datasheet, get all reference resource
    const retainedDstIds = await this.computeDatasheetReference(dstId, meta.fieldMap, dstIdToMetaMap);
    return difference<string>(Object.keys(dstIdToProcessedFldIdsMap), retainedDstIds);
  }

  async computeLookUpReference(dstId: string, meta: IMeta, toCreateLookUpProperties: any[]): Promise<string[] | undefined> {
    // Process Lookup field reference
    const { dstIdToProcessedFldIdsMap, foreignDatasheetIds } =
      await this.processLookUpFieldReference(dstId, meta, toCreateLookUpProperties, true);

    if (!foreignDatasheetIds.length || foreignDatasheetIds.length === Object.keys(dstIdToProcessedFldIdsMap).length) {
      return undefined;
    }
    return difference<string>(Object.keys(dstIdToProcessedFldIdsMap), foreignDatasheetIds);
  }

  private async processLookUpFieldReference(dstId: string, meta: IMeta, properties: any[], creatable: boolean) {
    // datasheet ID -> Meta
    const dstIdToMetaMap = new Map<string, IMeta>();
    dstIdToMetaMap.set(dstId, meta);
    // datasheet ID -> processed field IDs
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
    const foreignDatasheetIds: string[] = [];

    const updateReference = creatable ? this.computeFieldReferenceManager.createReference :
      this.computeFieldReferenceManager.deleteReference;

    const fieldMap = meta.fieldMap;
    for (const { fieldId, relatedLinkFieldId, lookUpTargetFieldId, openFilter, filterInfo } of properties) {
      // This field does not exist in the datasheet, skip
      if (!(relatedLinkFieldId in fieldMap)) {
        continue;
      }
      // Referenced field is not field type, skip
      if (fieldMap[relatedLinkFieldId]!.type !== FieldType.Link) {
        continue;
      }
      const { foreignDatasheetId } = fieldMap[relatedLinkFieldId]!.property;
      const lookUpReferFieldIds = [lookUpTargetFieldId];
      // Analyze reference filter condition
      if (openFilter && filterInfo?.conditions.length) {
        filterInfo.conditions.forEach((condition: any) => lookUpReferFieldIds.push(condition.fieldId));
      }
      // Update two-way reference of LookUp field
      updateReference(dstId, fieldId, foreignDatasheetId, lookUpReferFieldIds);
      // skip self-linking
      if (foreignDatasheetId === dstId) {
        continue;
      }
      // Record linked datasheet ID, linked datasheet resource won't leave ROOM
      foreignDatasheetIds.push(foreignDatasheetId);
      // Parse reference field
      await this.parseFieldReference(dstId, foreignDatasheetId, lookUpReferFieldIds, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
      // Reverse compute reference (depends on field reference cache, must go after field reference parsing)
      creatable ? await this.reverseComputeReference(dstId, fieldId, foreignDatasheetId, lookUpReferFieldIds, undefined) :
        await this.reverseComputeReference(dstId, fieldId, foreignDatasheetId, undefined, lookUpReferFieldIds);
    }
    return { dstIdToMetaMap, dstIdToProcessedFldIdsMap, foreignDatasheetIds };
  }

  private async parseFieldReference(
    mainDstId: string,
    foreignDstId: string,
    refFieldIds: string[],
    dstToMetaMap: Map<string, IMeta>,
    dstIdToProcessedFldIdsMap: { [dstId: string]: string[] }
  ) {
    // Check if linked datasheet fields have been process, if so, get diffrence with processed fields
    const diff = foreignDstId in dstIdToProcessedFldIdsMap ? difference<string>(refFieldIds, dstIdToProcessedFldIdsMap[foreignDstId]!) : refFieldIds;
    // No unprocessed fields, return
    if (!diff.length) {
      return;
    }
    // New unprocessed field, put it in processed fields
    DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, foreignDstId, refFieldIds);

    for (const refFieldId of diff) {
      // Get reference relation
      const dstToFiledMap = await this.computeFieldReferenceManager.getRefDstToFieldMap(foreignDstId, refFieldId);
      if (dstToFiledMap) {
        for (const [datasheetId, fieldIds] of dstToFiledMap.entries()) {
          // skip self-linking
          if (datasheetId === mainDstId) {
            continue;
          }
          // parse field reference recursively
          await this.parseFieldReference(mainDstId, datasheetId, fieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
        }
        continue;
      }

      // Get reference relation failed, analyze field loading
      const meta = await this.getMeta(foreignDstId, dstToMetaMap);
      if (!meta) {
        return;
      }
      const fieldMap = meta.fieldMap;
      const fieldInfo = fieldMap[refFieldId];
      if (!fieldInfo) {
        continue;
      }
      switch (fieldInfo.type) {
        case FieldType.Link:
          const fieldProperty = fieldInfo.property as ILinkFieldProperty;
          const linkDatasheetId = fieldProperty.foreignDatasheetId;
          // Links main datasheet, skip
          if (linkDatasheetId === mainDstId) {
            break;
          }
          const linkDstMeta = await this.getMeta(linkDatasheetId, dstToMetaMap);
          if (!linkDstMeta) {
            break;
          }
          // primary field ID
          const { fieldId } = head((head(linkDstMeta.views) as IViewProperty).columns)!;
          // Create two-way reference
          await this.computeFieldReferenceManager.createReference(foreignDstId, refFieldId, linkDatasheetId, [fieldId]);
          // Parse field reference recursively
          await this.parseFieldReference(mainDstId, linkDatasheetId, [fieldId], dstToMetaMap, dstIdToProcessedFldIdsMap);
          break;
        case FieldType.LookUp:
          const { relatedLinkFieldId, lookUpTargetFieldId, openFilter, filterInfo } = fieldInfo.property as ILookUpProperty;
          // Current datasheet does not contain the field, skip
          if (!fieldMap[relatedLinkFieldId]) {
            break;
          }
          // Linked field is not a link field, skip
          if (fieldMap[relatedLinkFieldId]!.type !== FieldType.Link) {
            break;
          }
          // Get linked datasheet ID
          const { foreignDatasheetId } = fieldMap[relatedLinkFieldId]!.property as ILinkFieldProperty;
          const foreignFieldIds = [lookUpTargetFieldId];
          // Analyze reference filter condition
          if (openFilter && filterInfo?.conditions.length) {
            filterInfo.conditions.forEach(condition => foreignFieldIds.push(condition.fieldId));
          }
          // Create two-way reference
          await this.computeFieldReferenceManager.createReference(foreignDstId, refFieldId, foreignDatasheetId, foreignFieldIds);
          // Links main datasheet, skip
          if (foreignDatasheetId === mainDstId) {
            break;
          }
          // Parse field reference recursively
          await this.parseFieldReference(mainDstId, foreignDatasheetId, foreignFieldIds, dstToMetaMap, dstIdToProcessedFldIdsMap);
          break;
        case FieldType.Formula:
          // Analyze formula expression
          const formulaRefFieldIds = fieldInfo.property.expression.match(/fld\w{10}/g);
          if (!formulaRefFieldIds || isEmpty(formulaRefFieldIds)) {
            continue;
          }
          await this.computeFieldReferenceManager.createReference(foreignDstId, refFieldId, foreignDstId, formulaRefFieldIds);
          // Parse field reference recursively
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
      dstToMetaMap.set(datasheetId, meta!);
    }
    return meta!;
  }

  /**
   * Reverse compute field reference, update ROOM with resource changes caused by reference
   * Example:
   * If A links B, room A contains resource A and B. Then in room B, change primary field of B to formula referencing field LinkC,
   * then references in field LinkB of datasheet A should track data in datasheet C, when processing such op, resource C must be
   * added to room A.
   */
  private async reverseComputeReference(dstId: string, fieldId: string, relDstId: string, addRefFldIds?: string[], delRefFldIds?: string[]) {
    let addResourceIds: string[] = [];
    let delResourceIds: string[] = [];
    // Compute new referenced field
    if (addRefFldIds && addRefFldIds.length > 0) {
      // datasheet ID -> processed field ID set
      const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
      await this.recurseComputeFieldReference(relDstId, addRefFldIds, dstIdToProcessedFldIdsMap);
      delete dstIdToProcessedFldIdsMap[dstId];
      addResourceIds = Object.keys(dstIdToProcessedFldIdsMap);
    }

    // Compute deleted reference field
    if (delRefFldIds && delRefFldIds.length > 0) {
      // datasheet ID -> processed field ID set
      const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
      await this.recurseComputeFieldReference(relDstId, delRefFldIds, dstIdToProcessedFldIdsMap);
      delete dstIdToProcessedFldIdsMap[dstId];
      delResourceIds = difference<string>(Object.keys(dstIdToProcessedFldIdsMap), addResourceIds);
    }

    // changed resource set does not exist, quit
    if (!addResourceIds.length && !delResourceIds.length) {
      return;
    }

    // Get backward reference relation
    const dstToFiledMap = await this.computeFieldReferenceManager.getReRefDstToFieldMap(dstId, fieldId);
    // No relation references this field, quit
    if (!dstToFiledMap) {
      return;
    }
    // datasheet ID -> meta
    const dstIdToMetaMap = new Map<string, IMeta>();
    // datasheet ID -> processed field ID set
    const dstIdToProcessedFldIdsMap: { [dstId: string]: string[] } = {};
    // Update ROOM recursively with resource change caused by reference
    await this.recurseUpdateReverseRoom(dstId, addResourceIds, delResourceIds, dstToFiledMap, dstIdToMetaMap, dstIdToProcessedFldIdsMap);
  }

  private async recurseComputeFieldReference(dstId: string, fieldIds: string[], dstIdToProcessedFldIdsMap: { [dstId: string]: string[] }) {
    // Get processed field IDs
    const processedFldIds = [...Object.values(dstIdToProcessedFldIdsMap[dstId] || {})] as string[];
    const diff = difference<string>(fieldIds, processedFldIds);
    // If difference is empty, no unprocessed fields
    if (diff.length === 0) {
      return;
    }
    // New field, put it in processed field set
    DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, dstId, diff);

    for (const fieldId of diff) {
      // Get reference relation
      const dstToFiledMap = await this.computeFieldReferenceManager.getRefDstToFieldMap(dstId, fieldId);
      if (!dstToFiledMap) {
        continue;
      }
      for (const [datasheetId, fieldIds] of dstToFiledMap.entries()) {
        // Compute field reference recursively
        await this.recurseComputeFieldReference(datasheetId, fieldIds, dstIdToProcessedFldIdsMap);
      }
    }
  }

  private async recurseUpdateReverseRoom(
    dstId: string,
    addResourceIds: string[],
    delResourceIds: string[],
    dstToFiledMap: Map<string, string[]>,
    dstIdToMetaMap: Map<string, IMeta>,
    dstIdToProcessedFldIdsMap: { [dstId: string]: string[] }
  ) {
    for (const [datasheetId, fieldIds] of dstToFiledMap.entries()) {
      // Get processed field IDs
      const processedFldIds = [...Object.values(dstIdToProcessedFldIdsMap[datasheetId] || {})] as string[];
      const diff = difference<string>(fieldIds, processedFldIds);
      // If difference is empty, no unprocessed fields
      if (diff.length === 0) {
        continue;
      }
      // New field, put it in processed field set
      DatasheetFieldHandler.setIfExist(dstIdToProcessedFldIdsMap, datasheetId, diff);

      // Linked datasheet is not self and occurs in processing the first time, update ROOM (avoid updating the same ROOM)
      if (datasheetId !== dstId && !processedFldIds.length) {
        if (addResourceIds.length) {
          await this.roomResourceRelService.createOrUpdateRel(datasheetId, addResourceIds);
        }
        if (delResourceIds.length) {
          const meta = await this.getMeta(datasheetId, dstIdToMetaMap);
          if (!meta) {
            continue;
          }
          // Analyze main datasheet, obtain all referenced resources
          const retainedDstIds = await this.computeDatasheetReference(datasheetId, meta.fieldMap, dstIdToMetaMap);
          const delDstIds = difference<string>(delResourceIds, retainedDstIds);
          await this.roomResourceRelService.removeRel(datasheetId, delDstIds);
        }
      }

      for (const fieldId of diff) {
        // Get backward reference relation
        const dstIdToFiledIdsMap = await this.computeFieldReferenceManager.getReRefDstToFieldMap(datasheetId, fieldId);
        if (!dstIdToFiledIdsMap) {
          continue;
        }
        // Recursively update ROOM with resource change caused by reference
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
