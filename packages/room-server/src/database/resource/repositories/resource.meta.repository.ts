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
import { EntityRepository, getConnection, Repository } from 'typeorm';
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
   *
   * @param resourceIds resource ID array
   */
  async getRevisionByRscIds(resourceIds: string[]): Promise<IResourceRevision[]> {
    const queryRunner = getConnection().createQueryRunner();
    // todo(itou): replace dynamic sql
    const revisionInfo = await queryRunner.query(
      `
          SELECT resource_id resourceId, revision
          FROM ${this.manager.connection.options.entityPrefix}resource_meta
          WHERE resource_id IN (?) AND is_deleted = 0
        `,
      [resourceIds],
    );
    await queryRunner.release();
    return revisionInfo;
  }

  /**
   * Obtain the revision number of a resource
   */
  selectReversionByResourceId(resourceId: string): Promise<{ revision: number } | undefined> {
    return this.findOne({
      select: ['revision'],
      where: [{ resourceId, isDeleted: false }],
    });
  }
}
