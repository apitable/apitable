import { ApiProperty } from '@nestjs/swagger';
import { ChangesetBaseDto } from 'database/dtos/changeset.base.dto';
import { CommentDto } from 'database/dtos/comment.dto';
import { UnitBaseInfoDto } from './unit.base.info.dto';
import { CommentEmojiDto } from './comment.emoji.dto';
import { CommentReplyDto } from 'database/dtos/comment.reply.dto';

export class RecordHistoryDto {
  @ApiProperty({
    type: [ChangesetBaseDto],
    description: 'changeset list',
  })
    changesets: ChangesetBaseDto[];

  @ApiProperty({
    type: [CommentDto],
    description: 'comment involved units\'s list',
  })
    units: UnitBaseInfoDto[];

  @ApiProperty({
    type: [CommentEmojiDto],
    description: 'comment\'s emojis',
  })
    emojis: CommentEmojiDto;

  @ApiProperty({
    type: [CommentReplyDto],
    description: 'comment\'s quote information',
  })
    commentReplyMap: CommentReplyDto;
}

