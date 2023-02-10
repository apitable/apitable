/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ApiProperty } from '@nestjs/swagger';
import { ChangesetBaseDto } from 'database/datasheet/dtos/changeset.base.dto';
import { CommentDto } from 'database/datasheet/dtos/comment.dto';
import { CommentReplyDto } from 'database/datasheet/dtos/comment.reply.dto';
import { CommentEmojiDto } from './comment.emoji.dto';
import { UnitInfoDto } from '../../../unit/dtos/unit.info.dto';

export class RecordHistoryDto {
  @ApiProperty({
    type: [ChangesetBaseDto],
    description: 'changeset list',
  })
  changesets!: ChangesetBaseDto[];

  @ApiProperty({
    type: [CommentDto],
    description: 'comment involved units\'s list',
  })
  units!: UnitInfoDto[];

  @ApiProperty({
    type: [CommentEmojiDto],
    description: 'comment\'s emojis',
  })
  emojis!: CommentEmojiDto;

  @ApiProperty({
    type: [CommentReplyDto],
    description: 'comment\'s quote information',
  })
  commentReplyMap!: CommentReplyDto;
}

