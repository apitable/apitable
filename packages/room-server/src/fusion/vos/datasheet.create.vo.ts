import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api.response';

export class FieldCreateDto {

  @ApiProperty({ type: String, description: 'Field Id' })
  id: string;

  @ApiProperty({ type: String, description: 'Field Name' })
  name: string;

}

export class DatasheetCreateDto {

  @ApiProperty({ type: String, description: 'Datasheet Id' })
  id: string;

  @ApiProperty({ type: Number, description: 'Create Timestamp' })
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