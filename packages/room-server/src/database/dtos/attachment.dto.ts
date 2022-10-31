import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty({
    type: String,
    example: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
    description: 'token, part of attachment access path',
  })
    token: string;

  @ApiProperty({
    type: String,
    example: '9d4911932181f254433a86b05797f9a6.jpeg',
    description: 'attachment\'s original name',
  })
    name: string;

  @ApiProperty({
    type: Number,
    example: 7194,
    description: 'attachment\'s size',
  })
    size: number;

  @ApiProperty({
    type: Number,
    example: 479,
    description: 'attachment\'s width',
  })
    width: number;

  @ApiProperty({
    type: Number,
    example: 478,
    description: 'attachment\'s height',
  })
    height: number;

  @ApiProperty({
    type: String,
    example: 'image/jpeg',
    description: 'attachment\'s mimeType',
  })
    mimeType: string;

  @ApiPropertyOptional({
    type: String,
    example: '***',
    description: 'preview of pdf, only works for pdf',
  })
    preview?: string;

  @ApiPropertyOptional({
    type: String,
    example: '***',
    description: 'attachment\'s access path',
  })
    url: string;
}
