import { ApiProperty } from '@nestjs/swagger';

export class AutomationServiceCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'apitable',
    description: 'service slug, unique identifier',
  })
    slug: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'apitable',
    description: 'service name',
  })
    name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://xxxx',
    description: 'logo',
  })
    logo: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'https://example.com',
    description: 'basic callback url',
  })
    baseUrl: string;
}