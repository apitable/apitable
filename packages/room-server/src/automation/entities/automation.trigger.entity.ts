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

@Entity('automation_trigger')
export class AutomationTriggerEntity extends BaseEntity {
  @Column({
    name: 'trigger_id',
    nullable: false,
    unique: true,
    length: 50,
  })
    triggerId!: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
    robotId!: string;

  @Column({
    name: 'trigger_type_id',
    nullable: true,
    length: 255,
  })
    triggerTypeId?: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    length: 50,
  })
    resourceId?: string;

  @Column({
    name: 'prev_trigger_id',
    nullable: false,
    length: 50,
  })
    prevTriggerId?: string;

  @Column('json', {
    name: 'input',
    nullable: true,
  })
    input?: object;
}
