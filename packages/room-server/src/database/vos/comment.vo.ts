import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../fusion/vos/api.response';
import { CommentDto } from '../dtos/comment.dto';
import { CommentListVo } from 'database/vos/comment.list.vo';

export class CommentVo extends ApiResponse<CommentListVo> {
  @ApiProperty({
    type: [CommentDto],
    description: '记录评论列表',
  })
    data: CommentListVo;
}
