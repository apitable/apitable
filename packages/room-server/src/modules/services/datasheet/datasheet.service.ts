import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  FieldType, IBaseDatasheetPack, IDatasheetUnits, IEventResourceMap, IFieldMap, IForeignDatasheetMap, IMeta, IRecordMap, IReduxState
} from '@vikadata/core';
import { InjectLogger } from 'common';
import { DatasheetEntity } from 'entities/datasheet.entity';
import { DatasheetException } from 'exception/datasheet.exception';
import { ServerException } from 'exception/server.exception';
import { IAuthHeader, IFetchDataOptions, IFetchDataOriginOptions, ILinkedRecordMap } from 'interfaces';
import { isEmpty } from 'lodash';
import { DatasheetPack, ViewPack } from 'models';
import { DatasheetRepository } from 'modules/repository/datasheet.repository';
import { CommandService } from 'modules/services/command/impl/command.service';
import { Store } from 'redux';
import { Logger } from 'winston';
import { UnitInfo, UserInfo } from '../../../models';
import { NodeService } from '../node/node.service';
import { UserService } from '../user/user.service';
import { DatasheetFieldHandler } from './datasheet.field.handler';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';

/**
 * 数表 业务层
 */
@Injectable()
export class DatasheetService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly datasheetRepository: DatasheetRepository,
    private readonly datasheetFieldHandler: DatasheetFieldHandler,
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
    private readonly commandService: CommandService,
  ) { }

  /**
   * 获取数表的具体信息,不存在抛出异常
   * @param datasheetId 数表ID
   * @param throwError 是否抛异常
   * @return Promise<DatasheetEntity>
   * @author Zoe Zheng
   * @date 2020/8/5 12:04 下午
   */
  public getDatasheet(datasheetId: string, throwError?: boolean): Promise<DatasheetEntity | undefined> {
    const entity = this.datasheetRepository.selectById(datasheetId);
    if (!entity && throwError) {
      throw new ServerException(DatasheetException.NOT_EXIST);
    }
    return entity;
  }

  async fetchViewPack(dstId: string, viewId: string): Promise<ViewPack> {
    // 查询数表的 meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    // 查询数表是否有对应的视图
    const view = meta.views.find(view => view.id === viewId);
    if (!view) {
      throw new ServerException(DatasheetException.VIEW_NOT_EXIST);
    }
    // 节点版本号
    const revision = await this.nodeService.getRevisionByDstId(dstId);
    return { view, revision: revision! };
  }

  /**
   * 获取数表的数据包
   * 自动加载所有关联表的信息
   *
   * @param dstId 数表ID
   * @param auth 用户授权信息
   * @param options 参数选项
   */
  async fetchDataPack(dstId: string, auth: IAuthHeader, options?: IFetchDataOptions): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`主表数据开始加载[${dstId}]`);
    // 查询datasheet
    const origin = { internal: true, main: true };
    const getNodeInfoProfiler = this.logger.startTimer();
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(dstId, auth, origin);
    getNodeInfoProfiler.done({ message: `getNodeDetailInfo ${dstId} done` });
    // 查询snapshot
    const getMetaProfiler = this.logger.startTimer();
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    getMetaProfiler.done({ message: `getMetaProfiler ${dstId} done` });
    const getRecordsProfiler = this.logger.startTimer();
    const recordMap =
      options && options.recordIds
        ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, options.recordIds)
        : await this.datasheetRecordService.getRecordsByDstId(dstId);
    getRecordsProfiler.done({ message: `getRecordsProfiler ${dstId} done` });
    const endTime = +new Date();
    this.logger.info(`主表数据完成加载,总耗时[${dstId}]: ${endTime - beginTime}ms`);
    // 查询foreignDatasheetMap和unitMap
    const getProcessFieldProfiler = this.logger.startTimer();
    const combine = await this.processField(dstId, auth, meta, recordMap, origin, options?.linkedRecordMap);
    getProcessFieldProfiler.done({ message: `getProcessFieldProfiler ${dstId} done` });
    return {
      snapshot: { meta, recordMap, datasheetId: node.id },
      datasheet: node,
      foreignDatasheetMap: combine.foreignDatasheetMap,
      units: combine.units as ((UserInfo | UnitInfo)[]),
      fieldPermissionMap,
    };
  }

  /**
   * 获取分享数表的数据包
   * 自动加载所有关联表的信息
   *
   * @param shareId 分享ID
   * @param dstId 数表ID
   * @param auth 用户授权信息
   * @param options 过滤选项
   */
  async fetchShareDataPack(shareId: string, dstId: string, auth: IAuthHeader, options?: IFetchDataOptions): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`分享数据开始加载[${dstId}]`);
    // 查询datasheet;
    const origin = { internal: false, main: true, shareId };
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(dstId, auth, origin);
    // 查询snapshot
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    const recordMap =
      options && options.recordIds?.length
        ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, options.recordIds)
        : await this.datasheetRecordService.getRecordsByDstId(dstId);
    // 查询foreignDatasheetMap和unitMap
    const combine = await this.processField(dstId, auth, meta, recordMap, origin, options?.linkedRecordMap);
    const endTime = +new Date();
    this.logger.info(`分享数据完成加载,总耗时[${dstId}]: ${endTime - beginTime}ms`);
    return {
      snapshot: { meta, recordMap, datasheetId: node.id },
      datasheet: node,
      foreignDatasheetMap: combine.foreignDatasheetMap,
      units: combine.units as ((UserInfo | UnitInfo)[]),
      fieldPermissionMap,
    };
  }

  /**
   * 获取模版数表的数据包
   * 自动加载所有关联表的信息
   *
   * @param dstId 数表ID
   * @param auth 用户授权信息
   * @param options 过滤选项
   */
  async fetchTemplatePack(dstId: string, auth: IAuthHeader, options?: IFetchDataOptions): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`模版数据开始加载[${dstId}]`);
    // 查询datasheet;
    const origin = { internal: false, main: true };
    const { node } = await this.nodeService.getNodeDetailInfo(dstId, auth, origin);
    // 查询snapshot
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    const recordMap =
      options && options.recordIds
        ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, options.recordIds)
        : await this.datasheetRecordService.getRecordsByDstId(dstId);
    // 查询foreignDatasheetMap和unitMap
    const combine = await this.processField(dstId, {}, meta, recordMap, origin);
    const endTime = +new Date();
    this.logger.info(`模版数据完成加载,总耗时[${dstId}]: ${endTime - beginTime}ms`);
    return {
      snapshot: { meta, recordMap, datasheetId: node.id },
      datasheet: node,
      foreignDatasheetMap: combine.foreignDatasheetMap,
      units: combine.units as ((UserInfo | UnitInfo)[])
    };
  }

  /**
   * 提交表单时，获取神奇表单关联数表的数据包
   * 只会加载需要的稀疏数据
   *
   * @param dstId 数表ID
   * @param auth 用户授权信息
   * @param options 过滤选项
   */
  async fetchSubmitFormForeignDatasheetPack(dstId: string, auth: IAuthHeader, options?: IFetchDataOptions, shareId?: string): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`神奇表单关联数表数据开始加载[${dstId}]`);
    // 查询datasheet;
    const origin = shareId ? { internal: false, main: true, shareId } 
      : { internal: true, main: true, form: true };
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(dstId, auth, origin);
    // 查询snapshot
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    const recordMap = options?.recordIds?.length
      ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, options.recordIds) : {};
    // 查询foreignDatasheetMap和unitMap
    const combine = await this.processField(dstId, auth, meta, recordMap, origin, options?.linkedRecordMap);
    const endTime = +new Date();
    this.logger.info(`神奇表单关联数表数据完成加载,总耗时[${dstId}]: ${endTime - beginTime}ms`);
    return {
      snapshot: { meta, recordMap, datasheetId: node.id },
      datasheet: node,
      foreignDatasheetMap: combine.foreignDatasheetMap,
      units: combine.units as ((UserInfo | UnitInfo)[]),
      fieldPermissionMap,
    };
  }

  /**
   * 获取关联表的数据包
   * 关联表无权限时，仅加载首列相关的字段数据
   * 以此来保障不会影响到用户打开关联表时的权限
   *
   * @param dstId 数表ID
   * @param foreignDatasheetId 关联表ID
   * @param auth 用户授权信息
   * @param shareId 分享ID
   */
  async fetchForeignDatasheetPack(dstId: string, foreignDatasheetId: string, auth: IAuthHeader, shareId?: string): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`关联表[${foreignDatasheetId}]数据开始加载，dstId:[${dstId}]`);
    // 查询数表的 meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    // 查询数表是否有对应的关联表
    const isExist = Object.values(meta.fieldMap).some(field => {
      if (field.type === FieldType.Link) {
        return field.property.foreignDatasheetId === foreignDatasheetId;
      }
      return false;
    });
    if (!isExist) {
      throw new ServerException(DatasheetException.FOREIGN_DATASHEET_NOT_EXIST);
    }

    // 查询datasheet;
    const origin = { internal: shareId ? false : true, main: false, shareId };
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(foreignDatasheetId, auth, origin);
    // 查询snapshot
    const linkMeta = await this.datasheetMetaService.getMetaDataByDstId(foreignDatasheetId, DatasheetException.FOREIGN_DATASHEET_NOT_EXIST);
    const recordMap = await this.datasheetRecordService.getRecordsByDstId(foreignDatasheetId);
    const fieldIds: string[] = [];
    // 无关联表的查看权限，初始化仅解析首列
    // if (!node.permissions.readable) {
    //   fieldIds.push(DatasheetFieldHandler.getHeadFieldId(linkMeta));
    // }
    // 查询foreignDatasheetMap和unitMap
    const combine = await this.datasheetFieldHandler.parse(foreignDatasheetId, auth, linkMeta, recordMap, origin, undefined, fieldIds);
    const endTime = +new Date();
    this.logger.info(`神奇表单关联数表数据完成加载,总耗时[${dstId}]: ${endTime - beginTime}ms`);
    return {
      foreignDatasheetMap: combine.foreignDatasheetMap,
      snapshot: { meta: linkMeta, recordMap, datasheetId: node.id },
      datasheet: node, units: combine.units as ((UserInfo | UnitInfo)[]),
      fieldPermissionMap,
    };
  }

  /**
   * 处理特殊字段（Link、Lookup、Formula）
   * 没包含这些字段类型，会不处理
   * @param mainDstId 主数表ID
   * @param auth 用户会话
   * @param mainMeta 表的列数据结构
   * @param mainRecordMap 表行数据
   * @param origin 查询选项
   * @param linkedRecordMap 指定查找的关联表的记录
   */
  async processField(
    mainDstId: string,
    auth: IAuthHeader,
    mainMeta: IMeta,
    mainRecordMap: IRecordMap,
    origin: IFetchDataOriginOptions,
    linkedRecordMap?: ILinkedRecordMap,
    withoutPermission?: boolean,
  ): Promise<IForeignDatasheetMap & IDatasheetUnits> {
    // 解析数表
    return await this.datasheetFieldHandler.parse(mainDstId, auth, mainMeta,
      mainRecordMap, origin, linkedRecordMap, undefined, withoutPermission);
  }

  async fetchUsers(nodeId: string, uuids: string[]): Promise<any[]> {
    // 获取节点所在空间
    const spaceId = await this.nodeService.getSpaceIdByNodeId(nodeId);
    if (!spaceId) {
      throw new ServerException(DatasheetException.NOT_EXIST);
    }
    // 查询结果集
    return await this.userService.getUserInfo(spaceId, uuids);
  }

  /**
   * 获取数表的数据包, 不包括关联表信息
   * 自动加载所有关联表的信息
   *
   * @param dstId 数表ID
   * @param includeLink 是否包含所有link字段的表 默认true
   * @param includeCommentCount 是否查询评论条数 默认false
   * @param ignoreDeleted 是否忽略删除的节点 默认false
   * @return  Promise<IBaseDatasheetPack[]>
   */
  async getBasePacks(dstId: string, includeLink = true, includeCommentCount = false, ignoreDeleted = false): Promise<IBaseDatasheetPack[]> {
    // 查询snapshot todo 优化recordMap的查询，使用游标
    const basePacks: IBaseDatasheetPack[] = [];
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, undefined, ignoreDeleted);
    const dstIdSet = includeLink ? this.getAllLinkDstIdFromFieldMap(meta.fieldMap) : new Set<string>();
    const dstIdArray = Array.from(dstIdSet);
    const metaMap = dstIdArray.length ? await this.datasheetMetaService.getMetaMapByDstIds(dstIdArray, ignoreDeleted) : {};
    if (!dstIdSet.has(dstId)) dstIdArray.push(dstId);
    const datasheetMap = await this.getBaseInfoMap(dstIdArray, ignoreDeleted);
    if (!datasheetMap) {
      return basePacks;
    }
    for (const id of dstIdArray) {
      if (datasheetMap[id]) {
        basePacks.push({
          datasheet: datasheetMap[id] as any,
          snapshot: {
            meta: metaMap[id] ? metaMap[id] : meta,
            recordMap: await this.datasheetRecordService.getBaseRecordMap(id, includeCommentCount, ignoreDeleted),
            datasheetId: datasheetMap[id].id,
          },
        });
      }
    }
    return basePacks;
  }

  /**
   *
   * @param dstIds 数表ID
   * @param includeLink 是否包含所有link字段的表 默认true
   * @param includeCommentCount 是否包含评论数 默认false
   * @param ignoreDeleted 是否忽略删除的节点 默认false
   * @return Promise<Store<IReduxState>>
   * @author Zoe Zheng
   * @date 2021/4/1 2:41 下午
   */
  async fillBaseSnapshotStoreByDstIds(
    dstIds: string[],
    includeLink = true,
    includeCommentCount = false,
    ignoreDeleted = false,
  ): Promise<Store<IReduxState>> {
    let packs = [];
    for (const dstId of dstIds) {
      const basePack: IBaseDatasheetPack[] = await this.getBasePacks(dstId, includeLink, includeCommentCount, ignoreDeleted);
      packs = packs.concat(basePack);
    }
    const store = this.commandService.fillStore(packs);
    return this.commandService.setPageParam({ datasheetId: dstIds[0] }, store);
  }

  getAllLinkDstIdFromFieldMap(fieldMap: IFieldMap): Set<string> {
    const dstIds = new Set<string>();
    Object.keys(fieldMap).forEach(fieldId => {
      if (fieldMap[fieldId].type == FieldType.Link) {
        dstIds.add(fieldMap[fieldId].property.foreignDatasheetId);
      }
    });
    return dstIds;
  }

  /**
   * 获取数表基本信息map
   * @param dstIds 数表IDs
   * @param ignoreDeleted 是否忽略删除
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 4:16 下午
   */
  async getBaseInfoMap(dstIds: string[], ignoreDeleted = false): Promise<{ [dstId: string]: { id: string; name: string; revision: number } } | null> {
    const datasheets = ignoreDeleted
      ? await this.datasheetRepository.selectBaseInfoByDstIdsIgnoreDeleted(dstIds)
      : await this.datasheetRepository.selectBaseInfoByDstIds(dstIds);
    if (datasheets) {
      return datasheets.reduce<{ [dstId: string]: { id: string; name: string; revision: number } }>((pre, cur) => {
        pre[cur.id] = {
          id: cur.id,
          name: cur.name,
          revision: Number(cur.revision),
        };
        return pre;
      }, {});
    }
    return null;
  }

  /**
   * 获取稀疏的 dstPack 只包含 meta 和 recordMap
   * + 需要关联表信息
   * + 需要成员信息
   */
  async getTinyBasePacks(resourceMap: IEventResourceMap): Promise<IBaseDatasheetPack[]> {
    const dstIds = [...resourceMap.keys()];
    console.log('getTinyBasePacks', dstIds);
    const basePacks: DatasheetPack[] = [];
    if (isEmpty(dstIds)) {
      return basePacks;
    }
    const datasheetBaseInfoMap = await this.getBaseInfoMap(dstIds);
    console.log('getTinyBasePacks', datasheetBaseInfoMap);
    const metaMap = await this.datasheetMetaService.getMetaMapByDstIds(dstIds);

    for (const dstId of dstIds) {
      const datasheet = datasheetBaseInfoMap[dstId];
      const meta = metaMap[dstId];
      // 本批次事件影响的 recordIds
      const recordIds = resourceMap.get(dstId);
      // 本表 recordMap
      let recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);

      // 检查是否有自表关联，如果存扩充 recordIds
      const fieldMap = meta.fieldMap;
      const exRecordIds = [];
      Object.keys(fieldMap).forEach(fieldId => {
        if (fieldMap[fieldId].type == FieldType.Link) {
          const linkDstId = fieldMap[fieldId].property.foreignDatasheetId;
          if (dstId === linkDstId) {
            Object.keys(recordMap).forEach(recordId => {
              const cellRecordIds = recordMap[recordId].data[fieldId] as string[] || [];
              exRecordIds.push(...cellRecordIds);
            });
          }
        }
      });
      // 求 exRecordIds - recordIds 的差集
      const exRecordIdsSet = new Set(exRecordIds);
      const recordIdsSet = new Set(recordIds);
      const diffRecordIds = [...exRecordIdsSet].filter(recordId => !recordIdsSet.has(recordId));
      const diffRecordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, diffRecordIds);
      recordMap = { ...recordMap, ...diffRecordMap };

      // 查询foreignDatasheetMap和unitMap
      const linkedRecordMap = this.getLinkedRecordMap(
        dstId,
        meta,
        recordMap
      );
      const origin = { internal: true, main: true };
      const combine = await this.processField(
        dstId,
        {},
        meta,
        recordMap,
        origin,
        linkedRecordMap,
        true
      );
      basePacks.push({
        datasheet: datasheet as any,
        snapshot: {
          meta,
          recordMap,
          datasheetId: datasheet.id,
        },
        foreignDatasheetMap: combine.foreignDatasheetMap,
        units: combine.units as ((UserInfo | UnitInfo)[]),
      });
    }
    return basePacks;
  }

  /**
  * 根据 meta 和 recordMap 得到稀疏关联记录数据
  */
  getLinkedRecordMap(dstId: string, meta: IMeta, recordMap: IRecordMap): ILinkedRecordMap {
    const recordIds: string[] = Object.keys(recordMap);
    // 按外键关联表id 收集对应表需要获取的记录 id
    const linkedRecordMap: ILinkedRecordMap = {};
    const foreignDatasheetIdMap = Object.values(meta.fieldMap)
      .filter(field => field.type === FieldType.Link)
      .map(field => {
        const foreignDatasheetId = field.property?.foreignDatasheetId;
        // 过滤掉自表关联
        if (!foreignDatasheetId || foreignDatasheetId === dstId) return null;
        return {
          fieldId: field.id,
          foreignDatasheetId,
        };
      })
      .filter(Boolean);

    foreignDatasheetIdMap.forEach(item => {
      const { foreignDatasheetId, fieldId } = item!;
      const linkedRecordIds = recordIds.reduce((pre, cur) => {
        const cellLinkedIds = recordMap[cur].data[fieldId] as string[] || [];
        pre.push(...cellLinkedIds);
        return pre;
      }, []);
      // 会出现本表关联多张相同表的情况。
      if (linkedRecordMap.hasOwnProperty(foreignDatasheetId)) {
        linkedRecordMap[foreignDatasheetId].push(...linkedRecordIds);
      } else {
        // 收集该关联字段的所有记录 ids
        linkedRecordMap[foreignDatasheetId] = linkedRecordIds;
      }
    });
    // 对数组数据做一下去重
    for (const key in linkedRecordMap) {
      linkedRecordMap[key] = [...new Set(linkedRecordMap[key])];
    }
    return linkedRecordMap;
  }
}
