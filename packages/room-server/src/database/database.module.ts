import { Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';
import { DatasheetServiceModule } from '../_modules/datasheet.service.module';
import { NodeServiceModule } from '../_modules/node.service.module';
import { UserServiceModule } from '../_modules/user.service.module';
import { AttachmentController } from './controllers/attachment.controller';
import { DatasheetController } from './controllers/datasheet.controller';

@Module({
  imports: [
  SharedModule,
  DatasheetServiceModule,
  UserServiceModule,
  NodeServiceModule,
  ],
  controllers: [DatasheetController, AttachmentController],
  })
export class DatabaseModule {}
