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
import { AttachmentDto } from 'database/attachment/dtos/attachment.dto';
import { ApiResponse } from './api.response';

export class AttachmentVo extends ApiResponse<AttachmentDto> {
  @ApiProperty({ type: AttachmentDto })
  override data!: AttachmentDto;
}

export class AssetVo {

  @ApiProperty({ type: String, description: 'Resource name, file access relative path' })
  token!: string;

  @ApiProperty({ type: String, description: 'Upload request URL' })
  uploadUrl!: string;

  @ApiProperty({ type: String, description: 'Upload request method' })
  uploadRequestMethod!: string;

}

export class AssetResults {
  @ApiProperty({ type: AssetVo })
  results!: AssetVo[];
}

export class AssetView extends ApiResponse<AssetResults> {
  @ApiProperty({ type: AssetResults })
  override data!: AssetResults;
}