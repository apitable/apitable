import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetRepository } from '../database/repositories/widget.repository';
import { WidgetService } from '../database/services/widget/widget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WidgetRepository,
    ]),
  ],
  providers: [
    WidgetService,
  ],
  exports: [
    WidgetService,
  ],
})

export class WidgetServiceModule { }
