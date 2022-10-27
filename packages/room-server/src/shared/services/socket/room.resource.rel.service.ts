import { Injectable } from '@nestjs/common';
import { RedisService } from '@vikadata/nestjs-redis';
import { FieldType, IRemoteChangeset, IResourceRevision, ResourceIdPrefix } from '@apitable/core';
import * as util from 'util';
import { CacheKeys, InjectLogger, REF_STORAGE_EXPIRE_TIME } from '../../common';
import { Logger } from 'winston';
import { difference, intersection, isEmpty } from 'lodash';
import { IClientRoomChangeResult } from './socket.interface';
import { DatasheetRepository } from '../../../database/repositories/datasheet.repository';
import { ResourceMetaRepository } from '../../../database/repositories/resource.meta.repository';
import { WidgetRepository } from '../../../database/repositories/widget.repository';
import { DatasheetMetaService } from 'database/services/datasheet/datasheet.meta.service';
import { ComputeFieldReferenceManager } from 'database/services/datasheet/compute.field.reference.manager';

/**
 * Room - Resource 双向映射关系维护
 */
@Injectable()
export class RoomResourceRelService {

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly redisService: RedisService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly computeFieldReferenceManager: ComputeFieldReferenceManager,
    private readonly datasheetRepository: DatasheetRepository,
    private readonly resourceMetaRepository: ResourceMetaRepository,
    private readonly widgetRepository: WidgetRepository,
  ) { }

  async hasResource(roomId: string): Promise<boolean> {
    // 创建或更新 Room - Resource 双向关系
    const client = this.redisService.getClient();
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const resourceIds = await client.smembers(roomKey);
    return resourceIds.length > 0;
  }

  async getEffectDatasheetIds(resourceIds: string[]): Promise<string[]> {
    const allEffectResourceIds = new Set<string>();
    for (const resourceId of resourceIds) {
      const roomIds = await this.getDatasheetRoomIds(resourceId, true);
      // 解析资源，反向计算该资源所在的数表房间
      if (roomIds.length === 0) {
        const dstIds = await this.reverseComputeDatasheetRoom(resourceId);
        dstIds.forEach(id => allEffectResourceIds.add(id));
        continue;
      }
      roomIds.filter(id => id.startsWith(ResourceIdPrefix.Datasheet))
        .forEach(id => allEffectResourceIds.add(id));
    }
    return Array.from(allEffectResourceIds);
  }

  async getDatasheetRoomIds(resourceId: string, withoutSelf = false): Promise<string[]> {
    const client = this.redisService.getClient();
    const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, resourceId);
    const roomIds = await client.smembers(resourceKey);
    if (!withoutSelf && roomIds.length === 0 && resourceId.startsWith(ResourceIdPrefix.Datasheet)) {
      return [resourceId];
    }
    return roomIds.filter(id => id.startsWith(ResourceIdPrefix.Datasheet)).map(id => id);
  }

  async getDatasheetResourceIds(roomId: string): Promise<string[]> {
    // 创建或更新 Room - Resource 双向关系
    const client = this.redisService.getClient();
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const resourceIds = await client.smembers(roomKey);
    if (resourceIds.length === 0 && roomId.startsWith(ResourceIdPrefix.Datasheet)) {
      return [roomId];
    }
    return resourceIds.filter(id => id.startsWith(ResourceIdPrefix.Datasheet)).map(id => id);
  }

  async getResourceRevisions(roomId: string): Promise<IResourceRevision[]> {
    // 创建或更新 Room - Resource 双向关系
    const client = this.redisService.getClient();
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const resourceIds = await client.smembers(roomKey);

    // 查询各个资源最新的版本号
    const resourceRevisions: IResourceRevision[] = [];
    const dstIds: string[] = [];
    const rscIds: string[] = [];
    const wdtIds: string[] = [];
    resourceIds.forEach(id => {
      switch (id.substring(0, 3)) {
        case ResourceIdPrefix.Datasheet:
          dstIds.push(id);
          break;
        case ResourceIdPrefix.Form:
        case ResourceIdPrefix.Dashboard:
          rscIds.push(id);
          break;
        case ResourceIdPrefix.Widget:
          wdtIds.push(id);
          break;
        default:
          break;
      }
    });
    if (dstIds.length > 0) {
      const datasheetRevisions = await this.datasheetRepository.selectRevisionByDstIds(dstIds);
      resourceRevisions.push(...datasheetRevisions);
    }
    if (rscIds.length > 0) {
      const rscRevisions = await this.resourceMetaRepository.getRevisionByRscIds(rscIds);
      resourceRevisions.push(...rscRevisions);
    }
    if (wdtIds.length > 0) {
      const wdtRevisions = await this.widgetRepository.getRevisionByWdtIds(wdtIds);
      resourceRevisions.push(...wdtRevisions);
    }
    const revisions = resourceRevisions.map(rscRevision => {
      return {
        resourceId: rscRevision.resourceId,
        revision: Number(rscRevision.revision),
      };
    });
    return revisions;
  }

  async createOrUpdateRel(roomId: string, resourceIds: string[]) {
    const client = this.redisService.getClient();
    // 维护 room - resource map
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const exist = await client.exists(roomKey);
    if (exist) {
      this.logger.info(`ROOM ${roomId} exist Room - Resource map`);
      // 已存在 Room - Resource 映射关系
      const members = await client.smembers(roomKey);
      // 取差集，补充缺少部分，部分人权限不足，resourceIds 可能不会加载全部
      const diff = difference<string>(resourceIds, members);
      if (diff.length > 0) {
        await client.sadd(roomKey, ...diff);
      }
    } else {
      this.logger.info(`新建 ROOM: ${roomId} 的 Room - Resource map`);
      await client.sadd(roomKey, ...resourceIds);
    }
    await client.expire(roomKey, REF_STORAGE_EXPIRE_TIME);

    // 维护 resource - room map
    for (let i = 0; i < resourceIds.length; i++) {
      const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, resourceIds[i]);
      const result = await client.sismember(resourceKey, roomId);
      // 判断 room 是否存在 Resource - Room 映射关系中
      if (!result) {
        this.logger.info(`Room ${roomId} not exist in ${resourceIds[i]} Resource - Room map`);
        await client.sadd(resourceKey, ...[roomId]);
      }
      await client.expire(resourceKey, REF_STORAGE_EXPIRE_TIME);
    }
  }

  async removeRel(roomId: string, removeResourceIds: string[]) {
    // 过滤主资源
    const resourceIds = difference<string>(removeResourceIds, [roomId]);
    if (!resourceIds.length) {
      return;
    }
    const client = this.redisService.getClient();
    // 维护 room - resource map
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const exist = await client.exists(roomKey);
    if (exist) {
      this.logger.info(`ROOM ${roomId} exist Room - Resource map`);
      // 已存在 Room - Resource 映射关系
      const members = await client.smembers(roomKey);
      // 取并集，删除退出 Room 的 Resource
      const inter = intersection<string>(resourceIds, members);
      if (inter.length > 0) {
        await client.srem(roomKey, ...inter);
      }
    }

    // 维护 resource - room map
    for (let i = 0; i < resourceIds.length; i++) {
      const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, resourceIds[i]);
      const result = await client.sismember(resourceKey, roomId);
      // 判断 room 是否存在 Resource - Room 映射关系中
      if (result) {
        this.logger.info(`Room ${roomId} exist in ${resourceIds[i]} Resource - Room map`);
        const count = await client.scard(resourceKey);
        if (count === 1) {
          await client.del(resourceKey);
        } else {
          await client.srem(resourceKey, ...[roomId]);
        }
      }
    }
  }

  async getRoomChangeResult(roomId: string, changesets: IRemoteChangeset[]): Promise<IClientRoomChangeResult[]> {
    const beginTime = +new Date();
    this.logger.info('RoomChangeResult 开始加载');
    const client = this.redisService.getClient();
    const results: IClientRoomChangeResult[] = [];
    for (const cs of changesets) {
      const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, cs.resourceId);
      let roomIds = await client.smembers(resourceKey);
      // 若 Resource 不存在任何 Room 中，补充 Resource - Room 映射关系
      if (roomIds.length === 0) {
        roomIds = [roomId];
        await client.sadd(resourceKey, ...roomIds);
      } else if (!roomIds.includes(roomId)) {
        // 保证 RemoteChange 返回给当前 Room
        roomIds.push(roomId);
      }
      results.push({ changeset: cs, roomIds });
    }
    const endTime = +new Date();
    this.logger.info(`RoomChangeResult 完成加载,总耗时: ${endTime - beginTime}ms`);
    return results;
  }

  /**
   * 反向计算数表房间
   */
  async reverseComputeDatasheetRoom(dstId: string) {
    // 查询数表的 meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    // 过滤加载关联表
    const foreignDatasheetIdToFiledIdsMap = new Map<string, string[]>();
    Object.values(meta.fieldMap).filter(field => field.type === FieldType.Link)
      .forEach(field => {
        const { foreignDatasheetId, brotherFieldId } = field.property;
        // 过滤自关联
        if (!foreignDatasheetId || foreignDatasheetId === dstId) {
          return;
        }
        if (foreignDatasheetIdToFiledIdsMap.has(foreignDatasheetId)) {
          foreignDatasheetIdToFiledIdsMap.get(foreignDatasheetId).push(brotherFieldId);
        } else {
          foreignDatasheetIdToFiledIdsMap.set(foreignDatasheetId, [brotherFieldId]);
        }
      });
    // 异步保存该数表自己房间的资源引用
    const dstIds = [dstId, ...Array.from(foreignDatasheetIdToFiledIdsMap.keys())];
    this.createOrUpdateRel(dstId, dstIds);
    // 没有关联表，所在的数表房间则只有自己，结束
    if (foreignDatasheetIdToFiledIdsMap.size === 0) {
      return dstIds;
    }

    // 存在关联表，要确认关联表的关联表，有没有间接引用了该数表
    for (const [foreignDatasheetId, linkFieldIds] of foreignDatasheetIdToFiledIdsMap) {
      // 查询关联表的 meta
      const foreignDatasheetMeta = await this.datasheetMetaService.getMetaDataByDstId(foreignDatasheetId);

      // 判断是否还有其他关联表出现
      const field = Object.values(foreignDatasheetMeta.fieldMap).find(field => field.type === FieldType.Link
        && !dstIds.includes(field.property.foreignDatasheetId));
      if (!field) {
        continue;
      }

      // 判断是否有 LookUp 引用
      const lookUpFieldIds = Object.values(foreignDatasheetMeta.fieldMap)
        .filter(field => field.type === FieldType.LookUp && linkFieldIds.includes(field.property.relatedLinkFieldId))
        .map(field => {
          return field.id;
        });
      // 关联表受到影响的字段. Link + LookUp + Formula
      const effectFieldIds = lookUpFieldIds.length > 0 ? [...linkFieldIds, ...lookUpFieldIds] : linkFieldIds;
      // 判断是否有 Formula 引用
      const formulaFieldIds = Object.values(foreignDatasheetMeta.fieldMap)
        .filter(field => field.type === FieldType.Formula)
        .map(field => {
          // 提取公式表达式，是否引用了字段
          const formulaRefFieldIds = field.property?.expression.match(/fld\w{10}/g);
          // match函数返回可能是null或者空数组
          if (!formulaRefFieldIds || isEmpty(formulaRefFieldIds)) {
            return null;
          }
          // 取交集，若存在值，则说明该公式字段引用了受影响的 Link 或 LookUp 字段，进而进入了受影响的字段范围
          const inter = intersection<string>(formulaRefFieldIds, effectFieldIds);
          return inter.length > 0 ? field.id : null;
        }).filter(Boolean);
      formulaFieldIds.length && effectFieldIds.push(...formulaFieldIds);

      // 读取字段反向引用关系，向上追溯受影响的关联表
      await this.circleFindRelDatasheet(foreignDatasheetId, effectFieldIds, dstIds);
    }

    return dstIds;
  }

  private async circleFindRelDatasheet(dstId: string, effectFieldIds: string[], allEffectDstIds: string[]) {
    for (const fieldId of effectFieldIds) {
      const dstIdToFiledIdsMap = await this.computeFieldReferenceManager.getReRefDstToFieldMap(dstId, fieldId);
      if (!dstIdToFiledIdsMap) {
        continue;
      }
      for (const [datasheetId, fieldIds] of dstIdToFiledIdsMap) {
        if (allEffectDstIds.includes(datasheetId)) {
          continue;
        }
        allEffectDstIds.push(datasheetId);
        await this.circleFindRelDatasheet(datasheetId, fieldIds, allEffectDstIds);
      }
    }
  }
}
