import { Global, Module, DynamicModule } from '@nestjs/common';
import { Configuration } from 'log4js';
import { createOptionProvider } from '../adapter/log4js/log4js.provider';
import { Log4js } from '../adapter/log4js/log4js';

Global();
@Module({
  providers: [Log4js, createOptionProvider()],
  exports: [Log4js],
})
export class Log4jsModule {
  static forRoot(options?: Configuration | string): DynamicModule {
    const optionProvider = createOptionProvider(options);
    return {
      module: Log4jsModule,
      providers: [Log4js, optionProvider],
      exports: [Log4js],
    };
  }
}
