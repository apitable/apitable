import { ApiProperty } from '@nestjs/swagger';
import { ChangesetBaseDto } from 'database/dtos/changeset.base.dto';
import { CommentDto } from 'database/dtos/comment.dto';
import { UnitBaseInfoDto } from './unit.base.info.dto';
import { CommentEmojiDto } from './comment.emoji.dto';
import { CommentReplyDto } from 'database/dtos/comment.reply.dto';

export class RecordHistoryDto {
  @ApiProperty({
    type: [ChangesetBaseDto],
    description: 'changeset列表',
  })
    changesets: ChangesetBaseDto[];

  @ApiProperty({
    type: [CommentDto],
    description: '记录评论涉及到的组织单元列表',
  })
    units: UnitBaseInfoDto[];

  @ApiProperty({
    type: [CommentEmojiDto],
    description: '记录评论所有的点赞信息',
  })
    emojis: CommentEmojiDto;

  @ApiProperty({
    type: [CommentReplyDto],
    description: '记录评论引用的信息集合',
  })
    commentReplyMap: CommentReplyDto;
}

