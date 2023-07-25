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

import { FieldType, IRemoteChangeset, IResourceRevision, ResourceIdPrefix } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ComputeFieldReferenceManager } from 'database/datasheet/services/compute.field.reference.manager';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { WidgetService } from 'database/widget/services/widget.service';
import { difference, intersection, isEmpty } from 'lodash';
import * as util from 'util';
import { Logger } from 'winston';
import { CacheKeys, InjectLogger, REF_STORAGE_EXPIRE_TIME } from '../../../shared/common';
import { IClientRoomChangeResult } from '../../../shared/services/socket/socket.interface';
import { ResourceMetaRepository } from '../repositories/resource.meta.repository';

/**
 * Room - Resource two-way association maintenance
 */
@Injectable()
export class RoomResourceRelService {

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly redisService: RedisService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly computeFieldReferenceManager: ComputeFieldReferenceManager,
    @Inject(forwardRef(() => DatasheetService))
    private readonly datasheetService: DatasheetService,
    private readonly resourceMetaRepository: ResourceMetaRepository,
    private readonly widgetService: WidgetService,
  ) {
  }

  async hasResource(roomId: string): Promise<boolean> {
    // Create or update Room - Resource two-way association
    const client = this.redisService.getClient();
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const resourceIds = await client.smembers(roomKey);
    return resourceIds.length > 0;
  }

  @Span()
  async getEffectDatasheetIds(resourceIds: string[]): Promise<string[]> {
    const allEffectResourceIds = new Set<string>();
    for (const resourceId of resourceIds) {
      const roomIds = await this.getDatasheetRoomIds(resourceId, true);
      // Analyze resource, reversely compute the room which the resource belongs to
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
    // Create or update Room - Resource two-way association
    const client = this.redisService.getClient();
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const resourceIds = await client.smembers(roomKey);
    if (resourceIds.length === 0 && roomId.startsWith(ResourceIdPrefix.Datasheet)) {
      return [roomId];
    }
    return resourceIds.filter(id => id.startsWith(ResourceIdPrefix.Datasheet)).map(id => id);
  }

  async getResourceRevisions(roomId: string): Promise<IResourceRevision[]> {
    // Create or update Room - Resource two-way association
    const client = this.redisService.getClient();
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const resourceIds = await client.smembers(roomKey);

    // Query the latest revision number of each resource
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
      const datasheetRevisions = await this.datasheetService.selectRevisionByDstIds(dstIds);
      resourceRevisions.push(...datasheetRevisions);
    }
    if (rscIds.length > 0) {
      const rscRevisions = await this.resourceMetaRepository.getRevisionByRscIds(rscIds);
      resourceRevisions.push(...rscRevisions);
    }
    if (wdtIds.length > 0) {
      const wdtRevisions = await this.widgetService.getRevisionByWdtIds(wdtIds);
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
    // Maintain room - resource map
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const exist = await client.exists(roomKey);
    if (exist) {
      this.logger.info(`ROOM ${roomId} exist Room - Resource map`);
      // Room - Resource two-way association exists
      const members = await client.smembers(roomKey);
      // Get difference, compensate missing parts, partial user has no permission, resourceIds may not be loaded all.
      const diff = difference<string>(resourceIds, members);
      if (diff.length > 0) {
        await client.sadd(roomKey, ...diff);
      }
    } else {
      this.logger.info(`New ROOM: ${roomId}'s Room - Resource map`);
      await client.sadd(roomKey, ...resourceIds);
    }
    await client.expire(roomKey, REF_STORAGE_EXPIRE_TIME);

    // Maintain resource - room two-way association
    for (let i = 0; i < resourceIds.length; i++) {
      const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, resourceIds[i]);
      const result = await client.sismember(resourceKey, roomId);
      // Check if room exists in Resource - Room two-way association
      if (!result) {
        this.logger.info(`Room ${roomId} not exist in ${resourceIds[i]} Resource - Room map`);
        await client.sadd(resourceKey, ...[roomId]);
      }
      await client.expire(resourceKey, REF_STORAGE_EXPIRE_TIME);
    }
  }

  async removeRel(roomId: string, removeResourceIds: string[]) {
    // Filter main resource
    const resourceIds = difference<string>(removeResourceIds, [roomId]);
    if (!resourceIds.length) {
      return;
    }
    const client = this.redisService.getClient();
    // Maintain room - resource two-way association
    const roomKey = util.format(CacheKeys.ROOM_RELATE, roomId);
    const isExist = await client.exists(roomKey);
    if (isExist) {
      this.logger.info(`The room ${roomId} exist - Resource map`);
      // Room - Resource association exists
      const members = await client.smembers(roomKey);
      // Get intersection, delete Resource that left the Room
      const inter = intersection<string>(resourceIds, members);
      if (inter.length > 0) {
        await client.srem(roomKey, ...inter);
      }
    }

    // Maintain resource - room association
    for (let i = 0; i < resourceIds.length; i++) {
      const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, resourceIds[i]);
      const result = await client.sismember(resourceKey, roomId);
      // Check whether room exists in resource - room association
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

  @Span()
  async getRoomChangeResult(roomId: string, changesets: IRemoteChangeset[]): Promise<IClientRoomChangeResult[]> {
    const beginTime = +new Date();
    this.logger.info(`Start loading RoomChangeResult roomId:${roomId}`);
    const client = this.redisService.getClient();
    const results: IClientRoomChangeResult[] = [];
    for (const cs of changesets) {
      const resourceKey = util.format(CacheKeys.RESOURCE_RELATE, cs.resourceId);
      let roomIds = await client.smembers(resourceKey);
      // If Resource does not exist in any Room, fill in Resource - Room two-way association
      if (roomIds.length === 0) {
        roomIds = [roomId];
        await client.sadd(resourceKey, ...roomIds);
      } else if (!roomIds.includes(roomId)) {
        // Make sure RemoteChange is returned to the current Room
        roomIds.push(roomId);
      }
      results.push({ changeset: cs, roomIds });
    }
    const endTime = +new Date();
    this.logger.info(`Finished loading RoomChangeResult roomId:${roomId}, duration: ${endTime - beginTime}ms`);
    return results;
  }

  /**
   * Compute datasheet room reversely
   */
  async reverseComputeDatasheetRoom(dstId: string) {
    // Obtain meta of the datasheet
    const fieldMap = await this.datasheetMetaService.getFieldMapByDstId(dstId);
    // Filter loading linked datasheet
    const foreignDatasheetIdToFiledIdsMap = new Map<string, string[]>();
    Object.values(fieldMap).filter(field => field.type === FieldType.Link)
      .forEach(field => {
        const { foreignDatasheetId, brotherFieldId } = field.property;
        // Filter out self linking
        if (!foreignDatasheetId || foreignDatasheetId === dstId) {
          return;
        }
        if (foreignDatasheetIdToFiledIdsMap.has(foreignDatasheetId)) {
          foreignDatasheetIdToFiledIdsMap.get(foreignDatasheetId)!.push(brotherFieldId);
        } else {
          foreignDatasheetIdToFiledIdsMap.set(foreignDatasheetId, [brotherFieldId]);
        }
      });
    // Save resource references of room of the datasheet asynchronously
    const dstIds = [dstId, ...Array.from(foreignDatasheetIdToFiledIdsMap.keys())];
    await this.createOrUpdateRel(dstId, dstIds);
    // No linked datasheet, only the datasheet is in the room, finish
    if (foreignDatasheetIdToFiledIdsMap.size === 0) {
      return dstIds;
    }

    // Linked datasheet exists, needs check if the linked datasheet of the linked datasheet references the datasheet
    for (const [foreignDatasheetId, linkFieldIds] of foreignDatasheetIdToFiledIdsMap) {
      // Query meta of linked datasheet
      const foreignDatasheetFieldMap = await this.datasheetMetaService.getFieldMapByDstId(foreignDatasheetId);

      // Check if there are other linked datasheets
      const field = Object.values(foreignDatasheetFieldMap).find(field => field.type === FieldType.Link
        && !dstIds.includes(field.property.foreignDatasheetId));
      if (!field) {
        continue;
      }

      // Check if LookUp reference exists
      const lookUpFieldIds = Object.values(foreignDatasheetFieldMap)
        .filter(field => field.type === FieldType.LookUp && linkFieldIds.includes(field.property.relatedLinkFieldId))
        .map(field => {
          return field.id;
        });
      // Influenced fields of linked datasheet. Link + LookUp + Formula
      const effectFieldIds = lookUpFieldIds.length > 0 ? [...linkFieldIds, ...lookUpFieldIds] : linkFieldIds;
      // Check if Formula reference exists
      const formulaFieldIds = Object.values(foreignDatasheetFieldMap)
        .filter(field => field.type === FieldType.Formula)
        .map(field => {
          // Extract formula expression, if it references fields
          const formulaRefFieldIds = field.property?.expression.match(/fld\w{10}/g);
          // return type of String.match may be null or empty array
          if (!formulaRefFieldIds || isEmpty(formulaRefFieldIds)) {
            return null;
          }
          // Get intersection, if not empty, it means this formula field references influenced Link or LookUp field,
          // thus the field is influenced.
          const inter = intersection<string>(formulaRefFieldIds, effectFieldIds);
          return inter.length > 0 ? field.id : null;
        }).filter(Boolean) as string[];
      formulaFieldIds.length && effectFieldIds.push(...formulaFieldIds);

      // Read field inverse reference relation, trace influenced linked datasheet upward
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
