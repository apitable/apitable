import { Module } from '@nestjs/common';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { MirrorController } from './controllers/mirror.controller';
import { MirrorService } from './services/mirror.service';

@Module({
  imports: [DatasheetModule],
  providers: [MirrorService],
  controllers: [MirrorController],
  exports: [MirrorService],
})
export class MirrorModule {}
