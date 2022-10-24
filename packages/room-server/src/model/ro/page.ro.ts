import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiTipConstant } from '@apitable/core';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsOptional, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import { API_DEFAULT_PAGE_SIZE, API_MAX_PAGE_SIZE } from 'common';
import { objStringToArray } from 'helpers/fusion.helper';
import { IApiPaginateRo } from 'interfaces';
import { SortRo } from './sort.ro';

/**
 * <p>
 * 记录排序
 * </p>
 * @author Zoe zheng
 * @date 2020/7/21 7:09 下午
 */
export abstract class PageRo implements IApiPaginateRo {
  @ApiPropertyOptional({
    type: Number,
    example: 100,
    default: 100,
    description: '指定每页返回的记录总数，缺省值为100。此参数只接受1-1000的整数',
  })
  // 为了参数验证
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
    description: '（选填）指定返回记录的总数量。如果此参数与pageSize一起使用，并且此参数的值小于total(总记录数),就返回此参数',
  })
  // 为了参数验证
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: ApiTipConstant.api_params_maxrecords_min_error })
    maxRecords: number;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    default: 1,
    description: '指定分页的页码，与参数size配合使用',
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: ApiTipConstant.api_params_pagenum_min_error })
    pageNum = 1;

  @ApiPropertyOptional({
    type: [SortRo],
    isArray: true,
    description:
      '对指定维格表的记录进行排序。由多个“排序对象”组成的数组。一个Sort Object的结构为{"order":"desc", "field":"客户ID"}。' +
      'url参数形式sort[][filed]=fldAj8ZBpzj1X&sort[][order]=asc注：如果此参数与viewId参数一起使用，则此参数指定的排序条件将会覆盖视图里的排序条件。',
  })
  @Type(() => SortRo)
  @Transform(value => plainToClass(SortRo, objStringToArray(value), {}), { toClassOnly: true })
  // todo 这个注解有个bug，不能传递options,所以忽略格式不正确的校验
  @ValidateNested({ message: ApiTipConstant.api_params_instance_sort_error })
  @IsOptional()
    sort: SortRo[];
}
