import { ApiProperty } from '@nestjs/swagger';
import { ICellValueMap } from '../../shared/interfaces';
import { IsDefined } from 'class-validator';
import { ApiTipIdEnum } from 'shared/enums/string.enum';

export class FieldUpdateRo {
  @ApiProperty({
    type: Object,
    required: true,
    description: '需要创建的的数据对应列和数据',
    example: {
      事项: '「组织架构」模块 Organization Module - 通讯录面板的组织架构展示',
      问题描述: '本质上和上面的需求是同一个',
      分类: '产品需求',
      评审日期: '2019-10-30T00:00:00.000Z',
    },
  })
  @IsDefined({ context: { tipId: ApiTipIdEnum.apiParamsInstanceError, property: 'records', value: 'fields' }})
    fields: ICellValueMap;

  @ApiProperty({
    type: String,
    required: true,
    description: '记录ID',
    example: 'recV3ElniQavTNyJG',
  })
  @IsDefined({ context: { tipId: ApiTipIdEnum.apiParamsInstanceError, property: 'records', value: 'recordId' }})
    recordId: string;
}
