import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 资源表
 */
@Entity('vika_asset')
export class AssetEntity extends BaseEntity {
  @Column({
    name: 'checksum',
    nullable: true,
    comment: '整个文件的Hash，MD5摘要',
    length: 255,
    type: 'varchar',
  })
    checksum: string | null;

  @Column({
    name: 'head_sum',
    nullable: true,
    comment: '资源文件前32个字节的Base64',
    length: 255,
    type: 'varchar',
  })
    headSum: string;

  @Column({
    name: 'bucket',
    nullable: true,
    comment: '存储桶标志',
    length: 50,
    type: 'varchar',
  })
    bucket: string;

  @Column({
    name: 'file_size',
    nullable: false,
    comment: '文件大小(单位:byte)',
    width: 11,
    type: 'int',
  })
    fileSize: number;

  @Column({
    name: 'file_url',
    nullable: false,
    comment: '云端文件存放路径',
    width: 255,
    type: 'varchar',
  })
    fileUrl: string;

  @Column({
    name: 'mime_type',
    nullable: false,
    comment: 'MimeType',
    width: 255,
    type: 'varchar',
  })
    mimeType: string;

  @Column({
    name: 'extension_name',
    nullable: false,
    comment: '文件扩展名',
    length: 255,
    type: 'varchar',
  })
    extensionName: string;

  @Column({
    name: 'preview',
    nullable: false,
    comment: '预览图令牌',
    length: 255,
    type: 'varchar',
  })
    preview: string;

  @Column({
    name: 'is_template',
    nullable: false,
    comment: '是否是模版附件(0:否,1:是)',
    width: 1,
    type: 'tinyint',
  })
    isTemplate: number;

  @Column({
    name: 'height',
    nullable: true,
    comment: '图片高度',
    width: 11,
    type: 'int',
  })
    height: number | null;

  @Column({
    name: 'width',
    nullable: true,
    comment: '图片宽度',
    width: 11,
    type: 'int',
  })
    width: number | null;
}
