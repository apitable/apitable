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
  composeOperation, composeOperations, ExecuteResult, FieldType, IFieldMap, ILocalChangeset, IOperation, IReduxState, ResourceType, Selectors,
  StoreActions
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { Store } from 'redux';
import { CommonException, OtException, ServerException } from '../../../shared/exception';
import { ChangesetBaseDto } from '../dtos/changeset.base.dto';
import { DatasheetChangesetEntity } from '../entities/datasheet.changeset.entity';
import { INodeCopyRo, INodeDeleteRo } from '../../interfaces/grpc.interface';
import { DatasheetChangesetRepository } from '../repositories/datasheet.changeset.repository';
import { CommandOptionsService } from 'database/command/services/command.options.service';
import { CommandService } from 'database/command/services/command.service';
import { UnitService } from 'unit/services/unit.service';
import { UnitInfoDto } from '../../../unit/dtos/unit.info.dto';
import { IdWorker } from '../../../shared/helpers';

@Injectable()
export class DatasheetChangesetService {
  constructor(
    private readonly datasheetChangesetRepository: DatasheetChangesetRepository,
    private readonly commandOption: CommandOptionsService,
    private readonly commandService: CommandService,
    private readonly unitService: UnitService,
  ) {}

  async getAllCommentChangeSetByDstId(dstId: string) {
    return await this.datasheetChangesetRepository.find({
      where:  (qb: any) => {
        qb.where(`dst_id = '${dstId}' `);
        qb.andWhere('operations->\'$[0].cmd\' = \'InsertComment\'');
      }
    });
  }

  async recoverChangeSets(dstId: string, changeSets: DatasheetChangesetEntity[]) {
    if (!changeSets || !changeSets.length) {
      return;
    }
    changeSets.forEach(item => {
      item.dstId = dstId;
      item.id = IdWorker.nextId() + '';
      item.revision = 0;
    });
    await this.datasheetChangesetRepository
      .createQueryBuilder()
      .insert()
      .values(changeSets)
      .execute();
  }

  /**
   *
   * @param ro query parameters
   * @param store redux store
   * @return
   * @author Zoe Zheng
   * @date 2021/3/30 2:29 PM
   */
  getCopyNodeChangesets(ro: INodeCopyRo, store: Store<IReduxState>): ILocalChangeset[] | null {
    const changesetMap = new Map<string, ILocalChangeset>();
    this.copyNodeSetFieldAttrChangesets(ro, store, changesetMap);
    this.copeNodeSetRecordsChangesets(ro, store, changesetMap);
    if (changesetMap.size) {
      return Array.from(changesetMap.values());
    }
    return null;
  }

  /**
   * @param ro query parameters
   * @param store redux store
   * @return ILocalChangeset[] | null
   * @author Zoe Zheng
   * @date 2021/4/1 2:53 PM
   */
  getDeleteNodeChangesets(ro: INodeDeleteRo, store: Store<IReduxState>): ILocalChangeset[] | null {
    const changesetMap = new Map<string, ILocalChangeset>();
    ro.deleteNodeId.map(nodeId => {
      const fieldMap = Selectors.getFieldMap(store.getState(), nodeId);
      Object.values(fieldMap!).map(field => {
        // Is linked field and linked datasheet is deleted, convert this field to multi-line text field
        if ((field.type === FieldType.Link || field.type === FieldType.OneWayLink) && ro.linkNodeId.includes(field.property.foreignDatasheetId)) {
          const options = this.commandOption.getSetFieldAttrOptions(nodeId, { ...field, property: null, type: FieldType.Text }, false);
          const { result, changeSets } = this.commandService.execute(options, store);
          if (result && result.result == ExecuteResult.Success) {
            changeSets.map(item => {
              // add operations
              this.changesetAddOperations(changesetMap, item);
            });
          } else {
            // throw ot exception
            throw new ServerException(new OtException(CommonException.COMMON_ERROR_CODE, ('reason' in result && result.reason) || result.result));
          }
        }
      });
    });
    return Array.from(changesetMap.values());
  }

