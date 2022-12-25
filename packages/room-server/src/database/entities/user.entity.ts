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

/**
 * Workbench-User
 */
@Entity('user')
export class UserEntity {
  @Column({
    name: 'uuid',
    nullable: true,
    unique: true,
    comment: 'user uuid',
    length: 32,
  })
  uuid!: string;

  @Column({
    name: 'nick_name',
    nullable: true,
    comment: 'nick name',
    length: 50,
  })
  nikeName?: string;

  @Column({
    name: 'mobile_phone',
    nullable: true,
    comment: 'mobile phone number',
    length: 50,
  })
  mobilePhone?: string;

  @Column({
    name: 'email',
    nullable: true,
    comment: 'email',
    length: 100,
  })
  email?: string;

  @Column({
    name: 'password',
    nullable: true,
    comment: 'password',
    length: 255,
  })
  password?: string;

  @Column({
    name: 'avatar',
    nullable: true,
    comment: 'avatar',
    length: 255,
  })
  avatar?: string;

  @Column({
    name: 'color',
    nullable: true,
    comment: 'default avatar color',
    width: 10,
    type: 'int',
  })
  color?: number;

  @Column({
    name: 'gender',
    comment: 'gender',
    length: 1,
    default: '1',
  })
  gender!: string;

  @Column({
    name: 'remark',
    nullable: true,
    comment: 'remark',
    length: 255,
  })
  remark?: string;

  @Column({
    name: 'ding_open_id',
    nullable: true,
    comment: 'The unique ID in the open application',
    length: 255,
  })
  dingOpenId?: string;

  @Column({
    name: 'ding_union_id',
    nullable: true,
    comment: 'The unique ID in the Dingding developer enterprise',
    length: 255,
  })
  dingUnionId?: string;

  @Column('timestamp', {
    name: 'last_login_time',
    nullable: true,
    comment: 'updated time',
  })
  lastLoginTime?: Date;

  @Column({
    name: 'locale',
    nullable: true,
    comment: 'locale',
    length: 50,
  })
  locale?: string;

  @Column({
    name: 'is_social_name_modified',
    nullable: true,
    comment: 'have you modified the nickname as a third -party IM user? 0: No; 1: Yes; 2: Not third -party users of IM',
    width: 1,
    type: 'tinyint',
  })
  isSocialNameModified?: number;

  // picked from base entity
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'is_deleted',
    comment: 'deleted mark (0: No, 1: Yes)',
    unsigned: true,
    default: () => false,
  })
  isDeleted!: boolean;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
