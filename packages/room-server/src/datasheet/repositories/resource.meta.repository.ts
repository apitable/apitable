import { EntityRepository, getConnection, Repository } from 'typeorm';
import { ResourceMetaEntity } from '../entities/resource.meta.entity';
import { IResourceMeta, IResourceRevision } from '@apitable/core';

@EntityRepository(ResourceMetaEntity)
export class ResourceMetaRepository extends Repository<ResourceMetaEntity> {
  /**
   * 查询实体 metaData
   * @param resourceId 资源ID
   */
  public async selectMetaByResourceId(resourceId: string): Promise<IResourceMeta> {
    const meta = await this.findOne({
      select: ['metaData'],
      where: [{ resourceId, isDeleted: false }],
    });
    return meta?.metaData || {};
  }

  /**
   * 更新实体 metaData
   * @param resourceId 资源ID
   * @param userId 用户ID
   * @param metaData 变更后的 metaData
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
   * 查询多个资源对应的版本号
   * @param resourceIds 资源ID 数组
   */
  async getRevisionByRscIds(resourceIds: string[]): Promise<IResourceRevision[]> {
    const queryRunner = getConnection().createQueryRunner();
    const revisionInfo = await queryRunner.query(
      `
          SELECT resource_id resourceId, revision
          FROM vika_resource_meta
          WHERE resource_id IN (?) AND is_deleted = 0
        `,
      [resourceIds],
    );
    await queryRunner.release();
    return revisionInfo;
  }

  /**
   * 获取资源的版本号
   * @param resourceId 资源ID
   */
  selectReversionByResourceId(resourceId: string): Promise<{ revision: number }> {
    return this.findOne({
      select: ['revision'],
      where: [{ resourceId, isDeleted: false }],
    });
  }
}
