import { Module } from '@nestjs/common';
import { DatasheetServiceModule } from './datasheet.service.module';
import { MirrorServiceModule } from './mirror.service.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { MirrorController } from '../controllers/mirror.controller';

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