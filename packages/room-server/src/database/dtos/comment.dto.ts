import { ICommentMsg } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    type: Number,
    description: 'time of leaving a comment, timestamp',
  })
  createdAt: number;

  @ApiProperty({
    type: Number,
    description: 'time of editing a comment, timestamp',
  })
  updatedAt?: number;

  @ApiProperty({
    type: String,
    description: 'comment ID',
  })
  commentId: string;

  @ApiPropertyOptional({
    type: String,
    description: "comment creator's uuid",
    deprecated: true,
  })
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({
    type: String,
    description: "comment creator's unitId",
  })
  @IsOptional()
  unitId: string;

  @ApiProperty({
    type: Object,
    description: 'comment message',
  })
  commentMsg: ICommentMsg;

  @ApiPropertyOptional({
    type: Number,
    description: 'comment revision',
  })
  @IsOptional()
  revision?: number;
}
