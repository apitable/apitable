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

import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('automation_run_history')
export class AutomationRunHistoryEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'task_id',
    nullable: false,
    unique: true,
    length: 50,
  })
  taskId!: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
  robotId!: string;

  @Column({
    name: 'space_id',
    nullable: false,
    length: 50,
    comment: 'spaceID of current robot',
  })
  spaceId!: string;

  @Column({
    name: 'status',
    nullable: false,
    unsigned: true,
    comment: 'state(0:running,1:succeed,2:failed)',
  })
  status!: number;

  @Column('json', {
    name: 'data',
    nullable: true,
  })
  data?: object;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
