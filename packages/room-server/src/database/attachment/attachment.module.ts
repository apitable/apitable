import { Module } from '@nestjs/common';
import { NodeModule } from 'database/node/node.module';
import { ResourceModule } from 'database/resource/resource.module';
import { AttachmentController } from './controllers/attachment.controller';
import { AttachmentService } from './services/attachment.service';

@Module({
  imports: [ResourceModule, NodeModule],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
