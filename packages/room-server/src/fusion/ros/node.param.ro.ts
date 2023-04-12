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

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class NodeListParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spczdmQDfBAn5',
    description: 'space Id',
  })
  @IsString()
  spaceId!: string;
}

export class OldNodeDetailParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'spczdmQDfBAn5',
    description: 'space Id',
  })
  @IsString()
  spaceId!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'dstS94qPZFXjC1LKns',
    description: 'node Id',
  })
  @IsString()
  nodeId!: string;
}

export class NodeDetailParamRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dstS94qPZFXjC1LKns',
    description: 'node Id',
  })
  @IsString()
  nodeId!: string;
}

export class NodeListQueryRo {

  @ApiProperty({
    type: Number,
    required: true,
    example: '2',
    description: '1: folder 2: datasheet 3:form 4:dashboard 5: mirror',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  type!: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'reader',
    description: 'reader | editor',
  })
  @IsString()
  @IsOptional()
  role?: 'reader' | 'editor';
}

