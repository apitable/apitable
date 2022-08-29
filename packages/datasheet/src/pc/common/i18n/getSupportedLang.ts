
type IOptions<T extends string> = {
  supportedLngs: T[],
  fallbackLng?: { [key: string]: T },
  defaultLng: T,
};
/**
 * 回退语言
 * @param code 语言标识符1
 * @param options 配置项
 * @param options.supportedLngs 支持语言的数组
 * @param options.fallbackLng 回退映射，可选。匹配过程若命中，直接返回其指向的语言
 * @param options.defaultLng 默认值，都没有匹配到，返回这个值
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
 * 返回一个支持的语言标识符
 * @param lang 语言标识符
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

