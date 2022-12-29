import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Asset
 */
@Entity(`asset`)
export class AssetEntity extends BaseEntity {
  @Column({
    name: 'checksum',
    nullable: true,
    comment: 'Hash, MD5 summary of the entire file',
    length: 255,
    type: 'varchar',
  })
    checksum: string | null;

  @Column({
    name: 'head_sum',
    nullable: true,
    comment: 'Base64 in the first 32 bytes of the resource file',
    length: 255,
    type: 'varchar',
  })
    headSum: string;

  @Column({
    name: 'bucket',
    nullable: true,
    comment: 'Bucket name',
    length: 50,
    type: 'varchar',
  })
    bucket: string;

  @Column({
    name: 'file_size',
    nullable: false,
    comment: 'File size (unit: byte)',
    width: 11,
    type: 'int',
  })
    fileSize: number;

  @Column({
    name: 'file_url',
    nullable: false,
    comment: 'Cloud file storage path',
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
    comment: 'File extension name',
    length: 255,
    type: 'varchar',
  })
    extensionName: string;

  @Column({
    name: 'preview',
    nullable: false,
    comment: 'Preview tokens',
    length: 255,
    type: 'varchar',
  })
    preview: string;

  @Column({
    name: 'is_template',
    nullable: false,
    comment: 'Whether it is a template attachment (0: no, 1: yes)',
    width: 1,
    type: 'tinyint',
  })
    isTemplate: number;

  @Column({
    name: 'height',
    nullable: true,
    comment: 'Picture height',
    width: 11,
    type: 'int',
  })
    height: number | null;

  @Column({
    name: 'width',
    nullable: true,
    comment: 'Picture width',
    width: 11,
    type: 'int',
  })
    width: number | null;
}
