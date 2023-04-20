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

import { IResourceMeta, IResourceRevision } from '@apitable/core';
import { EntityRepository, In, Repository } from 'typeorm';
import { ResourceMetaEntity } from '../entities/resource.meta.entity';

@EntityRepository(ResourceMetaEntity)
export class ResourceMetaRepository extends Repository<ResourceMetaEntity> {
  /**
   * Obtain the metadata entity of the given resource.
   */
  public async selectMetaByResourceId(resourceId: string): Promise<IResourceMeta> {
    const meta = await this.findOne({
      select: ['metaData'],
      where: [{ resourceId, isDeleted: false }],
    });
    return meta?.metaData || {};
  }

  /**
   * Update the metadata entity.
   *
   * @param resourceId resource ID
   * @param userId user ID
   * @param metaData updated metaData
   */
  public async updateMetaDataByResourceId(resourceId: string, userId: string, metaData: IResourceMeta) {
    const meta = await this.selectMetaByResourceId(resourceId);
    return this.update(
      { resourceId },
      {
        metaData: { ...meta, ...metaData },
        updatedBy: userId,
      },
    );
  }

  public async updateMetaAndRevision(resourceId: string, userId: string, metaData: IResourceMeta, revision: number) {
    const meta = await this.selectMetaByResourceId(resourceId);
    return this.update(
      { resourceId },
      {
        metaData: { ...meta, ...metaData },
        updatedBy: userId,
        revision,
      },
    );
  }

  /**
   * Obtain the revision numbers of multiple resources
   * Notice: In fact, return data Revision is string type, not number type.
   *
   * @param resourceIds resource ID array
   */
  public async getRevisionByRscIds(resourceIds: string[]): Promise<IResourceRevision[]> {
    return await this.find({
      select: ['resourceId', 'revision'],
      where: {
        resourceId: In(resourceIds),
        isDeleted: 0,
      }
    });
  }

  /**
   * Obtain the revision number of a resource
   */
  selectRevisionByResourceId(resourceId: string): Promise<{ revision: number } | undefined> {
    return this.findOne({
      select: ['revision'],
      where: [{ resourceId, isDeleted: false }],
    });
  }
}
