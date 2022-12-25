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

import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'shared/entities/base.entity';

/**
 * Workbench-Datasheet Operation
 */
@Entity('datasheet_operation')
export class DatasheetOperationEntity extends BaseEntity {

  @Column({
    name: 'op_id',
    nullable: true,
    unique: true,
    comment: 'operation ID',
    length: 50,
  })
  opId!: string;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
  dstId?: string;

  @Column({
    name: 'action_name',
    nullable: true,
    comment: 'action name',
    length: 255,
  })
  actionName?: string;

  @Column('json', { name: 'actions', nullable: true, comment: 'action collection' })
  actions!: object;

  @Column({
    name: 'type',
    nullable: true,
    comment: 'action type(1:JOT,2:COT)',
    unsigned: true,
  })
  type?: number;

  @Column({
    name: 'member_id',
    nullable: true,
    comment: 'operating member ID(related#organization_member#id)',
  })
  memberId?: string;

  @Column({
    name: 'revision',
    comment: 'revision',
    unsigned: true,
    default: () => 0,
  })
  revision!: number;
}
