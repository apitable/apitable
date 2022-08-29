import { CronExpression } from '@nestjs/schedule';

export class HealthConstants {
  public static readonly HEAP_MEMORY_RATIO = parseInt(process.env.HEAP_MEMORY_RATIO, 10) || 100;
  public static readonly RSS_MEMORY_RATIO = parseInt(process.env.NODE_MEMORY_RATIO, 10) || 90;
  public static readonly HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://health-check-monitor.vika.cn';
  public static readonly NEST_HEALTH_CHECK_CRON_EXPRESSION = process.env.NEST_HEALTH_CHECK_CRON_EXPRESSION || CronExpression.EVERY_5_SECONDS;
  public static readonly NEST_HEALTH_CHECK_TIMEOUT = parseInt(process.env.NEST_HEALTH_CHECK_TIMEOUT, 10) || 1000;
}
