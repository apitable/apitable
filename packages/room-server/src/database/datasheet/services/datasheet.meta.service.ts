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

import { IMeta } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { DatasheetMetaRepository } from 'database/datasheet/repositories/datasheet.meta.repository';
import { PermissionException, ServerException } from 'shared/exception';
import { IBaseException } from 'shared/exception/base.exception';

@Injectable()
export class DatasheetMetaService {
  public constructor(private repository: DatasheetMetaRepository) {}

  async getMetaDataMaybeNull(dstId: string): Promise<IMeta | undefined> {
    const metaEntity = await this.repository.selectMetaByDstId(dstId);
    return metaEntity?.metaData;
  }

  async getMetaDataByDstId(dstId: string, exception?: IBaseException, ignoreDeleted = false): Promise<IMeta> {
    const metaEntity = ignoreDeleted ? await this.repository.selectMetaByDstIdIgnoreDeleted(dstId) : await this.repository.selectMetaByDstId(dstId);
    if (metaEntity?.metaData) {
      return metaEntity.metaData;
    }
    throw new ServerException(exception ? exception : PermissionException.NODE_NOT_EXIST);
  }

  async getMetaMapByDstIds(dstIds: string[], ignoreDeleted = false): Promise<{ [dstId: string]: IMeta }> {
    const metas = ignoreDeleted ? await this.repository.selectMetaByDstIdsIgnoreDeleted(dstIds) : await this.repository.selectMetaByDstIds(dstIds);
    const metaMap: { [dstId: string]: IMeta } = {};
    for (const meta of metas) {
      if (meta.dstId && meta.metaData) {
        metaMap[meta.dstId] = meta.metaData;
      }
    }
    return metaMap;
  }

  /**
   * Query fieldIds through SQL, reduce memory footprint
   *
   * @param dstId datasheet ID
   * @param filterFieldIds IDs of fields that will be filtered out
   * @param excludedFieldType excluded field types
   * @return IDs of fields satisfying condition
   * @author Zoe Zheng
   * @date 2021/4/22 2:26 PM
   */
  async getFieldIdByDstId(dstId: string, filterFieldIds: string[], excludedFieldType: Set<number>): Promise<string[]> {
    const raw = await this.repository.selectFieldMapByDstId(dstId);
    const fieldIds: string[] = [];
    if (raw && raw.fieldMap) {
      for (const fieldId in raw.fieldMap) {
        // sort key fields
        if (!excludedFieldType || (!excludedFieldType.has(raw.fieldMap[fieldId]!.type) && !filterFieldIds.includes(fieldId))) {
          fieldIds.push(fieldId);
        }
      }
    }
    return fieldIds;
  }

  async getRowsNumByDstId(dstId: string): Promise<number> {
    const result = await this.repository.countRowsByDstId(dstId);
    return result!.count;
  }

  async getViewIdsByDstId(dstId: string): Promise<string[] | null> {
    return await this.repository.selectViewIdsByDstId(dstId);
  }

  async isViewIdExist(dstId: string, viewId: string): Promise<boolean | null> {
    const viewIds = await this.getViewIdsByDstId(dstId);
    return viewIds && viewIds.includes(viewId);
  }
}
