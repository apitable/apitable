import { HttpModule, Module } from '@nestjs/common';
import { NestService } from './nest.service';

@Module({
  imports: [HttpModule],
  providers: [NestService],
  exports: [NestService],
})
export class NestModule {}
