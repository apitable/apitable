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

import { IDPrefix, IField, IFieldMap, IMeta } from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { DatasheetMetaRepository } from 'database/datasheet/repositories/datasheet.meta.repository';
import { PermissionException, ServerException } from 'shared/exception';
import { IBaseException } from 'shared/exception/base.exception';
import { DatasheetMetaEntity } from '../entities/datasheet.meta.entity';

@Injectable()
export class DatasheetMetaService {
  public constructor(private repository: DatasheetMetaRepository) {}

  async getMetaDataMaybeNull(dstId: string): Promise<IMeta | undefined> {
    const metaEntity = await this.repository.selectMetaByDstId(dstId);
    await this.checkAndInitMeta(metaEntity, dstId);
    return metaEntity?.metaData;
  }

  @Span()
  async getMetaDataByDstId(dstId: string, exception?: IBaseException, ignoreDeleted = false): Promise<IMeta> {
    const metaEntity = ignoreDeleted ? await this.repository.selectMetaByDstIdIgnoreDeleted(dstId) : await this.repository.selectMetaByDstId(dstId);
    if (metaEntity?.metaData) {
      await this.checkAndInitMeta(metaEntity, dstId);
      return metaEntity.metaData;
    }
    throw new ServerException(exception ? exception : PermissionException.NODE_NOT_EXIST);
  }

  async checkAndInitMeta(metaEntity: DatasheetMetaEntity | undefined, dstId: string) {
    if (metaEntity?.metaData) {
      if (metaEntity.metaData.archivedRecordIds === undefined) {
        metaEntity.metaData.archivedRecordIds = [];
        await this.repository.update({ dstId: dstId }, metaEntity);
      }
    }
  }

  /**
   * @param dstId datasheet id
   * @param viewId If omitted, load the first view.
   * @returns only contains fieldMap and views.
   */
  @Span()
  async getMetadataWithViewByDstId(dstId: string, viewId?: string): Promise<IMeta> {
    let meta: { metadata: IMeta } | undefined;
    if (viewId) {
      meta = await this.repository.selectMetaWithViewByDstIdAndViewId(dstId, viewId);
    } else {
      meta = await this.repository.selectMetaWithFirstViewByDstId(dstId);
    }
    if (!meta) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }
    return meta.metadata;
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

  async batchSave(metas: any[]) {
    return await this.repository.createQueryBuilder().insert().values(metas).execute();
  }

  @Span()
  async getFieldMapByDstId(dstId: string): Promise<IFieldMap> {
    const raw = await this.repository.selectFieldMapByDstId(dstId);
    if (raw) {
      return raw.fieldMap;
    }
    throw new ServerException(PermissionException.NODE_NOT_EXIST);
  }

  @Span()
  async getFieldByFldIdAndDstId(dstId: string, fieldId: string): Promise<IField | null> {
    const raw = await this.repository.selectFieldByFldIdAndDstId(dstId, fieldId);
    if (raw) {
      return raw.field;
    }
    return null;
  }

  @Span()
  async checkFieldExist(dstId: string, fieldId: string): Promise<boolean> {
    const raw = await this.repository.selectFieldTypeByFldIdAndDstId(dstId, fieldId);
    return Boolean(raw && raw.type);
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
    // only check for dst
    if (dstId.startsWith(IDPrefix.Table)) {
      const viewIds = await this.getViewIdsByDstId(dstId);
      return viewIds && viewIds.includes(viewId);
    }
    return true;
  }

  async isFieldNameExist(dstId: string, fieldName: string): Promise<boolean> {
    const count = await this.repository.selectCountByDstIdAndFieldName(dstId, fieldName);
    return 0 != count;
  }
}
