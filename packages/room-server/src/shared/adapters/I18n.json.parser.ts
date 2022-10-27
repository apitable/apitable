import { Inject } from '@nestjs/common';
import { I18N_PARSER_OPTIONS, I18nJsonParserOptions, I18nParser, I18nTranslation } from 'nestjs-i18n';

export const DEFAULT_LANGUAGE = 'zh-CN';
export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE, 'en-US'];

export class I18nJsonParser extends I18nParser {
  constructor(
    @Inject(I18N_PARSER_OPTIONS)
    private options: I18nJsonParserOptions,
  ) {
    super();
  }

  languages(): Promise<string[]> {
    return Promise.resolve(SUPPORTED_LANGUAGES);
  }

  parse(): Promise<I18nTranslation> {
    return Promise.resolve(global['vika_i18n']);
  }

}
