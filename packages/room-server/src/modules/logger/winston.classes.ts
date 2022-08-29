import { Logger } from 'winston';
import { LoggerService } from '@nestjs/common';

/**
 * 实现Nestjs的LoggerService接口
 */
export class WinstonLogger implements LoggerService {
  private context?: string;

  constructor(private readonly logger: Logger) { }

  public setContext(context: string) {
    this.context = context;
  }

  public log(message: any, context?: string) {
    return this.logger.info(message, { context: context || this.context });
  }

  public error(message: any, trace?: string, context?: string): any {
    return this.logger.error(message, { trace, context: context || this.context });
  }

  public warn(message: any, context?: string): any {
    return this.logger.warn(message, { context: context || this.context });
  }

  public debug?(message: any, context?: string): any {
    return this.logger.debug(message, { context: context || this.context });
  }

  public verbose?(message: any, context?: string): any {
    return this.logger.verbose(message, { context: context || this.context });
  }
}
