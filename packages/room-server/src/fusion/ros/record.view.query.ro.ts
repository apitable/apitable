import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RecordViewQueryRo {
  @ApiPropertyOptional({
    type: String,
    example: 'viwG9l1VPD6nH',
    description:
      'If this parameter is included, only the set of records filtered by the view will be returned' +
      '\nNote: You can filter the data of unwanted fields with the fields parameter',
  })
  @IsOptional()
  viewId: string;
}
