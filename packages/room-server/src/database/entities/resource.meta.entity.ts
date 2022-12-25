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

import { IResourceMeta, ResourceType } from '@apitable/core';
import { BaseEntity } from 'shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * The metadata table corresponding to the resource, such as Form/Dashboard
 */
@Entity('resource_meta')
export class ResourceMetaEntity extends BaseEntity {
  @Column({
    name: 'resource_id',
    nullable: false,
    comment: 'resource ID(related#node#node_id)',
    length: 50,
  })
  resourceId!: string;

  @Column({
    name: 'resource_type',
    nullable: false,
    comment: 'resource type(0: datasheet, 1: form, 2: dashboard, 3: widget)',
    unsigned: true,
    default: () => 0,
  })
  resourceType!: ResourceType;

  @Column('json', {
    name: 'meta_data',
    nullable: true,
    comment: 'meta data',
  })
  metaData?: IResourceMeta;

  @Column('bigint', {
    name: 'revision',
    comment: 'revision',
    nullable: false,
    unsigned: true,
    default: () => 0,
  })
  revision!: number;
}
