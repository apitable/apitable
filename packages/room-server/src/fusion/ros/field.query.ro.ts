import { ApiPropertyOptional } from '@nestjs/swagger';

export class FieldQueryRo {
  @ApiPropertyOptional({
    type: String,
    required: false,
    example: 'viwG9l1VPD6nH',
    description:
      'The view Id, specifying the view, returns the fields in the same order as the view, hidden fields are not returned',
  })
  viewId: string;
}
