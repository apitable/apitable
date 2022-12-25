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

import { ICommentMsg } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    type: Number,
    description: 'time of leaving a comment, timestamp',
  })
  createdAt!: number;

  @ApiProperty({
    type: Number,
    description: 'time of editing a comment, timestamp',
  })
  updatedAt?: number;

  @ApiProperty({
    type: String,
    description: 'comment ID',
  })
  commentId!: string;

  @ApiPropertyOptional({
    type: String,
    description: "comment creator's uuid",
    deprecated: true,
  })
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({
    type: String,
    description: "comment creator's unitId",
  })
  @IsOptional()
  unitId?: string;

  @ApiProperty({
    type: Object,
    description: 'comment message',
  })
  commentMsg!: ICommentMsg;

  @ApiPropertyOptional({
    type: Number,
    description: 'comment revision',
  })
  @IsOptional()
  revision?: number;
}
