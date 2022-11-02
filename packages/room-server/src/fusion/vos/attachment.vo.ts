import { ApiProperty } from '@nestjs/swagger';
import { AttachmentDto } from 'database/dtos/attachment.dto';
import { ApiResponse } from './api.response';

export class AttachmentVo extends ApiResponse<AttachmentDto> {
  @ApiProperty({ type: AttachmentDto })
  data: AttachmentDto;
}

export class AssetVo {

  @ApiProperty({ type: String, description: 'Resource name, file access relative path' })
  token: string;

  @ApiProperty({ type: String, description: 'Upload request URL' })
  uploadUrl: string;

  @ApiProperty({ type: String, description: 'Upload request method' })
  uploadRequestMethod: string;

}

export class AssetResults {
  @ApiProperty({ type: AssetVo })
  results: AssetVo[];
}

export class AssetView extends ApiResponse<AssetResults> {
  @ApiProperty({ type: AssetResults })
  data: AssetResults;
}