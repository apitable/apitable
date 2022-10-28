
type IOptions<T extends string> = {
  supportedLngs: T[],
  fallbackLng?: { [key: string]: T },
  defaultLng: T,
};
/**
 * Fallback language
 * @param code Language identifier 1
 * @param options Configuration items
 * @param options.supportedLngs Arrays of supported languages
 * @param options.fallbackLng Fallback mapping, optional. If the match process hits, it returns the language it refers to directly
 * @param options.defaultLng Default value, none matched, return this value
 * @example fallbackLang('zh-CN-Hans', { supportedLngs: ['zh-CN'], defaultLng: 'en-US' }) // => 'zh-CN'
 */
export const fallbackLang = <T extends string>(code: string, { supportedLngs, fallbackLng, defaultLng }: IOptions<T>) => {
  if (!code) return defaultLng;

  if (!fallbackLng) fallbackLng = {};
  const p = code.split('-');

  while (p.length > 0) {
    const subCode = p.join('-');
    if (supportedLngs.includes(subCode as T)) return subCode;
    if (subCode in fallbackLng) return fallbackLng[subCode];
    p.pop();
  }
  return defaultLng;
};

/**
 * Returns a supported language identifier
 * @param lang Language identifiers
 */
export const getSupportedLang = (lang: string) => {
  type ISupportedLngs= 'zh-CN' | 'en-US';

  return fallbackLang<ISupportedLngs>(
    lang,
    {
      supportedLngs: ['zh-CN', 'en-US'],
      fallbackLng: {
        zh: 'zh-CN',
        en: 'en-US'
      },
      defaultLng: 'en-US'
    }
  );
};

