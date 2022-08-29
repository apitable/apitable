import { Module } from '@nestjs/common';
import { AttachmentModule } from 'modules/services/attachment/attachment.module';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { AttachmentController } from './attachment.controller';
import { DatasheetController } from './datasheet.controller';

@Module({
  imports: [
    DatasheetServiceModule,
    UserServiceModule,
    NodeServiceModule,
    AttachmentModule,
  ],
  controllers: [DatasheetController, AttachmentController],
})
export class DatasheetModule {}
