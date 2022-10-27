import { ApiPropertyOptional } from '@nestjs/swagger';

export class FieldQueryRo {
  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'viwG9l1VPD6nH',
    description: '视图 ID，指定视图则返回的 fields 顺序和视图保持一致，隐藏的字段不会返回。',
  })
    viewId: string;
}
