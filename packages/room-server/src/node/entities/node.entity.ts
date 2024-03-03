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

import { IFormProps } from '@apitable/core';
import { BaseEntity } from 'shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * Workbench-Node
 */
@Entity('node')
export class NodeEntity extends BaseEntity {
  @Column({
    name: 'type',
    nullable: false,
    comment: 'node type(0: root node; 1: folder; 2: datasheet; 3: form)',
    width: 2,
    type: 'tinyint',
  })
    type!: number;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
  })
    spaceId!: string;

  @Column({
    name: 'unit_id',
    type: 'bigint',
    nullable: false,
    comment: 'unit ID',
    default: '0',
  })
    unitId!: string;

  @Column({
    name: 'parent_id',
    nullable: false,
    comment: 'parent node ID',
    length: 50,
  })
    parentId!: string;

  @Column({
    name: 'pre_node_id',
    nullable: true,
    comment: 'previous node ID',
    length: 50,
  })
    preNodeId?: string;

  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: 'node Id(related#node#node_id)',
    length: 50,
  })
    nodeId!: string;

  @Column({
    name: 'node_name',
    nullable: true,
    comment: 'node name',
    length: 255,
  })
    nodeName!: string;

  @Column({
    name: 'icon',
    nullable: true,
    comment: 'node icon',
    length: 100,
  })
    icon?: string;

  @Column({
    name: 'cover',
    nullable: true,
    comment: 'Cover TOKEN',
    length: 255,
  })
    cover?: string;

  @Column({
    name: 'is_template',
    comment: 'is it a template(0: no, 1: yes)',
    unsigned: true,
    default: () => false,
  })
    isTemplate!: boolean;

  @Column('json', {
    name: 'extra',
    nullable: true,
    comment: 'other information',
  })
    extra?: IFormProps;

  @Column({
    name: 'deleted_path',
    nullable: true,
    comment: 'The path when deletes',
    length: 255,
  })
    deletedPath?: string;

  @Column({
    name: 'is_rubbish',
    comment: 'recycling station mark (0: no, 1: yes)',
    unsigned: true,
    default: () => false,
  })
    isRubbish!: boolean;

  @Column({
    name: 'is_banned',
    comment: 'banning sign (0: No, 1: Yes)',
    unsigned: true,
    default: () => false,
  })
    isBanned!: boolean;
}
