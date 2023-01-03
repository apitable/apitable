import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetRepository } from './repositories/widget.repository';
import { WidgetService } from './services/widget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WidgetRepository
    ]),
  ],
  providers: [WidgetService],
  controllers: [],
  exports: [WidgetService],
})
export class WidgetModule {}
