import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from 'model/dto/datasheet/comment.dto';
import { UnitBaseInfoDto } from 'model/dto/unit/unit.base.info.dto';

export class CommentListVo {
  @ApiProperty({
    type: [CommentDto],
    description: '记录评论列表',
  })
    comments: CommentDto[];

  @ApiProperty({
    type: [CommentDto],
    description: '记录评论涉及到的组织单元列表',
  })
    units: UnitBaseInfoDto[];
}
