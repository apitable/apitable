import { Injectable } from '@nestjs/common';
import { CacheKeys, InjectLogger, REF_STORAGE_EXPIRE_TIME } from '../../../shared/common';
import { difference, intersection } from 'lodash';
import { RedisService } from '@vikadata/nestjs-redis';
import * as util from 'util';
import { Logger } from 'winston';

/**
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
   * Create field reference by covering, original remaining part will break mutual reference
   * @returns original mapped datasheet : field set
   */
  createReference = async(mainDstId: string, field: string, foreignDstId: string, refFieldIds: string[]): Promise<string[]> => {
    this.logger.info(`CreateComputeFieldReference: mainDstId: ${mainDstId},field: ${field},Values: [${refFieldIds}]`);
    const client = this.redisService.getClient();
    const refKeySuf = util.format('%s:%s', mainDstId, field);
    // Build reference value
    const refValues = await Promise.all(refFieldIds.map(async fieldId => {
      const refValue = util.format('%s:%s', foreignDstId, fieldId);
      // Maintain backward reference
      const reRefKey = util.format(CacheKeys.DATASHEET_FIELD_RE_REF, refValue);
      const exist = await client.sismember(reRefKey, refKeySuf);
      // May be referenced in many places, only creation, no covering
      if (!exist) {
        this.logger.info(`CreateComputeFieldReference: Re ${refKeySuf} not exist in ${reRefKey} reRef`);
        await client.sadd(reRefKey, ...[refKeySuf]);
        await client.expire(reRefKey, REF_STORAGE_EXPIRE_TIME);
      }
      return refValue;
    }));
    // Maintain forward reference relation. Example: LookUp field a in datasheet A references a field b in linked datasheet B, then
    // A-a and B-b forms forward reference, the former depends on the latter.
    const refKey = util.format(CacheKeys.DATASHEET_FIELD_REF, refKeySuf);
    const members = await client.smembers(refKey);
    if (members.length) {
      this.logger.info(`CreateComputeFieldReference: Re ${refKeySuf} exist`);
      // Compute difference, if not empty then invalid references exist, needs to break these backward reference
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
        // Return without further process if identical, or all covering
        return await this.getRefFieldIds(members);
      }
    }
    this.logger.info(`CreateComputeFieldReference: Create or cover Re: ${refKeySuf},Values: [${refValues}]`);
    await client.sadd(refKey, ...refValues);
    await client.expire(refKey, REF_STORAGE_EXPIRE_TIME);
    return await this.getRefFieldIds(members);
  };

  deleteReference = async(mainDstId: string, field: string, foreignDstId: string, refFieldIds: string[]) => {
    this.logger.info(`CreateComputeFieldReference:deleteReference mainDstId: ${mainDstId},field: ${field},Values: [${refFieldIds}]`);
    const client = this.redisService.getClient();
    // Suffix of forward reference key is the value of backward reference, namely suffix of backward reference key
    const refKeySuf = util.format('%s:%s', mainDstId, field);
    // Build reference value
    const refValues = await Promise.all(refFieldIds.map(async fieldId => {
      const refValue = util.format('%s:%s', foreignDstId, fieldId);
      const reRefKey = util.format(CacheKeys.DATASHEET_FIELD_RE_REF, refValue);
      const exist = await client.sismember(reRefKey, refKeySuf);
      if (!exist) {
        return refValue;
      }
      // Delete backward reference
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
    // Get intersection, if not empty then break these forward references
    const inter = intersection<string>(refValues, members);
    if (!inter.length) {
      return;
    }
    // All exists, delete entire references, otherwise only delete those requires breaking
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