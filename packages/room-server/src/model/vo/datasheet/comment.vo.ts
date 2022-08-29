import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from 'model/api.response';
import { CommentDto } from 'model/dto/datasheet/comment.dto';
import { CommentListVo } from 'model/vo/datasheet/comment.list.vo';

export class CommentVo extends ApiResponse<CommentListVo> {
  @ApiProperty({
    type: [CommentDto],
    description: '记录评论列表',
  })
    data: CommentListVo;
}
