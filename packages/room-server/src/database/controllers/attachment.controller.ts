import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ResourceDataInterceptor } from 'shared/middleware/resource.data.interceptor';
import { AttachmentService } from 'database/services/attachment/attachment.service';

@Controller('nest/v1')

export class AttachmentController {
  constructor(
    private readonly attachService: AttachmentService,
  ) { }

  @Post('attach/getContentDisposition')
  @UseInterceptors(ResourceDataInterceptor)
  async getContentDisposition(@Body() data: { url: string }): Promise<string> {
    const response = await this.attachService.getContentDisposition(data.url);
    return response;
  }
}

