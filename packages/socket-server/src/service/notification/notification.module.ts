import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
