import { Provider } from '@nestjs/common';
import { Configuration } from 'log4js';
import { LOG4JS_OPTION } from '../../constants/log4js.constants';

export function createOptionProvider(options?: Configuration | string): Provider {
  return {
    provide: LOG4JS_OPTION,
    useFactory() {
      return options;
    },
  };
}