  public changesetAddOperations(changesetMap: Map<string, ILocalChangeset>, item: ILocalChangeset) {
    if (changesetMap.has(item.resourceId)) {
      changesetMap.get(item.resourceId)?.operations.push(...item.operations);
    } else {
      changesetMap.set(item.resourceId, item);
    }
  }

  /**
   * @param spaceId space ID
   * @param dstId datasheet ID
   * @param recordId record ID
   * @param lastChangeset last non-comment changeset of previous page
   * @param revisions changeset revisions
   * @param filedIds preserved fields
   * @return { changesets: ChangesetBaseDto[]; users: UnitBaseInfoDto[] }
   * @author Zoe Zheng
   * @date 2021/4/14 2:50 PM
   */
  async getRecordActivityChangesetList(
    spaceId: string,
    dstId: string,
    recordId: string,
    lastChangeset: ChangesetBaseDto | undefined,
    revisions: string[],
    filedIds: string[],
  ): Promise<{ commentChangesets: ChangesetBaseDto[]; users: UnitInfoDto[]; recordChangesets: ChangesetBaseDto[] }> {
    const entities: (DatasheetChangesetEntity & { isComment: string })[]
      = await this.datasheetChangesetRepository.selectDetailByDstIdAndRevisions(dstId, revisions);
    if (!entities.length) {
      return { commentChangesets: [], users: [], recordChangesets: [] };
    }
    const { recordModifyEntities, commentEntities, userIds } = this.groupChangesets(entities);
    const userMap: Map<string, UnitInfoDto> = await this.unitService.getUnitMemberInfoByUserIds(spaceId, Array.from(userIds), false);
    let recordChangesets: ChangesetBaseDto[] = [];
    // Merge non-comment changesets
    if (recordModifyEntities.length) {
      // Use map to make sure changesets are unique
      const changesetMap = this.composeRecordModifyChangeset(dstId, recordId, lastChangeset, userMap, filedIds, recordModifyEntities);
      recordChangesets = Array.from(changesetMap.values());
    }
    let commentChangesets: ChangesetBaseDto[] = [];
    if (commentEntities.length) {
      commentChangesets = commentEntities.reduce<ChangesetBaseDto[]>((pre, cur) => {
        if (cur.operations) {
          pre.push(this.formatDstChangesetDto(dstId, cur, userMap, cur.operations));
        }
        return pre;
      }, []);
    }
    return { commentChangesets, users: Array.from(userMap.values()), recordChangesets };
  }

  async getRecordModifyRevisions(dstId: string, revisions: string[], limitDays: number): Promise<string[]> {
    const raws = await this.datasheetChangesetRepository.selectRevisionsByDstIdAndLimitDays(dstId, revisions, limitDays);
    if (raws) return raws.map(raw => raw.revision);
    return [];
  }

  composeRecordModifyChangeset(
    dstId: string,
    recordId: string,
    lastChangeset: ChangesetBaseDto | undefined,
    userMap: Map<string, UnitInfoDto>,
    fieldIds: string[],
    entities: (DatasheetChangesetEntity & { isComment: string })[],
  ): Map<string, ChangesetBaseDto> {
    const changesetMap: Map<string, ChangesetBaseDto> = new Map<string, ChangesetBaseDto>();
    // Put last changeset in map and then merge them
    if (lastChangeset) {
      changesetMap.set(lastChangeset.messageId, lastChangeset);
    }
    entities.reduce<string[]>((pre, entity) => {
      if (!entity.operations) {
        return pre;
      }
      let operations = this.filterRecordActivityOperations(recordId, fieldIds, entity.operations);
      if (operations.length > 1) {
        operations = composeOperations(operations);
      }
      if (operations.length) {
        const curChangeset = this.formatDstChangesetDto(dstId, entity, userMap, operations);
        let messageId: string | undefined;
        if (pre.length) {
          messageId = pre.pop();
        } else if (!pre.length && lastChangeset) {
          messageId = lastChangeset.messageId;
          // Mark lastChangeset is used
          lastChangeset = undefined;
        }
        // messageId is null when lastChangeset is undefined or first iteration
        const preChangeset = messageId ? changesetMap.get(messageId) : undefined;
        const changeset = this.composeChangeset(preChangeset, curChangeset, 30);
        // No changesets after merging cur and pre, and messageId is not from previous changeset.
        if (!changeset) {
          changesetMap.delete(messageId!);
        } else {
          changesetMap.set(changeset.messageId, changeset);
          pre.push(changeset.messageId);
        }
      }
      return pre;
    }, []);
    return changesetMap;
  }

