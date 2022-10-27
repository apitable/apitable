import { ApiProperty } from '@nestjs/swagger';

export class TriggerTypeCreateRo {
  @ApiProperty()
    name: string;

  @ApiProperty()
    description: string;

  @ApiProperty()
    serviceId: string;

  @ApiProperty()
    inputJSONSchema: any;

  @ApiProperty()
    outputJSONSchema: any;

  @ApiProperty()
    endpoint: string;
}