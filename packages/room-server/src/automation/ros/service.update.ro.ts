import { ApiProperty } from '@nestjs/swagger';

export class AutomationServiceUpdateRo {
  @ApiProperty({
    type: String,
    example: 'vika',
    description: 'service slug',
  })
    slug: string;

  @ApiProperty({
    type: String,
    example: 'apitable',
    description: 'service name',
  })
    name: string;

  @ApiProperty({
    type: String,
    example: 'https://xxxx',
    description: 'logo',
  })
    logo: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com',
    description: 'basic callback url',
  })
    baseUrl: string;

  @ApiProperty()
    i18n: any;
}