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

import { FieldType, IField, IFieldMap, IMeta } from '@apitable/core';
import { EntityRepository, In, Repository } from 'typeorm';
import { DatasheetMetaEntity } from '../entities/datasheet.meta.entity';

@EntityRepository(DatasheetMetaEntity)
export class DatasheetMetaRepository extends Repository<DatasheetMetaEntity> {
  public selectMetaByDstId(dstId: string): Promise<DatasheetMetaEntity | undefined> {
    return this.findOne({ select: ['metaData'], where: [{ dstId, isDeleted: false }] });
  }

  /**
   * Obtain the metadata of a datasheet, ignoring `isDeleted` state.
   *
   * @param dstId datasheet ID
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 3:40 PM
   */
  selectMetaByDstIdIgnoreDeleted(dstId: string): Promise<DatasheetMetaEntity | undefined> {
    return this.findOne({ select: ['metaData'], where: [{ dstId }] });
  }

  /**
   * @returns only contains fieldMap and views.
   */
  async selectMetaWithViewByDstIdAndViewId(dstId: string, viewId: string): Promise<{ metadata: IMeta } | undefined> {
    const entity = await this.findOne({
      select: ['metaData'],
      where: {
        dstId,
        isDeleted: false
      }
    });
    if (entity) {
      const metadata = entity.metaData;
      if (metadata) {
        const view = metadata.views.find((v) => v.id === viewId);
        if (view) {
          return {
            metadata: {
              fieldMap: metadata.fieldMap,
              views: [view]
            }
          };
        }
      }
    }
    return undefined;
  }

  /**
   * @returns only contains fieldMap and views.
   */
  selectMetaWithFirstViewByDstId(dstId: string): Promise<{ metadata: IMeta } | undefined> {
    return this.createQueryBuilder('vdm')
      .select('JSON_OBJECT(\'fieldMap\', vdm.meta_data->\'$.fieldMap\', \'views\', JSON_ARRAY(vdm.meta_data->\'$.views[0]\'))', 'metadata')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ metadata: IMeta }>();
  }

  /**
   * Obtain the metadata list by datasheet ID list
   *
   * @param dstIds datasheet ID array
   * @return
   * @author Zoe Zheng
   * @date 2020/8/26 1:57 PM
   */
  selectMetaByDstIds(dstIds: string[]): Promise<DatasheetMetaEntity[]> {
    return this.find({ select: ['revision', 'metaData', 'dstId'], where: [{ dstId: In(dstIds), isDeleted: false }] });
  }

  /**
   * Obtain the metadata list by datasheet ID list, ignoring `isDeleted` state
   *
   * @param dstIds datasheet ID array
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 3:49 PM
   */
  selectMetaByDstIdsIgnoreDeleted(dstIds: string[]): Promise<DatasheetMetaEntity[]> {
    return this.find({ select: ['revision', 'metaData', 'dstId'], where: [{ dstId: In(dstIds) }] });
  }

  selectFieldMapByDstId(dstId: string): Promise<{ fieldMap: IFieldMap } | undefined> {
    return this.createQueryBuilder('vdm')
      .select('vdm.meta_data->\'$.fieldMap\'', 'fieldMap')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ fieldMap: IFieldMap }>();
  }

  selectFieldByFldIdAndDstId(dstId: string, fieldId: string): Promise<{ field: IField } | undefined> {
    return this.createQueryBuilder('vdm')
      .select('JSON_EXTRACT(vdm.meta_data, CONCAT(\'$.fieldMap.\', :fieldId))', 'field')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .setParameter('fieldId', fieldId)
      .getRawOne<{ field: IField }>();
  }

  selectFieldTypeByFldIdAndDstId(dstId: string, fieldId: string): Promise<{ type?: FieldType } | undefined> {
    return this.createQueryBuilder('vdm')
      .select('JSON_EXTRACT(vdm.meta_data, CONCAT(\'$.fieldMap.\', :fieldId, \'.type\'))', 'type')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .setParameter('fieldId', fieldId)
      .getRawOne<{ type?: FieldType }>();
  }

  countRowsByDstId(dstId: string): Promise<{ count: number } | undefined> {
    return this.createQueryBuilder('vdm')
      .select('IFNULL(SUM(JSON_LENGTH( vdm.meta_data -> \'$.views[0].rows\' )), 0)', 'count')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ count: number }>();
  }

  selectViewIdsByDstId(dstId: string): Promise<string[] | null> {
    return this.createQueryBuilder('vdm')
      .select('vdm.meta_data->\'$.views[*].id\'', 'viewId')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ viewId: string[] }>()
      .then((result) => {
        return result && result.viewId ? result.viewId : null;
      });
  }

  selectCountByDstIdAndFieldName(dstId: string, fieldName: string): Promise<number> {
    return this.createQueryBuilder('vdm')
      .where('JSON_SEARCH(vdm.meta_data, \'one\', :fieldName,  NULL, \'$.fieldMap.*.name\')')
      .andWhere('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .setParameter('fieldName', fieldName)
      .getCount();
  }
}
