import { ApiProperty } from '@nestjs/swagger';
import { IUserValue } from '@apitable/core';

export class UnitBaseInfoDto implements IUserValue {
  @ApiProperty({
    type: String,
    example: 0,
    description: 'unit Id',
  })
    unitId: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: 'unit name',
  })
    name: string;

  /**
   * @deprecated
   */
  @ApiProperty({
    type: String,
    example: 0,
    description: 'user uuid',
  })
    uuid: string;

  @ApiProperty({
    type: String,
    example: 0,
    description: 'user ID',
  })
    userId: string;

  @ApiProperty({
    type: Number,
    example: '1: department, 2: tag, 3: member',
    description: 'member type',
  })
    type: number;

  @ApiProperty({
    type: String,
    example: 'avatar',
    description: 'avatar',
  })
    avatar: string;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'active status',
  })
    isActive: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'is it deleted',
  })
    isDeleted: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'if nick name was modified ever',
  })
    isNickNameModified: boolean;

  @ApiProperty({
    type: Boolean,
    example: 0,
    description: 'if nick name was modified ever by wecom member',
  })
    isMemberNameModified: boolean;

}
