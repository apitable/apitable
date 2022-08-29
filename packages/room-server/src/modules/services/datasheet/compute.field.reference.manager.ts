import { Injectable } from '@nestjs/common';
import { CacheKeys, InjectLogger, REF_STORAGE_EXPIRE_TIME } from 'common';
import { difference, intersection } from 'lodash';
import { RedisService } from '@vikadata/nestjs-redis';
import * as util from 'util';
import { Logger } from 'winston';

/**
 * <p>
 * 计算字段引用映射管理器
 * </p>
 * @author Chambers
 * @date 2021/2/18
 */
@Injectable()
export class ComputeFieldReferenceManager {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly redisService: RedisService,
  ) { }

  /**
   * 覆盖性创建字段引用映射，原残余部分会解除双向引用关系
   * @returns 原映射数表:字段集 
   */
  createReference = async(mainDstId: string, field: string, foreignDstId: string, refFieldIds: string[]): Promise<string[]> => {
    this.logger.info(`CreateComputeFieldReference: mainDstId: ${mainDstId},field: ${field},Values:【${refFieldIds}】`);
    const client = this.redisService.getClient();
    const refKeySuf = util.format('%s:%s', mainDstId, field);
    // 组装引用值
    const refValues = await Promise.all(refFieldIds.map(async fieldId => {
      const refValue = util.format('%s:%s', foreignDstId, fieldId);
      // 维护反向引用关系
      const reRefKey = util.format(CacheKeys.DATASHEET_FIELD_RE_REF, refValue);
      const exist = await client.sismember(reRefKey, refKeySuf);
      // 可能被多处引用，仅新增不覆盖
      if (!exist) {
        this.logger.info(`CreateComputeFieldReference: Re ${refKeySuf} not exist in ${reRefKey} reRef`);
        await client.sadd(reRefKey, ...[refKeySuf]);
        await client.expire(reRefKey, REF_STORAGE_EXPIRE_TIME);
      }
      return refValue;
    }));
    // 维护正向引用关系（如 A 表 LookUp 字段 a 引用了关联表 B 的某一列 b，则 A-a 与 B-b 构成正向引用，前者依赖后者）
    const refKey = util.format(CacheKeys.DATASHEET_FIELD_REF, refKeySuf);
    const members = await client.smembers(refKey);
    if (members.length) {
      this.logger.info(`CreateComputeFieldReference: Re ${refKeySuf} exist`);
      // 取差集，若存在值则说明残留无效引用，需解除这部分的反向引用关系
      const diff = difference<string>(members, refValues);
      if (diff.length > 0) {
        await client.del(refKey);
        for (const reRefKeySuf of diff) {
          const reRefKey = util.format(CacheKeys.DATASHEET_FIELD_RE_REF, reRefKeySuf);
          const exist = await client.sismember(reRefKey, refKeySuf);
          if (!exist) { continue; }
          const count = await client.scard(reRefKey);
          if (count === 1) {
            await client.del(reRefKey);
          } else {
            await client.srem(reRefKey, ...[refKeySuf]);
          }
        }
      } else if (members.length === refValues.length) {
        // 完全一致则不作处理返回，否则全部覆盖
        return await this.getRefFieldIds(members);
      }
    }
    this.logger.info(`CreateComputeFieldReference: 新建或覆盖 Re: ${refKeySuf},Values:【${refValues}】`);
    await client.sadd(refKey, ...refValues);
    await client.expire(refKey, REF_STORAGE_EXPIRE_TIME);
    return await this.getRefFieldIds(members);
  };

  deleteReference = async(mainDstId: string, field: string, foreignDstId: string, refFieldIds: string[]) => {
    this.logger.info(`CreateComputeFieldReference:deleteReference mainDstId: ${mainDstId},field: ${field},Values:【${refFieldIds}】`);
    const client = this.redisService.getClient();
    // 正向引用键的后缀既是反向引用的值，反向引用的值既是反向引用键的后缀
    const refKeySuf = util.format('%s:%s', mainDstId, field);
    // 组装引用值
    const refValues = await Promise.all(refFieldIds.map(async fieldId => {
      const refValue = util.format('%s:%s', foreignDstId, fieldId);
      const reRefKey = util.format(CacheKeys.DATASHEET_FIELD_RE_REF, refValue);
      const exist = await client.sismember(reRefKey, refKeySuf);
      if (!exist) {
        return refValue;
      }
      // 删除反向引用关系
      const count = await client.scard(reRefKey);
      if (count === 1) {
        await client.del(reRefKey);
      } else {
        await client.srem(reRefKey, ...[refKeySuf]);
        await client.expire(reRefKey, REF_STORAGE_EXPIRE_TIME);
      }
      return refValue;
    }));
    const refKey = util.format(CacheKeys.DATASHEET_FIELD_REF, refKeySuf);
    const members = await client.smembers(refKey);
    if (!members.length) {
      return;
    }
    // 取交集，若存在值则解除这部分的正向引用关系
    const inter = intersection<string>(refValues, members);
    if (!inter.length) {
      return;
    }
    // 全部存在，整个删除，否则仅删除需解除部分
    if (inter.length === members.length) {
      await client.del(refKey);
    }
    await client.srem(refKey, ...[inter]);
    await client.expire(refKey, REF_STORAGE_EXPIRE_TIME);
  };

  async getRefDstToFieldMap(mainDstId: string, field: string): Promise<Map<string, string[]> | null> {
    const client = this.redisService.getClient();
    const refKey = util.format(CacheKeys.DATASHEET_FIELD_REF, util.format('%s:%s', mainDstId, field));
    const exist = await client.exists(refKey);
    if (!exist) {
      return null;
    }
    const dstToFiledMap = new Map<string, string[]>();
    const members = await client.smembers(refKey);
    members.forEach(val => {
      const [datasheetId, fieldId] = val.split(':');
      if (dstToFiledMap.has(datasheetId)) {
        dstToFiledMap.set(datasheetId, [...dstToFiledMap.get(datasheetId)!, ...[fieldId]]);
      } else {
        dstToFiledMap.set(datasheetId, [fieldId]);
      }
    });
    return dstToFiledMap;
  }

  async getReRefDstToFieldMap(mainDstId: string, field: string): Promise<Map<string, string[]> | null> {
    const client = this.redisService.getClient();
    const reRefKey = util.format(CacheKeys.DATASHEET_FIELD_RE_REF, util.format('%s:%s', mainDstId, field));
    const exist = await client.exists(reRefKey);
    if (!exist) {
      return null;
    }
    const dstToFiledMap = new Map<string, string[]>();
    const members = await client.smembers(reRefKey);
    members.forEach(val => {
      const [datasheetId, fieldId] = val.split(':');
      if (dstToFiledMap.has(datasheetId)) {
        dstToFiledMap.set(datasheetId, [...dstToFiledMap.get(datasheetId)!, ...[fieldId]]);
      } else {
        dstToFiledMap.set(datasheetId, [fieldId]);
      }
    });
    return dstToFiledMap;
  }

  private async getRefFieldIds(members: string[]): Promise<string[]> {
    if (!members.length) {
      return [];
    }
    return await Promise.all(members.map(member => {
      const [, fieldId] = member.split(':');
      return fieldId;
    }));
  }
}