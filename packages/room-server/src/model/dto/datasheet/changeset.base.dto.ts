import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IOperation, IRemoteChangeset, ResourceType } from '@apitable/core';

export class ChangesetBaseDto implements IRemoteChangeset {
  @ApiProperty({
    type: String,
    description: 'changeset请求的唯一标识，用于保证changeset的唯一',
  })
    messageId: string;

  @ApiProperty({
    enum: ResourceType,
    description: 'changeset来源',
  })
    resourceType: ResourceType;

  @ApiProperty({
    type: String,
    description: 'changeset来源ID',
  })
    resourceId: string;

  @ApiProperty({
    type: Number,
    description: '版本号',
  })
    revision: number;

  @ApiProperty({
    isArray: true,
    type: Object,
    description: '操作action的合集',
  })
    operations: IOperation[];

  @ApiPropertyOptional({
    type: String,
    description: '用户userId',
  })
    createdBy?: string;

  @ApiProperty({
    type: String,
    description: '用户uuid',
  })
    userId: string;

  @ApiProperty({
    type: Number,
    description: 'changeset来源0:user_interface,1:openapi,2:relation_effect',
  })
    sourceType?: number;

  @ApiProperty({
    description: '创建时间-时间戳',
    type: Number,
  })
    createdAt: number;

  @ApiProperty({
    description: '是否是评论',
    type: Number,
  })
    isComment: number;

  @ApiProperty({
    description: '临时保存正确时间的字段',
    type: Number,
  })
    tmpCreatedAt?: number;

}
