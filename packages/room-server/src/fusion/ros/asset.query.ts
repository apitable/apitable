import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssetUploadQueryRo {
  @ApiPropertyOptional({
    type: Number,
    maximum: 20,
    default: 1,
    example: '1',
    description: 'Number of pre-signed URLs created (default is 1, maximum is 20)',
  })
  count: number;
}
