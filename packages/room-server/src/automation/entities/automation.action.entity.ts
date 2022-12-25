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

@Entity('automation_action')
export class AutomationActionEntity extends BaseEntity {
  @Column({
    name: 'action_id',
    nullable: false,
    unique: true,
    length: 50,
  })
  actionId!: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
  robotId!: string;

  @Column({
    name: 'action_type_id',
    nullable: true,
    comment: 'ID of action-type',
    length: 255,
  })
  actionTypeId?: string;

  @Column({
    name: 'prev_action_id',
    nullable: true,
    comment: 'previous action-type id',
    length: 255,
  })
  prevActionId?: string;

  @Column('json', {
    name: 'input',
    nullable: true,
  })
  input?: object;
}
