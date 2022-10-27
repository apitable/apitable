import { Module } from '@nestjs/common';
import { AttachmentModule } from './_modules/attachment.module';
import { DatasheetServiceModule } from './_modules/datasheet.service.module';
import { NodeServiceModule } from './_modules/node.service.module';
import { UserServiceModule } from './_modules/user.service.module';
import { AttachmentController } from './controllers/attachment.controller';
import { DatasheetController } from './controllers/datasheet.controller';

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
