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
import { ApiRecordDto } from '../dtos/api.record.dto';
import { ApiPage } from './api.page';

export class PageVo extends ApiPage<ApiRecordDto[]> {
  @ApiProperty({ type: [ApiRecordDto] })
  override records!: ApiRecordDto[];

  @ApiProperty({
    type: Number,
    example: 500,
    description: 'Total number of records',
  })
  override total!: number;

  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Total number of records returned per page',
  })
  override pageSize!: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Page numbering for pagination',
  })
  override pageNum!: number;
}
