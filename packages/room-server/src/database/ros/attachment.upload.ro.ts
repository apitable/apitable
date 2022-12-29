import { ApiProperty } from '@nestjs/swagger';

export class AttachmentUploadRo {
  @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
