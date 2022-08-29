import { ApiProperty } from '@nestjs/swagger';

export class AutomationServiceCreateRo {
  @ApiProperty({
    type: String,
    required: true,
    example: 'vika',
    description: '服务 slug',
  })
    slug: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '维格表',
    description: '名字',
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
    example: 'asvxxxxxx',
    description: '调用基础地址',
  })
    baseUrl: string;
}