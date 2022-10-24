import { ApiProperty } from '@nestjs/swagger';
import { IUserValue } from '@apitable/core';

export class UnitBaseInfoDto implements IUserValue {
  @ApiProperty({
    type: String,
    example: 0,
    description: '组织单元ID',
  })
    unitId: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: '组织单元名称',
  })
    name: string;

  /**
   * @deprecated
   */
  @ApiProperty({
    type: String,
    example: 0,
    description: '用户uuID',
  })
    uuid: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: '用户uuID',
  })
    userId: string;

  @ApiProperty({
    type: Number,
    example: '类型(1:部门,2:标签,3:成员)',
    description: '成员姓名',
  })
    type: number;

  @ApiProperty({
    type: String,
    example: 'avatar',
    description: '头像',
  })
    avatar: string;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: '是否激活',
  })
    isActive: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: '是否删除',
  })
    isDeleted: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: '用户（user）是否修改过昵称',
  })
    isNickNameModified: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: '企微成员（member）是否修改过昵称',
  })
    isMemberNameModified: boolean;

}
