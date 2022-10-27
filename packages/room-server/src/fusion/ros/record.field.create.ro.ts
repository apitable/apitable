import { ApiProperty } from '@nestjs/swagger';
import { ICellValueMap } from '../../shared/interfaces';
import { IsDefined } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class FieldCreateRo {
  @ApiProperty({
    type: Object,
    required: true,
    description: '需要创建的的数据对应列和数据',
    example: { 货币: 5.53, 单选: '单选2' },
  })
  @IsDefined({ context: { tipId: ApiTipIdEnum.apiParamsInstanceError, property: 'records', value: 'fields' }})
    fields: ICellValueMap;
}
