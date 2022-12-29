import { ApiProperty } from '@nestjs/swagger';

export class ActionTypeUpdateRo {
  @ApiProperty()
    name: string;

  @ApiProperty()
    description: string;

  @ApiProperty()
    inputJSONSchema: any;

  @ApiProperty()
    outputJSONSchema: any;

  @ApiProperty()
    endpoint: string;

  @ApiProperty()
    i18n: any;
}