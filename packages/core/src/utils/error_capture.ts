import { ErrorCode, ErrorType } from 'types';
import { Strings, t } from 'i18n';
import { StatusCode } from 'config';

export const errorCapture = <T extends { event: { onError?(e: any): void } }>() => {
  return (target: T, name: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;

    return {
      configurable: true,

      get(this: T) {
        const boundFn = fn.bind(this);
        Reflect.defineProperty(this, name, {
          value: boundFn,
          configurable: true,
          writable: true,
        });
        const i18nMessage = (code: number, message: string) => {
          switch (code) {
            case 50000:
              return t(Strings.socket_error_server);
            case 50001:
              return t(Strings.socket_error_network);
            case StatusCode.FRONT_VERSION_ERROR:
              return t(Strings.front_version_error_desc);
          }
          return message;
        };

        const onError = (e: any) => {
          const code = e.code || ErrorCode.CollaSyncError;
          this.event.onError && this.event.onError({
            ...e,
            type: ErrorType.CollaError,
            code: code,
            message: i18nMessage(code, e.message),
          });

          throw e;
        };

        return (...args) => {
          try {
            
            const promise = boundFn(...args);
            // 如果是一个 promise 需要监听 catch
            if (promise instanceof Promise) {
              promise.catch(e => {
                onError(e);
              });
            }
           
            return promise;
          } catch (e) {
            onError(e);
          }
        };
      },
    };
  };
};
