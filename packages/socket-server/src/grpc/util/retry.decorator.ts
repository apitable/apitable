/**
 * fork : https://github.com/vcfvct/typescript-retry-decorator
 */
import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { get, omit, values } from 'lodash';
import { sleep } from './utils';

/**
 * retryable decorator
 */
export function Retryable(options: RetryOptions): Function {
  const logger = new Logger('RetryableDecorator');

  function canRetry(e: Error): boolean {
    if (options.doRetry && !options.doRetry(e)) {
      return false;
    }
    return !(options.value?.length && !options.value.some(errorType => e instanceof errorType));
  }

  async function retryAsync(fn: Function, args: any[], maxAttempts: number, backOff?: number): Promise<any> {
    try {
      return await fn.apply(this, args);
    } catch (e) {
      if (--maxAttempts < 0 || !canRetry(e)) {
        // 最后一次异常，或者允许重试的异常
        throw e;
      }

      const _captureContext = { tags: { exceptionType: 'retryException', remainNumber: maxAttempts }};
      const outLoggerTag = [];
      // 自定义扩展参数上报
      const sentryScopeContext = options?.sentryScopeContext;
      if (sentryScopeContext && (sentryScopeContext.hasOwnProperty('tags') || sentryScopeContext.hasOwnProperty('extra'))) {
        for (const sentryScopeContextKey in sentryScopeContext) {
          const sscOutResult: (string[] | { [key: string]: {} }) = sentryScopeContext[sentryScopeContextKey](args);
          if (Array.isArray(sscOutResult)) {
            // 通过表达式动态获取args的值
            for (const path of sscOutResult) {
              _captureContext[sentryScopeContextKey] = {
                ..._captureContext[sentryScopeContextKey],
                [path]: get(args, path),
              };
            }
          } else {
            // 自定义上报扩展参数
            _captureContext[sentryScopeContextKey] = { ..._captureContext[sentryScopeContextKey], ...sscOutResult };
          }
        }
      }

      // 输出（logger）日志自定义标签
      outLoggerTag.push(...values(omit(_captureContext.tags, ['exceptionType', 'remainNumber'])));

      logger.error(`执行方法：'${fn.name}' 异常，剩余尝试：${maxAttempts}次。`, e?.stack);
      Sentry.captureException(e, _captureContext);

      backOff && (await sleep(backOff));

      // 计算下次，退避重试时间
      const newBackOff: number = backOff * options.exponentialOption.multiplier;
      backOff = newBackOff > options.exponentialOption.maxInterval ? options.exponentialOption.maxInterval : newBackOff;
      return retryAsync.apply(this, [fn, args, maxAttempts, backOff]);
    }
  }

  return function(target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFn: Function = descriptor.value;
    // 设置默认参数
    !options.backOff && (options.backOff = 1000);
    options.exponentialOption = {
      ...{ maxInterval: 6000, multiplier: 2 },
      ...options.exponentialOption,
    };

    descriptor.value = async function(...args: any[]) {
      try {
        return await retryAsync.apply(this, [originalFn, args, options.maxAttempts, options.backOff]);
      } catch (e) {
        const msgPrefix = `重试执行方法：'${propertyKey}'，失败：${options.maxAttempts}次。`;
        e.message = e.message ? `${msgPrefix} 原始错误: ${e.message}` : msgPrefix;
        logger.error(e.message, e?.stack);
        if (!options.hasOwnProperty('callback')) {
          throw e;
        }
        return options.callback();
      }
    };
    return descriptor;
  };
}

export interface RetryOptions {
  /**
   * 最大尝试次数
   */
  maxAttempts: number;
  /**
   * 初次退避时间（重试时间）
   */
  backOff?: number;
  /**
   * 配置
   */
  exponentialOption?: {
    /**
     * 最大间隔
     */
    maxInterval?: number;
    /**
     * 每次重试递增倍数
     */
    multiplier?: number
  };
  /**
   * 自定义函数判断，是否执行重新
   */
  doRetry?: (e: any) => boolean;
  /**
   * 指定需要重试的异常
   */
  value?: ErrorConstructor[];
  /**
   * 上报sentry扩展参数
   */
  sentryScopeContext?: {
    tags?: (args?: any[]) => string[] | { [key: string]: {} },
    extra?: (args?: any[]) => string[] | { [key: string]: {} }
  };
  /**
   * 自定义最终失败返回参数。
   * 注意⚠️：如果指定该参数最终不会抛出异常，会返回函数结果
   */
  callback?: () => any;
}