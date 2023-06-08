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
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsEnum, IsInt, Max, Min } from 'class-validator';
import { NodeTypeEnum } from 'shared/enums/node.enum';
import { integerStringToArray } from 'shared/helpers/fusion.helper';
import { ApiTipConstant } from '@apitable/core';

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
    type: String,
    required: true,
    example: 'Datasheet',
    description: 'value in ("Folder", "Datasheet", "Form", "Mirror", "Dashboard")',
  })
  @IsEnum(NodeTypeEnum, { message: ApiTipConstant.api_node_node_type_value_error })
  type!: NodeTypeEnum;

  @ApiProperty({
    type: Array,
    required: false,
    example: '[0, 1]',
    default: '[0, 1, 2, 3]',
    description: '0 - Manger, 1 - Editor, 2 - Update-only, 3 - Read-only',
  })
  @Transform(value => integerStringToArray(value), { toClassOnly: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: ApiTipConstant.api_node_permission_value_error })
  @Max(3, { each: true, message: ApiTipConstant.api_node_permission_value_error })
  @Min(0, { each: true, message: ApiTipConstant.api_node_permission_value_error })
  permissions?: number[];

  @ApiProperty({
    type: String,
    required: false,
    example: 'datasheet',
    description: 'Specify the name of node when performing a partial match search.',
  })
  @IsOptional()
  @IsString()
  query?: string;
}
