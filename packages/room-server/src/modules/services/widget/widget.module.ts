import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetRepository } from 'modules/repository/widget.repository';
import { WidgetService } from './widget.service';

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
