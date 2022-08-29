import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICommentMsg } from '@vikadata/core';

export class CommentDto {
  @ApiProperty({
    type: Number,
    description: '评论创建时间,时间戳',
  })
    createdAt: number;

  @ApiProperty({
    type: Number,
    description: '评论修改时间,时间戳',
  })
    updatedAt?: number;

  @ApiProperty({
    type: String,
    description: '评论ID',
  })
    commentId: string;

  @ApiPropertyOptional({
    type: String,
    description: '评论创建用户的uuid(这里用法有点混淆，createdBy应该是uuid,但是实际上展示的是unitID)',
    deprecated: true,
  })
    createdBy?: string;

  @ApiPropertyOptional({
    type: String,
    description: '评论创建人的unitId',
  })
    unitId: string;

  @ApiProperty({
    type: Object,
    description: '评论具体内容',
  })
    commentMsg: ICommentMsg;

  @ApiPropertyOptional({
    type: Number,
    description: '评论版本号',
  })
    revision?: number;
}
