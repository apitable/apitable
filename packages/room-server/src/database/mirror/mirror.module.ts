import { Module } from '@nestjs/common';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { NodeModule } from 'database/node/node.module';
import { ResourceModule } from 'database/resource/resource.module';
import { SubscriptionDynamicModule } from 'database/subscription/subscription.dynamic.module';
import { MirrorController } from './controllers/mirror.controller';
import { MirrorService } from './services/mirror.service';

@Module({
  imports: [
    ResourceModule, 
    NodeModule, 
    DatasheetModule,
    SubscriptionDynamicModule.forRoot(),
  ],
  providers: [MirrorService],
  controllers: [MirrorController],
  exports: [MirrorService],
})
export class MirrorModule {}
