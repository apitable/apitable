import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RedisModule } from '../redis/redis.module';
import { GrpcClientModule } from 'src/grpc/client/grpc.client.module';

@Module({
  imports: [RedisModule, GrpcClientModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
