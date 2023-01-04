import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceModule } from 'database/resource/resource.module';
import { WidgetRepository } from './repositories/widget.repository';
import { WidgetService } from './services/widget.service';

@Module({
  imports: [
    forwardRef(()=>ResourceModule),
    TypeOrmModule.forFeature([
      WidgetRepository
    ]),
  ],
  providers: [WidgetService],
  controllers: [],
  exports: [WidgetService],
})
export class WidgetModule {}
