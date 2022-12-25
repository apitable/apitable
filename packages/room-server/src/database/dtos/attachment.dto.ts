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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AttachmentDto {
  @ApiProperty({
    type: String,
    example: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
    description: 'token, part of attachment access path',
  })
  token!: string;

  @ApiProperty({
    type: String,
    example: '9d4911932181f254433a86b05797f9a6.jpeg',
    description: "attachment's original name",
  })
  name!: string;

  @ApiProperty({
    type: Number,
    example: 7194,
    description: "attachment's size",
  })
  size!: number;

  @ApiProperty({
    type: Number,
    example: 479,
    description: "attachment's width",
  })
  width!: number;

  @ApiProperty({
    type: Number,
    example: 478,
    description: "attachment's height",
  })
  height!: number;

  @ApiProperty({
    type: String,
    example: 'image/jpeg',
    description: "attachment's mimeType",
  })
  mimeType!: string;

  @ApiPropertyOptional({
    type: String,
    example: '***',
    description: 'preview of pdf, only works for pdf',
  })
  @IsOptional()
  preview?: string;

  @ApiPropertyOptional({
    type: String,
    example: '***',
    description: "attachment's access path",
  })
  @IsOptional()
  url?: string;
}
