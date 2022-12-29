interface IConfigLang {
  zh: string;
  en: string;
}

const pattern = /\{.+?\}/g;

export const t = (obj: IConfigLang, lang, values?: any[]) => {
  const str = obj[lang || 'zh'] as string;
  if (!values) {
    return str;
  }
  const matches = str.match(pattern);
  if (!matches || matches.length !== values.length) {
    console.error('cannot match i18n text');
    return str;
  }
  let res = str;
  for (let i = 0; i < matches.length; i++) {
    res = res.replace(matches[i], values[i]);
  }
  return res;
};