import { EntityRepository, Repository } from 'typeorm';
import { AssetEntity } from '../entities/asset.entity';

@EntityRepository(AssetEntity)
export class AssetRepository extends Repository<AssetEntity> {
  selectBaseInfoByFileUrl(fileUrl: string): Promise<AssetEntity | undefined> {
    return this.findOne({
      select: ['id', 'fileSize', 'height', 'width', 'extensionName', 'mimeType', 'preview', 'bucket'],
      where: [{ fileUrl, isDeleted: false }],
    });
  }
}
