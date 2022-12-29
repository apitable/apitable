import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from '../dtos/comment.dto';
import { UnitBaseInfoDto } from '../dtos/unit.base.info.dto';

export class CommentListVo {
  @ApiProperty({
    type: [CommentDto],
    description: 'record comment list',
  })
    comments: CommentDto[];

  @ApiProperty({
    type: [CommentDto],
    description: 'list of units involved in record comments',
  })
    units: UnitBaseInfoDto[];
}
