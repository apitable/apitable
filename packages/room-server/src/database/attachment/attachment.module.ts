import { Module } from '@nestjs/common';
import { AttachmentController } from './controllers/attachment.controller';
import { AttachmentService } from './services/attachment.service';

@Module({
  imports: [],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
