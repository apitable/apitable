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
import { NodeTypeEnum } from 'shared/enums/node.enum';
import { IAPINode } from 'shared/interfaces/node.interface';

export class NodeDto implements IAPINode {
  @ApiProperty({
    type: String,
    description: 'node ID',
    example: 'fodDWMTvdtmFs',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'node name',
    example: 'order management',
  })
  name!: string;

  @ApiProperty({
    enum: NodeTypeEnum,
    description: 'node type',
    example: NodeTypeEnum.Folder,
  })
  type!: NodeTypeEnum;

  @ApiProperty({
    type: String,
    description: 'node Emoji ID',
    example: '👋',
  })
  icon!: string;

  @ApiProperty({
    type: Boolean,
    description: 'if it had been favorite',
    example: true,
  })
  isFav!: boolean;
}
