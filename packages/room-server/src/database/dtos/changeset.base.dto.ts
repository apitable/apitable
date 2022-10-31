import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IOperation, IRemoteChangeset, ResourceType } from '@apitable/core';

export class ChangesetBaseDto implements IRemoteChangeset {
  @ApiProperty({
    type: String,
    description: 'changeset unique identification, works for making unique changeset',
  })
    messageId: string;

  @ApiProperty({
    enum: ResourceType,
    description: 'changeset resource type',
  })
    resourceType: ResourceType;

  @ApiProperty({
    type: String,
    description: 'changeset resource ID',
  })
    resourceId: string;

  @ApiProperty({
    type: Number,
    description: 'revision',
  })
    revision: number;

  @ApiProperty({
    isArray: true,
    type: Object,
    description: 'an array of operation actions',
  })
    operations: IOperation[];

  @ApiPropertyOptional({
    type: String,
    description: 'creator ID',
  })
    createdBy?: string;

  @ApiProperty({
    type: String,
    description: 'creator uuid',
  })
    userId: string;

  @ApiProperty({
    type: Number,
    description: 'changeset source type(0: user_interface,1: openapi, 2: relation_effect)',
  })
    sourceType?: number;

  @ApiProperty({
    description: 'created time-timestamp',
    type: Number,
  })
    createdAt: number;

  @ApiProperty({
    description: 'is it comment',
    type: Number,
  })
    isComment: number;

  @ApiProperty({
    description: 'temporary use for the exact time field',
    type: Number,
  })
    tmpCreatedAt?: number;

}
