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
import { ViewTypeTextEnum } from 'shared/enums/field.type.enum';
import { IApiDatasheetView } from 'shared/interfaces';

export class DatasheetViewDto implements IApiDatasheetView {
  @ApiProperty({
    type: String,
    example: 'viwpdA8TUBp5r',
    description: 'view ID',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'view name',
    example: 'All the orders',
  })
  name!: string;

  @ApiProperty({
    enum: ViewTypeTextEnum,
    description: 'view type: Grid, Gallery, Kanban and Gantt',
    example: ViewTypeTextEnum.Grid,
  })
  type!: ViewTypeTextEnum;
}
