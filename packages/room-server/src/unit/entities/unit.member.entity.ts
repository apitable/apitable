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

@Entity('unit_member')
export class UnitMemberEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    nullable: true,
    comment: 'user ID(related#user#id)',
    width: 20,
    type: 'bigint',
  })
  userId?: number;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
    type: 'varchar',
  })
  spaceId!: string;

  @Column({
    name: 'member_name',
    nullable: false,
    comment: 'member name',
    length: 255,
    type: 'varchar',
  })
  memberName!: string;

  @Column({
    name: 'job_number',
    nullable: false,
    comment: 'job number',
    length: 60,
    type: 'varchar',
  })
  jobNumber!: string;

  @Column({
    name: 'position',
    nullable: false,
    comment: 'position',
    width: 255,
    type: 'varchar',
  })
  position!: string;

  @Column({
    name: 'mobile',
    nullable: false,
    comment: 'mobile number',
    length: 20,
    type: 'varchar',
  })
  mobile!: string;

  @Column({
    name: 'email',
    nullable: false,
    comment: 'email',
    length: 100,
    type: 'varchar',
  })
  email!: string;

  @Column({
    name: 'ding_user_id',
    nullable: false,
    comment: 'DingDing user ID',
    length: 64,
    type: 'varchar',
  })
  dingUserId?: string;

  @Column({
    name: 'status',
    nullable: false,
    comment: 'user status(0: Non -active, 1: active, 2: pre -delete, 3: No activation)',
    width: 2,
    type: 'tinyint',
  })
  status!: number | 0;

  @Column({
    name: 'is_social_name_modified',
    nullable: true,
    comment: 'Have you modified the nickname as a third -party IM user? 0: No; 1: Yes; 2: Not third -party users of IM',
    width: 1,
    type: 'tinyint',
  })
  isSocialNameModified?: number;

  @Column({
    name: 'is_point',
    nullable: false,
    comment: 'are there little red dots (0: no, 1: yes)',
    width: 1,
    type: 'tinyint',
  })
  isPoint!: number | 0;

  @Column({
    name: 'is_active',
    nullable: false,
    comment: 'is it activated (0: No, 1: Yes)',
    width: 1,
    type: 'tinyint',
  })
  isActive!: number | 0;

  @Column({
    name: 'is_admin',
    nullable: false,
    comment: 'whether the administrator (0: no, 1: yes)',
    width: 1,
    type: 'tinyint',
  })
  isAdmin!: number | 0;
}
