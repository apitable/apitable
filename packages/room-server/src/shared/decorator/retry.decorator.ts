/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * fork : https://github.com/vcfvct/typescript-retry-decorator
 */
import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { get, omit, values } from 'lodash';
import { sleep } from 'shared/common';

/**
 * retryable decorator
 */
export function Retryable(options: IRetryOptions): Function {
  const logger = new Logger('RetryableDecorator');

  function canRetry(e: Error): boolean {
    if (options.doRetry && !options.doRetry(e)) {
      return false;
    }
    return !(options.value?.length && !options.value.some(errorType => e instanceof errorType));
  }

  async function retryAsync(fn: () => any, args: any[], maxAttempts: number, backOff?: number): Promise<any> {
    try {
      // @ts-ignore
      return await fn.apply(this, args);
    } catch (e) {
      if (--maxAttempts < 0 || !canRetry((e as Error))) {
        // Last exception, or exception that allows retries
        throw e;
      }

      const _captureContext = { tags: { exceptionType: 'retryException', remainNumber: maxAttempts }};
      const outLoggerTag = [];
      // Custom extended parameter reporting
      const sentryScopeContext = options?.sentryScopeContext;
      if (sentryScopeContext && (sentryScopeContext.hasOwnProperty('tags') || sentryScopeContext.hasOwnProperty('extra'))) {
        for (const sentryScopeContextKey in sentryScopeContext) {
          const sscOutResult: (string[] | { [key: string]: {} }) = sentryScopeContext[sentryScopeContextKey](args);
          if (Array.isArray(sscOutResult)) {
            // Get the value of args dynamically through expressions
            for (const path of sscOutResult) {
              _captureContext[sentryScopeContextKey] = {
                ..._captureContext[sentryScopeContextKey],
                [path]: get(args, path),
              };
            }
          } else {
            // Customized reporting of extended parameters
            _captureContext[sentryScopeContextKey] = { ..._captureContext[sentryScopeContextKey], ...sscOutResult };
          }
        }
      }

      // Output (logger) log custom tags
      outLoggerTag.push(...values(omit(_captureContext.tags, ['exceptionType', 'remainNumber'])));

      logger.error(`Execution method：'${fn.name}' exception，Remaining attempts：${maxAttempts} times。`, (e as Error)?.stack);
      Sentry.captureException(e, _captureContext);

      backOff && (await sleep(backOff));

      // calculate next time backoff retry time
      const newBackOff: number = backOff! * options.exponentialOption!.multiplier!;
      backOff = newBackOff > options.exponentialOption!.maxInterval! ? options.exponentialOption!.maxInterval : newBackOff;
      // @ts-ignore
      return retryAsync.apply(this, [fn, args, maxAttempts, backOff]);
    }
  }

  return function(_target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFn = descriptor.value;
    // set default parameters
    !options.backOff && (options.backOff = 1000);
    options.exponentialOption = {
      ...{ maxInterval: 6000, multiplier: 2 },
      ...options.exponentialOption,
    };

    descriptor.value = async function(...args: any[]) {
      try {
        return await retryAsync.apply(this, [originalFn, args, options.maxAttempts, options.backOff]);
      } catch (e) {
        const error = (e as Error);
        const msgPrefix = `、Retry execution method：'${propertyKey}'，Failed：${options.maxAttempts} times。`;
        error.message = error.message ? `${msgPrefix} OriginalError: ${error.message}` : msgPrefix;
        logger.error(error.message, error?.stack);
        if (!options.hasOwnProperty('callback')) {
          throw e;
        }
        return options.callback!();
      }
    };
    return descriptor;
  };
}

interface IRetryOptions {
  /**
   * Maximum number of attempts
   */
  maxAttempts: number;

  /**
   * Initial retreat time (retry time)
   */
  backOff?: number;

  exponentialOption?: {
    /**
     * Maximum interval
     */
    maxInterval?: number;
    /**
     * Incremental multiplier per retry
     */
    multiplier?: number
  };

  /**
   * Custom function judgment, whether to execute re
   */
  doRetry?: (e: any) => boolean;

  /**
   * Specify the exception to be retried
   */
  value?: ErrorConstructor[];

  /**
   * Report sentry extension parameters
   */
  sentryScopeContext?: {
    tags?: (args?: any[]) => string[] | { [key: string]: {} },
    extra?: (args?: any[]) => string[] | { [key: string]: {} }
  };

  /**
   * Customize the final failure return parameter.
   * Note ⚠️: if specified this parameter will not eventually throw an exception and will return the result of the function
   */
  callback?: () => any;
}