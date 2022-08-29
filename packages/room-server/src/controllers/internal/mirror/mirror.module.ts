import { Module } from '@nestjs/common';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { MirrorServiceModule } from 'modules/services/mirror/mirror.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { MirrorController } from './mirror.controller';

@Module({
  imports: [
    UserServiceModule, 
    NodeServiceModule,
    MirrorServiceModule,
    DatasheetServiceModule,
  ],
  controllers: [MirrorController],
})
export class MirrorModule {}