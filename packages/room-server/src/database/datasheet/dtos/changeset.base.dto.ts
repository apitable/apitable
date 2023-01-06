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

import { IOperation, IRemoteChangeset, ResourceType } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ChangesetBaseDto implements IRemoteChangeset {
  @ApiProperty({
    type: String,
    description: 'changeset unique identification, works for making unique changeset',
  })
  messageId!: string;

  @ApiProperty({
    enum: ResourceType,
    description: 'changeset resource type',
  })
  resourceType!: ResourceType;

  @ApiProperty({
    type: String,
    description: 'changeset resource ID',
  })
  resourceId!: string;

  @ApiProperty({
    type: Number,
    description: 'revision',
  })
  revision!: number;

  @ApiProperty({
    isArray: true,
    type: Object,
    description: 'an array of operation actions',
  })
  operations!: IOperation[];

  @ApiPropertyOptional({
    type: String,
    description: 'creator ID',
  })
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    type: String,
    description: 'creator uuid',
  })
  userId!: string;

  @ApiProperty({
    type: Number,
    description: 'changeset source type(0: user_interface,1: openapi, 2: relation_effect)',
  })
  sourceType?: number;

  @ApiProperty({
    description: 'created time-timestamp',
    type: Number,
  })
  createdAt!: number;

  @ApiProperty({
    description: 'is it comment',
    type: Number,
  })
  isComment!: number;

  @ApiProperty({
    description: 'temporary use for the exact time field',
    type: Number,
  })
  tmpCreatedAt?: number;
}
