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

@Entity('widget')
export class WidgetEntity extends BaseEntity {
  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: 'node ID',
    length: 50,
  })
  nodeId!: string;

  @Column({
    name: 'space_id',
    nullable: false,
    unique: true,
    comment: 'space ID',
    length: 50,
  })
  spaceId!: string;

  @Column({
    name: 'package_id',
    nullable: false,
    unique: true,
    comment: 'package ID',
    length: 50,
  })
  packageId!: string;

  @Column({
    name: 'widget_id',
    nullable: false,
    unique: true,
    comment: 'widget ID',
    length: 50,
  })
  widgetId!: string;

  @Column({
    name: 'name',
    nullable: true,
    comment: 'name',
    length: 255,
  })
  name?: string;

  @Column('json', {
    name: 'storage',
    nullable: true,
    comment: 'storage configuration',
  })
  storage?: { [key: string]: any };

  @Column({
    name: 'revision',
    nullable: false,
    unsigned: true,
    comment: 'revision',
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
  revision!: number;
}