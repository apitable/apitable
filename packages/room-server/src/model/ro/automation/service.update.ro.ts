import { ApiProperty } from '@nestjs/swagger';

export class AutomationServiceUpdateRo {
  @ApiProperty({
    type: String,
    example: 'vika',
    description: '服务 slug',
  })
    slug: string;

  @ApiProperty({
    type: String,
    example: '维格表',
    description: '名字',
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
    example: 'asvxxxxxx',
    description: '调用基础地址',
  })
    baseUrl: string;

  @ApiProperty()
    i18n: any;
}