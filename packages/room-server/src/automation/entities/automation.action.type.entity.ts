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

@Entity('automation_action_type')
export class AutomationActionTypeEntity extends BaseEntity {
  @Column({
    name: 'service_id',
    length: 50,
    nullable: false,
  })
  serviceId!: string;

  @Column({
    name: 'action_type_id',
    nullable: false,
    length: 50,
  })
  actionTypeId!: string;

  @Column({
    name: 'name',
    length: 255,
  })
  name!: string;

  @Column({
    name: 'description',
    length: 255,
  })
  description!: string;

  @Column({
    name: 'endpoint',
    length: 50,
  })
  endpoint!: string;

  @Column('json', {
    name: 'input_json_schema',
    nullable: true,
  })
  inputJSONSchema?: object;

  @Column('json', {
    name: 'output_json_schema',
    nullable: true,
  })
  outputJSONSchema?: object;

  @Column('json', {
    name: 'i18n',
    nullable: true,
  })
  i18n?: object;
}
