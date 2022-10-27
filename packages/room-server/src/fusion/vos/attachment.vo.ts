import { ApiResponse } from './api.response';
import { ApiProperty } from '@nestjs/swagger';
import { AttachmentDto } from '../../database/dtos/attachment.dto';

export class AttachmentVo extends ApiResponse<AttachmentDto> {
  @ApiProperty({ type: AttachmentDto })
  data: AttachmentDto;
}

export class AssetVo {

  @ApiProperty({ type: String, description: '资源名，文件访问相对路径' })
  token: string;

  @ApiProperty({ type: String, description: '上传请求URL' })
  uploadUrl: string;

  @ApiProperty({ type: String, description: '上传请求方式' })
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