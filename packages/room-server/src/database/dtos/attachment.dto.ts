import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty({
    type: String,
    example: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
    description: '附件访问路径',
  })
    token: string;

  @ApiProperty({
    type: String,
    example: '9d4911932181f254433a86b05797f9a6.jpeg',
    description: '附件原始名称',
  })
    name: string;

  @ApiProperty({
    type: Number,
    example: 7194,
    description: '附件大小',
  })
    size: number;

  @ApiProperty({
    type: Number,
    example: 479,
    description: '附件宽',
  })
    width: number;

  @ApiProperty({
    type: Number,
    example: 478,
    description: '附件长',
  })
    height: number;

  @ApiProperty({
    type: String,
    example: 'image/jpeg',
    description: '附件类型',
  })
    mimeType: string;

  @ApiPropertyOptional({
    type: String,
    example: '***',
    description: 'pdf预览图,只有pdf格式才会返回',
  })
    preview?: string;

  @ApiPropertyOptional({
    type: String,
    example: '***',
    description: '附件访问路径',
  })
    url: string;
}
