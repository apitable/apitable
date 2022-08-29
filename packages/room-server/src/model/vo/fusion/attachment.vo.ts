import { ApiResponse } from '../../api.response';
import { ApiProperty } from '@nestjs/swagger';
import { AttachmentDto } from '../../dto/attachment/attachment.dto';

export class AttachmentVo extends ApiResponse<AttachmentDto> {
  @ApiProperty({ type: AttachmentDto })
    data: AttachmentDto;
}
