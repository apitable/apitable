import { I18N } from '../i18n.class';
import { LanguagePackNotFoundError, StringKeyError, StringNotFoundError } from '../i18n.errors';
import { ILanguagePacks } from '../language_pack/packs.interface';

const mockLanguagePacks: ILanguagePacks = {
  'en-US': {
    text1: 'This is text 1',
    text2: 'This is text 2'
  },
  'zh-CN': {
    text1: '这是中文1'
  }
};
describe('test i18n.class', () => {
  it('should get text ok', () => {

    const i18n = I18N.createByLanguagePacks(mockLanguagePacks);
    expect(i18n.getText('text1')).toBe('This is text 1');

    i18n.setLanguage('zh-CN');
    expect(i18n.getText('text1')).toBe('这是中文1');
    expect(() => i18n.getText('text2')).toThrow(StringNotFoundError);

    i18n.setLanguage('ja-JP');
    expect(() => i18n.getText('text2')).toThrow(LanguagePackNotFoundError);

    expect(() => i18n.getText('')).toThrow(StringKeyError);

    expect(i18n.language).toBe('ja-JP');

  });
});