  private copyNodeSetFieldAttrChangesets(ro: INodeCopyRo, store: Store<IReduxState>, changesetMap: Map<string, ILocalChangeset>) {
    const originalSnapshot = Selectors.getSnapshot(store.getState(), ro.nodeId);
    const originalFieldMap = originalSnapshot!.meta.fieldMap;
    const fieldMap = Selectors.getFieldMap(store.getState(), ro.copyNodeId)!;
    // Change converted text field to link field, restore datasheet structure of copied datasheet
    const copyNodeOperations = new Map<string, IOperation[]>();
    ro.fieldIds.map(fieldId => {
      if (originalFieldMap[fieldId]!.type === fieldMap[fieldId]!.type) return;
      // Find fields that need change
      const field = originalFieldMap[fieldId]!;
      const setFieldAttrOptions = this.commandOption.getSetFieldAttrOptions(ro.copyNodeId, field, false);
      const { result, changeSets } = this.commandService.execute(setFieldAttrOptions, store);
      if (result && result.result == ExecuteResult.Success) {
        changeSets.map(item => {
          this.changesetAddOperations(changesetMap, item);
          // apply succeeded operations, writing data, to avoid field name duplicate
          store.dispatch(StoreActions.applyJOTOperations(item.operations, ResourceType.Datasheet, item.resourceId));
        });
      } else {
        throw new ServerException(new OtException(CommonException.COMMON_ERROR_CODE, ('reason' in result && result.reason) || result.result));
      }
    });
    return copyNodeOperations;
  }

  /**
   *
   * @param ro query parameters
   * @param store redux store
   * @param changesetMap changeset collector
   * @return
   * @author Zoe Zheng
   * @date 2021/3/30 5:28 PM
   */
  private copeNodeSetRecordsChangesets(ro: INodeCopyRo, store: Store<IReduxState>, changesetMap: Map<string, ILocalChangeset>) {
    // Set link, otherwise data cannot be written
    store.dispatch(StoreActions.setDatasheetConnected(ro.copyNodeId));
    // copy data changeset
    const originalSnapshot = Selectors.getSnapshot(store.getState(), ro.nodeId);
    // This fieldMap is the same as original node
    const fieldMap = Selectors.getFieldMap(store.getState(), ro.copyNodeId)!;
    // Filter fields that need change
    const modifiedFieldMap = ro.fieldIds.reduce<IFieldMap>((pre, cur) => {
      pre[cur] = fieldMap[cur]!;
      return pre;
    }, {});
    // Get values of fields that need change
    const setRecordsOptions = this.commandOption.getSetRecordsOptions(ro.copyNodeId, originalSnapshot!.recordMap, modifiedFieldMap);
    const { result, changeSets } = this.commandService.execute(setRecordsOptions, store);
    // Don't throw exception when written data is none
    if (result && (result.result == ExecuteResult.Success || result.result == ExecuteResult.None)) {
      changeSets.map(item => {
        this.changesetAddOperations(changesetMap, item);
      });
    } else {
      throw new ServerException(new OtException(CommonException.COMMON_ERROR_CODE, ('reason' in result && result.reason) || result.result));
    }
  }

  /**
   * Change record to show filter
   *
   * @param recordId record ID
   * @param fieldIds field IDs of current datasheet
   * @param operations changeset
   * @private
   */
  private filterRecordActivityOperations(recordId: string, fieldIds: string[], operations: IOperation[]) {
    return operations.reduce<IOperation[]>((pre, cur) => {
      // Filter out System and Comment commands, field deletion op is not shown, record changes caused by field deletion are not show either.
      if (!cur.cmd.includes('System') && !cur.cmd.includes('Comment')) {
        // Filter out field changes that do not relate to record change and field deletion,
        // and filter out actions that do not relate to the current recordId
        const actions = cur.actions.filter(action => {
          return (
            (action.p.includes('fieldMap') && cur.actions.length > 1 && fieldIds.includes(action.p[2]!.toString())) ||
            (action.p[1] == recordId && action.p[2] == 'data' && fieldIds.includes(action.p[3]!.toString())) ||
            (action.p[1] == recordId && action.p[2] == 'comments') ||
            // Only record creation with default values contains oi.data
            (action.p[0] == 'recordMap' && action.p[1] == recordId && 'oi' in action && action.oi?.data && Object.keys(action.oi.data).length) ||
            (action.p[0] == 'recordMap' && action.p[1] == recordId && 'od' in action)
          );
        });
        if (actions.length) {
          pre.push({ ...cur, actions });
        }
      }
      return pre;
    }, []);
  }

