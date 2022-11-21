import { ApiTipConstant } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { ICellValueMap } from 'shared/interfaces';

export class FieldUpdateRo {
  @ApiProperty({
    type: Object,
    required: true,
    description: 'The columns and data corresponding to the data to be created',
    example: {
      Matter: '"Organizational Structure" module - Organizational structure display in the address book panel',
      'Problem Description': 'Essentially the same requirement as above',
      Select: 'Product Requirements',
      'Review Date': '2019-10-30T00:00:00.000Z',
    },
  })
  fields: ICellValueMap;

  @ApiProperty({
    type: String,
    required: true,
    description: 'record Id',
    example: 'recV3ElniQavTNyJG',
  })
  @IsDefined({ message: ApiTipConstant.api_params_instance_recordid_error })
  recordId: string;
}
