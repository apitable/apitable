import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssetUploadQueryRo {
  @ApiPropertyOptional({
    type: Number,
    maximum: 20,
    default: 1,
    example: '1',
    description:
      '创建的预签名URL数量（默认为1，最大为20）',
  })
  count: number;
}