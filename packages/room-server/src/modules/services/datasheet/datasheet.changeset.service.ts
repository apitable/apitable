import { Injectable } from '@nestjs/common';
import { composeOperation, composeOperations, ExecuteResult, FieldType, IFieldMap, ILocalChangeset, IOperation, IReduxState, ResourceType, Selectors, StoreActions } from '@apitable/core';
import { INodeCopyRo, INodeDeleteRo } from 'controllers/internal/grpc/grpc.interface';
import { DatasheetChangesetEntity } from 'entities/datasheet.changeset.entity';
import { CommonException, OtException, ServerException } from 'exception';
import { ChangesetBaseDto } from 'model/dto/datasheet/changeset.base.dto';
import { UnitBaseInfoDto } from 'model/dto/unit/unit.base.info.dto';
import { DatasheetChangesetRepository } from 'modules/repository/datasheet.changeset.repository';
import { Store } from 'redux';
import { CommandOptionsService } from '../command/impl/command.options.service';
import { CommandService } from '../command/impl/command.service';
import { UnitService } from '../unit/unit.service';

@Injectable()
export class DatasheetChangesetService {
  constructor(
     private readonly datasheetChangesetRepository: DatasheetChangesetRepository,
     private readonly commandOption: CommandOptionsService,
     private readonly commandService: CommandService,
     private readonly unitService: UnitService,
  ) {}

  /**
   *
   * @param ro 复制数表参数
   * @param store 数据存储
   * @return
   * @author Zoe Zheng
   * @date 2021/3/30 2:29 下午
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
   * 获取删除节点的changeset
   * @param ro 删除节点参数
   * @param store 数据存储
   * @return ILocalChangeset[] | null
   * @author Zoe Zheng
   * @date 2021/4/1 2:53 下午
   */
  getDeleteNodeChangesets(ro: INodeDeleteRo, store: Store<IReduxState>): ILocalChangeset[] | null {
    const changesetMap = new Map<string, ILocalChangeset>();
    ro.deleteNodeId.map(nodeId => {
      const fieldMap = Selectors.getFieldMap(store.getState(), nodeId);
      Object.values(fieldMap!).map(field => {
        // 关联字段，并且关联表是删除的节点，将此列转换成多行文本字段
        if (field.type === FieldType.Link && ro.linkNodeId.includes(field.property.foreignDatasheetId)) {
          const options = this.commandOption.getSetFieldAttrOptions(nodeId, { ...field, property: null, type: FieldType.Text }, false);
          const { result, changeSets } = this.commandService.execute(options, store);
          if (result && result.result == ExecuteResult.Success) {
            changeSets.map(item => {
              if (changesetMap.has(item.resourceId)) {
                changesetMap.get(item.resourceId)?.operations.push(...item.operations);
              } else {
                changesetMap.set(item.resourceId, item);
              }
            });
          } else {
            throw new ServerException(new OtException(CommonException.COMMON_ERROR_CODE, ('reason' in result && result.reason) || result.result));
          }
        }
      });
    });
    return Array.from(changesetMap.values());
  }

