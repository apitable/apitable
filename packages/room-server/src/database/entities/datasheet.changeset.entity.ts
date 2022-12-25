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

import { IOperation } from '@apitable/core';
import { BaseEntity } from 'shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * Workbench-Digital table operation change collection table
 */
@Entity('datasheet_changeset')
export class DatasheetChangesetEntity extends BaseEntity {

  @Column({
    name: 'message_id',
    nullable: true,
    comment: 'Unique identifier of a changeset request',
    length: 255,
  })
  messageId?: string;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID',
    length: 50,
  })
  dstId?: string;

  @Column({
    name: 'member_id',
    nullable: true,
    comment: 'Operating member ID (associated#organization_member#ID)',
  })
  memberId?: string;

  @Column('json', {
    name: 'operations',
    nullable: true,
    comment: 'Operation Action collection',
  })
  operations?: IOperation[];

  @Column({
    name: 'revision',
    nullable: true,
    comment: 'revision',
    unsigned: true,
    default: () => 0,
  })
  revision!: number;
}
