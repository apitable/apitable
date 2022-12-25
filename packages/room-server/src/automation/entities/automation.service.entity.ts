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

@Entity('automation_service')
export class AutomationServiceEntity extends BaseEntity {
  @Column({
    name: 'service_id',
    nullable: false,
    length: 50,
  })
  serviceId!: string;

  @Column({
    name: 'slug',
    nullable: false,
    length: 50,
  })
  slug!: string;

  @Column({
    name: 'name',
    nullable: true,
    length: 255,
  })
  name?: string;

  @Column({
    name: 'description',
    nullable: true,
    length: 255,
  })
  description?: string;

  @Column({
    name: 'logo',
    nullable: true,
    length: 255,
  })
  logo?: string;

  @Column({
    name: 'base_url',
    nullable: true,
  })
  baseUrl?: string;

  @Column('json', {
    name: 'i18n',
    nullable: true,
  })
  i18n?: object;
}
