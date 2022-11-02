import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';
import { ICellValueMap } from 'shared/interfaces';

export class FieldCreateRo {
  @ApiProperty({
    type: Object,
    required: true,
    description: 'The columns and data corresponding to the data to be created',
    example: { Currency: 5.53, Select: 'Select 1' },
  })
  @IsDefined({ context: { tipId: ApiTipIdEnum.apiParamsInstanceError, property: 'records', value: 'fields' } })
  fields: ICellValueMap;
}
