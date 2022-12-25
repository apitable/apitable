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

import { ApiTipConstant } from '@apitable/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsOptional, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import { API_DEFAULT_PAGE_SIZE, API_MAX_PAGE_SIZE } from 'shared/common';
import { objStringToArray } from 'shared/helpers/fusion.helper';
import { IApiPaginateRo } from 'shared/interfaces';
import { SortRo } from './sort.ro';

/**
 * Record sorting
 * @author Zoe zheng
 * @date 2020/7/21 7:09 PM
 */
export abstract class PageRo implements IApiPaginateRo {
  @ApiPropertyOptional({
    type: Number,
    example: 100,
    default: 100,
    description: 'The total number of records returned per page, the default value is 100. This parameter only accepts an integer of 1-1000',
  })
  // For parameter verification
  @Type(() => Number)
  @IsOptional()
  @ValidateIf(o => o.pageSize !== -1)
  @Min(1, { message: ApiTipConstant.api_params_pagesize_min_error })
  @Max(API_MAX_PAGE_SIZE, {
    message: ApiTipConstant.api_params_pagesize_max_error,
  })
  pageSize: number = API_DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({
    type: Number,
    example: 1000,
    description:
      '(Optional) Specify the total number of returned records.' +
      'If this parameter is used with PageSize, and the value of this parameter is less than Total (total record), return this parameter',
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: ApiTipConstant.api_params_maxrecords_min_error })
  maxRecords?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    default: 1,
    description: 'Specify the page number of the pagination, use it with the parameter size',
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: ApiTipConstant.api_params_pagenum_min_error })
  pageNum = 1;

  @ApiPropertyOptional({
    type: [SortRo],
    isArray: true,
    description:
      'Sort the records of the specified datasheet. A array consisting of multiple "sorting objects".' +
      'The structure of a Sort Object is {"Order": "Desc", "Field": "Customer ID"}' +
      'URL parameter form: sort[][field] = flDaj8zbpzj1x & sort[][order] = asc, ' +
      'Note: If this parameter is used with the viewId parameter, ' +
      'the sorting conditions specified in this parameter will cover the sorting conditions in the view',
  })
  @Type(() => SortRo)
  @Transform(value => plainToClass(SortRo, objStringToArray(value), {}), { toClassOnly: true })
  // TODO: This annotation has a bug that cannot pass the OPTIONS, so ignoring the incorrect verification of the format
  @ValidateNested({ message: ApiTipConstant.api_params_instance_sort_error })
  @IsOptional()
  sort?: SortRo[];
}
