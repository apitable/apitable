import { ApiPropertyOptional } from '@nestjs/swagger';
export class RecordViewQueryRo {
  @ApiPropertyOptional({
    type: String,
    example: 'viwG9l1VPD6nH',
    description:
      '视图ID,如果附带此参数,则只返回经过视图筛选后的记录合集.注：可以搭配使用fields参数过滤不需要的字段数据',
  })
    viewId: string;
}
