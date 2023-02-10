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
import { IUserValue } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';

export class UnitInfoDto implements IUserValue {
  @ApiProperty({
    type: String,
    example: 0,
    description: 'unit Id',
  })
  unitId!: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: 'unit name',
  })
  name!: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: 'user nickName',
  })
  nickName!: string;

  @ApiProperty({
    type: Number,
    example: '1: read, 2: blue, 3: yellow',
    description: 'default avatar color number',
  })
  avatarColor!: number;

  /**
   * @deprecated
   */
  @ApiProperty({
    type: String,
    example: 0,
    description: 'user uuid',
  })
  uuid!: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: 'user ID',
  })
  userId!: string;

  @ApiProperty({
    type: Number,
    example: '1: department, 2: tag, 3: member',
    description: 'member type',
  })
  type!: number;

  @ApiProperty({
    type: String,
    example: 'avatar',
    description: 'avatar',
  })
  avatar!: string;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'active status',
  })
  isActive!: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'is it deleted',
  })
  isDeleted!: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'if nick name was modified ever',
  })
  isNickNameModified!: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'if nick name was modified ever by wecom member',
  })
  isMemberNameModified!: boolean;

}