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

import { BaseEntity } from 'shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * Asset
 */
@Entity('asset')
export class AssetEntity extends BaseEntity {
  @Column({
    name: 'checksum',
    nullable: true,
    comment: 'Hash, MD5 summary of the entire file',
    length: 255,
    type: 'varchar',
  })
  checksum?: string;

  @Column({
    name: 'head_sum',
    nullable: true,
    comment: 'Base64 in the first 32 bytes of the resource file',
    length: 255,
    type: 'varchar',
  })
  headSum?: string;

  @Column({
    name: 'bucket',
    nullable: true,
    comment: 'Bucket name',
    length: 50,
    type: 'varchar',
  })
  bucket?: string;

  @Column({
    name: 'file_size',
    nullable: false,
    comment: 'File size (unit: byte)',
    width: 11,
    type: 'int',
  })
  fileSize!: number;

  @Column({
    name: 'file_url',
    nullable: false,
    comment: 'Cloud file storage path',
    width: 255,
    type: 'varchar',
  })
  fileUrl!: string;

  @Column({
    name: 'mime_type',
    nullable: false,
    comment: 'MimeType',
    width: 255,
    type: 'varchar',
  })
  mimeType!: string;

  @Column({
    name: 'extension_name',
    nullable: false,
    comment: 'File extension name',
    length: 255,
    type: 'varchar',
  })
  extensionName!: string;

  @Column({
    name: 'preview',
    nullable: false,
    comment: 'Preview tokens',
    length: 255,
    type: 'varchar',
  })
  preview!: string;

  @Column({
    name: 'is_template',
    nullable: false,
    comment: 'Whether it is a template attachment (0: no, 1: yes)',
    width: 1,
    type: 'tinyint',
  })
  isTemplate!: number;

  @Column({
    name: 'height',
    nullable: true,
    comment: 'Picture height',
    width: 11,
    type: 'int',
  })
  height?: number;

  @Column({
    name: 'width',
    nullable: true,
    comment: 'Picture width',
    width: 11,
    type: 'int',
  })
  width?: number;
}