  /**
   * 获取record的changesets
   * @param spaceId 空间ID
   * @param dstId 数表ID
   * @param recordId 记录ID
   * @param lastChangeset 上一页的最后一个不是评论的changeset
   * @param revisions 变更版本号列表
   * @param filedIds 需要保留的列
   * @return { changesets: ChangesetBaseDto[]; users: UnitBaseInfoDto[] }
   * @author Zoe Zheng
   * @date 2021/4/14 2:50 下午
   */
  async getRecordActivityChangesetList(
    spaceId: string,
    dstId: string,
    recordId: string,
    lastChangeset: ChangesetBaseDto | undefined,
    revisions: string[],
    filedIds: string[],
  ): Promise<{ commentChangesets: ChangesetBaseDto[]; users: UnitBaseInfoDto[]; recordChangesets: ChangesetBaseDto[] }> {
    const entities: (DatasheetChangesetEntity & { isComment: string })[]
      = await this.datasheetChangesetRepository.selectDetailByDstIdAndRevisions(dstId, revisions);
    if (!entities.length) {
      return { commentChangesets: [], users: [], recordChangesets: [] };
    }
    const { recordModifyEntities, commentEntities, userIds } = this.groupChangesets(entities);
    const userMap: Map<string, UnitBaseInfoDto> = await this.unitService.getUnitMemberInfoByUserIds(spaceId, Array.from(userIds), false);
    let recordChangesets: ChangesetBaseDto[] = [];
    // 合并非评论的changeset
    if (recordModifyEntities.length) {
      // 使用map保证唯一性
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
    // 将comment和record根据版本号进行排序返回
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
    userMap: Map<string, UnitBaseInfoDto>,
    fieldIds: string[],
    entities: (DatasheetChangesetEntity & { isComment: string })[],
  ): Map<string, ChangesetBaseDto> {
    // 使用map保证唯一性
    const changesetMap: Map<string, ChangesetBaseDto> = new Map<string, ChangesetBaseDto>();
    // 把上一个放回map中，进行合并
    if (lastChangeset) {
      changesetMap.set(lastChangeset.messageId, lastChangeset);
    }
    let composeStartAt;
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
        if (composeStartAt) curChangeset.tmpCreatedAt = composeStartAt;
        let messageId;
        if (pre.length) {
          messageId = pre.pop();
        } else if (!pre.length && lastChangeset) {
          messageId = lastChangeset.messageId;
          // 标记已经用过了
          lastChangeset = undefined;
        }
        // 没有lastChangeset和第一次的时候messageId为null
        const preChangeset = messageId ? changesetMap.get(messageId) : undefined;
        const changeset = this.composeChangeset(preChangeset, curChangeset, 30);
        // cur 跟 pre 记录合并后没有任何改动,并且不是上一个的messageId
        if (!changeset) {
          changesetMap.delete(messageId);
          // 将下一个的tmpCreatedAt置为合并之前的时间
          composeStartAt = preChangeset?.tmpCreatedAt;
        } else {
          changesetMap.set(changeset.messageId, changeset);
          pre.push(changeset.messageId);
          composeStartAt = null;
        }
      }
      return pre;
    }, []);
    return changesetMap;
  }

  private copyNodeSetFieldAttrChangesets(ro: INodeCopyRo, store: Store<IReduxState>, changesetMap: Map<string, ILocalChangeset>) {
    const originalSnapshot = Selectors.getSnapshot(store.getState(), ro.nodeId);
    const originalFieldMap = originalSnapshot!.meta.fieldMap;
    const fieldMap = Selectors.getFieldMap(store.getState(), ro.copyNodeId);
    // 修改转换的文本字段为关联字段，恢复复制表的表结构
    const copyNodeOperations = new Map<string, IOperation[]>();
    ro.fieldIds.map(fieldId => {
      if (originalFieldMap[fieldId].type === fieldMap![fieldId].type) return;
      // 找出需要修改的列, 这里保持列名和ID都一样，添加关联列中的property.brotherFieldId会被command重置
      const field = originalFieldMap[fieldId];
      const setFieldAttrOptions = this.commandOption.getSetFieldAttrOptions(ro.copyNodeId, field, false);
      const { result, changeSets } = this.commandService.execute(setFieldAttrOptions, store);
      if (result && result.result == ExecuteResult.Success) {
        changeSets.map(item => {
          if (changesetMap.has(item.resourceId)) {
            changesetMap.get(item.resourceId)?.operations.push(...item.operations);
          } else {
            changesetMap.set(item.resourceId, item);
          }
          // 应用之前成功的operations，进行数据的写入,防止field名称重复
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
   * @param ro 复制节点参数
   * @param store 数据存储
   * @param changesetMap changeset收集器
   * @return
   * @author Zoe Zheng
   * @date 2021/3/30 5:28 下午
   */
  private copeNodeSetRecordsChangesets(ro: INodeCopyRo, store: Store<IReduxState>, changesetMap: Map<string, ILocalChangeset>) {
    // 设置链接，不然无法写入数据
    store.dispatch(StoreActions.setDatasheetConnected(ro.copyNodeId));
    // copy数据的changeset
    const originalSnapshot = Selectors.getSnapshot(store.getState(), ro.nodeId);
    // 这里的fieldMap已经和原来的的节点保持一致了
    const fieldMap = Selectors.getFieldMap(store.getState(), ro.copyNodeId);
    // 过滤出修改的列
    const modifiedFieldMap = ro.fieldIds.reduce<IFieldMap>((pre, cur) => {
      pre[cur] = fieldMap![cur];
      return pre;
    }, {});
    // 获取修改列的值
    const setRecordsOptions = this.commandOption.getSetRecordsOptions(ro.copyNodeId, originalSnapshot!.recordMap, modifiedFieldMap);
    const { result, changeSets } = this.commandService.execute(setRecordsOptions, store);
    // 写入数据 none 不用抛出异常
    if (result && (result.result == ExecuteResult.Success || result.result == ExecuteResult.None)) {
      changeSets.map(item => {
        if (changesetMap.has(item.resourceId)) {
          changesetMap.get(item.resourceId)?.operations.push(...item.operations);
        } else {
          changesetMap.set(item.resourceId, item);
        }
      });
    } else {
      throw new ServerException(new OtException(CommonException.COMMON_ERROR_CODE, ('reason' in result && result.reason) || result.result));
    }
  }

  /**
   * 修改记录展示filter
   *
   * @param recordId 记录ID
   * @param fieldIds 当前表的列ID
   * @param operations 变化集
   * @private
   */
  private filterRecordActivityOperations(recordId: string, fieldIds: string[], operations: IOperation[]) {
    return operations.reduce<IOperation[]>((pre, cur) => {
      // 过滤系统, 删除列op不展示，删除列对应的record修改记录也不展示
      if (!cur.cmd.includes('System') && !cur.cmd.includes('Comment')) {
        // 过滤列属性修改没有涉及到record和删除列，过滤不涉及到此次修改的recordId的actions
        const actions = cur.actions.filter(action => {
          return (
            (action.p.includes('fieldMap') && cur.actions.length > 1 && fieldIds.includes(action.p[2].toString())) ||
            (action.p[1] == recordId && action.p[2] == 'data' && fieldIds.includes(action.p[3].toString())) ||
            (action.p[1] == recordId && action.p[2] == 'comments') ||
            // 新增记录有默认值,只有新增记录才会有oi.data
            (action.p[0] == 'recordMap' && action.p[1] == recordId && 'oi' in action && action.oi?.data && Object.keys(action.oi.data).length)
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
   * 合并两个changeset 评论不进行合并
   *
   * @param cur 当前changeset
   * @param pre 由于是倒序排序，pre的revision大于cur的revision
   * @param timeInterval 时间间隔 可选
   */
  composeChangeset(pre: ChangesetBaseDto | undefined, cur: ChangesetBaseDto, timeInterval?: number): ChangesetBaseDto | null {
    // 不同用户记录不合并
    if (!pre || pre.userId !== cur.userId) {
      return cur;
    }
    if (pre.operations.length === cur.operations.length && timeInterval && pre.createdAt - cur.createdAt < timeInterval * 1000) {
      const composeOperations: IOperation[] = [];
      let composed = false;
      cur.operations.forEach((value, index) => {
        // 大于一是列配置的修改 不需要修改
        const { operation, isComposed } = composeOperation(pre.operations[index], value);
        composed = isComposed || composed;
        // 标记是否产生了合并
        // 合并之后没有了
        if (operation != null) {
          composeOperations.push(operation);
        }
      });
      if (composeOperations.length > 0) {
        if (composed) {
          // 合并后 pre messageId 更新 Map pre 记录
          return { ...pre, operations: composeOperations, createdAt: cur.createdAt };
        }
        // 合并后 原样返回了cur
        return cur;
      }
      // 表示合并后 action 为空，更新 Map 删除 pre 记录
      return null;
    }
    // 不能合并则返回当前 changeset, 更新 Map 新增 curr 记录
    return cur;
  }

  /**
   * 将评论和record的修改分组返回
   * @param entities 数据库查询出的源数据
   * @return
   * @author Zoe Zheng
   * @date 2021/5/24 11:29 上午
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
    userMap: Map<string, UnitBaseInfoDto>,
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

}
