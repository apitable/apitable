import { ApiResponse } from './api.response';
import { ApiProperty } from '@nestjs/swagger';

export class FieldCreateDto {

  @ApiProperty({ type: String, description: '字段ID' })
    id: string;

  @ApiProperty({ type: String, description: '字段名称' })
    name: string;

}

export class DatasheetCreateDto {

  @ApiProperty({ type: String, description: '表格ID' })
    id: string;

  @ApiProperty({ type: Number, description: '创建时间戳' })
    createdAt: number;

  @ApiProperty({ type: [FieldCreateDto] })
    fields: FieldCreateDto[];

}

export class DatasheetCreateVo extends ApiResponse<Object> {

  @ApiProperty({ type: DatasheetCreateDto })
    data: DatasheetCreateDto;

}

export class FieldCreateVo extends ApiResponse<Object> {

  @ApiProperty({ type: DatasheetCreateDto })
    data: FieldCreateDto;

}