  /**
   * Merge two changesets, don't merge comments
   *
   * @param cur current changeset
   * @param pre pre.revision > cur.revision because of descending order
   * @param timeInterval optional time interval
   */
  composeChangeset(pre: ChangesetBaseDto | undefined, cur: ChangesetBaseDto, timeInterval?: number): ChangesetBaseDto | null {
    // Don't merge changesets caused by different users
    if (!pre || pre.userId !== cur.userId) {
      return cur;
    }
    if (pre.operations.length === cur.operations.length && timeInterval && pre.createdAt - cur.createdAt < timeInterval * 1000) {
      const composeOperations: IOperation[] = [];
      let composed = false;
      cur.operations.forEach((value, index) => {
        // op is field property change when index > 1, no need to change
        const { operation, isComposed } = composeOperation(pre.operations[index]!, value);
        composed = isComposed || composed;
        // operation is null if merged.
        if (operation != null) {
          composeOperations.push(operation);
        }
      });
      if (composeOperations.length > 0) {
        if (composed) {
          // After merge, update pre in Map
          return { ...pre, operations: composeOperations, createdAt: cur.createdAt };
        }
        // After merge, return cur verbatim
        return cur;
      }
      // action is empty after merge, delete pre in Map
      return null;
    }
    // Return current changeset if cannot merge, insert curr into Map
    return cur;
  }

  /**
   * Split changesets into comments and record changes and return them.
   *
   * @param entities source data from database
   * @return
   * @author Zoe Zheng
   * @date 2021/5/24 11:29 AM
   */
  private groupChangesets(entities: (DatasheetChangesetEntity & { isComment: string })[]) {
    const recordModifyEntities: (DatasheetChangesetEntity & { isComment: string })[] = [];
    const commentEntities: (DatasheetChangesetEntity & { isComment: string })[] = [];
    const userIds = new Set<string>();
    entities.map(item => {
      userIds.add(item.createdBy);
      if (Number(item.isComment)) {
        commentEntities.push(item);
      } else {
        recordModifyEntities.push(item);
      }
    });
    return { recordModifyEntities, commentEntities, userIds };
  }

  private formatDstChangesetDto(
    dstId: string,
    entity: DatasheetChangesetEntity & { isComment: string },
    userMap: Map<string, UnitInfoDto>,
    operations: IOperation[],
  ) {
    const createdAt = Date.parse(entity.createdAt.toString());
    return {
      ...entity,
      messageId: entity.messageId || '',
      operations,
      createdBy: undefined,
      revision: Number(entity.revision),
      userId: userMap.get(entity.createdBy)?.userId || '',
      createdAt: createdAt,
      resourceId: dstId,
      resourceType: ResourceType.Datasheet,
      isComment: Number(entity.isComment),
      tmpCreatedAt: createdAt,
    };
  }

  async selectByDstIdAndRevisions(dstId: string, revisions: number[]): Promise<DatasheetChangesetEntity[]> {
    return await this.datasheetChangesetRepository.selectByDstIdAndRevisions(dstId, revisions);
  }

  async countByDstIdAndMessageId(dstId: string, messageId: string): Promise<number> {
    return await this.datasheetChangesetRepository.countByDstIdAndMessageId(dstId, messageId);
  }

  async getChangesetOrderList(dstId: string, startRevision: number, endRevision: number): Promise<any[]> {
    return await this.datasheetChangesetRepository.getChangesetOrderList(dstId, startRevision, endRevision);
  }
}
