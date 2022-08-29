import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';
import { ipAddress } from 'src/common/helper';
import { HealthConstants } from 'src/constants/health.constants';
import * as os from 'os';

@Injectable()
export class LocalHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isRedisHealthy(): Promise<HealthIndicatorResult> {
    const redisStatus = this.redisService.getStatus();
    const isHealthy = redisStatus !== 'end';
    const result = this.getStatus('redis', isHealthy, { redisStatus });
    if (isHealthy) {
      return result;
    } else {
      throw new HealthCheckError('redis down', result);
    }
  }

  async checkMemory() {
    // 获取当前Node内存堆栈情况
    const { rss, heapUsed, heapTotal } = process.memoryUsage();
    // 获取系统总内存
    const sysTotal = os.totalmem();
    const rssRatio = Number((rss / sysTotal).toFixed(2));
    const heapUsedRatio = Number((heapUsed / heapTotal).toFixed(2));
    const isRssHealthy = rssRatio * 100 < HealthConstants.RSS_MEMORY_RATIO;
    const isHeapHealthy = heapUsedRatio * 100 < HealthConstants.HEAP_MEMORY_RATIO;
    const result = this.getStatus('memory', isRssHealthy && isHeapHealthy, {
      rss: { rssRatio, rss, sysTotal, status: isRssHealthy ? 'up' : 'down' },
      heap: {
        heapUsedRatio,
        heapUsed,
        heapTotal,
        status: isHeapHealthy ? 'up' : 'down',
      },
    });
    if (isRssHealthy && isHeapHealthy) {
      return result;
    } else {
      throw new HealthCheckError('memory', result);
    }
  }

  /**
   * 返回服务信息节点
   * @param
   * @return
   * @author Zoe Zheng
   * @date 2020/6/12 2:14 下午
   */
  async serverInfo() {
    return this.getStatus('server', true, {
      name: `socket-server/${ipAddress()}`,
    });
  }
}
