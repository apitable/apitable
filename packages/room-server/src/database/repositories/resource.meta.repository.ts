import { EntityRepository, getConnection, Repository } from 'typeorm';
import { ResourceMetaEntity } from '../entities/resource.meta.entity';
import { IResourceMeta, IResourceRevision } from '@apitable/core';

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
  public async updateMetaDataByResourceId(resourceId: string, userId, metaData: IResourceMeta) {
    const meta = await this.selectMetaByResourceId(resourceId);
    return this.update(
      { resourceId },
      {
        metaData: { ...meta, ...metaData },
        updatedBy: userId,
      },
    );
  }

  public async updateMetaAndRevision(resourceId: string, userId, metaData: IResourceMeta, revision: number) {
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
  selectReversionByResourceId(resourceId: string): Promise<{ revision: number }> {
    return this.findOne({
      select: ['revision'],
      where: [{ resourceId, isDeleted: false }],
    });
  }
}
