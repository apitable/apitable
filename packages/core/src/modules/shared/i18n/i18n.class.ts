import { ILanguagePacks } from './language_pack/packs.interface';
import { template } from 'lodash';
import { LanguagePackNotFoundError, StringKeyError, StringNotFoundError } from './i18n.errors';
import { ILanguagePackerLoader } from './language_pack/loader.interface';
import { DefaultLanguagePackLoader } from './language_pack/default_loader.class';

const DEFAULT_LANG: string = 'en-US';

export class I18N {

  private _langPackLoader: ILanguagePackerLoader;
  private _language: string;

  /**
   * I18N factory that create a I18N object with static languages packs json data.
   * 
   * @param langPkgs 
   * @param defaultLang 
   * @returns 
   */
  static createByLanguagePacks(langPkgs: ILanguagePacks, defaultLang = DEFAULT_LANG): I18N {
    const loader = new DefaultLanguagePackLoader(langPkgs);
    return new I18N(loader, defaultLang);
  }
  static createByLoader(loader: ILanguagePackerLoader, defaultLang = DEFAULT_LANG) {
    return new I18N(loader, defaultLang);
  }

  private constructor(loader: ILanguagePackerLoader, defaultLang = DEFAULT_LANG) {
    this._langPackLoader = loader;
    this.setLanguage(defaultLang);
  }

  /**
   * set current language
   * 
   * @param language 
   */
  public setLanguage(language: string) {
    this._language = language;
  }

  /**
   * get current language
   */
  public get language() {
    return this._language;
  }

  /**
  * multi-language get, pass key as arguments
  * @param stringKey map the language pack json data 
  * @param options JavaScript Object,  support string format, support lodash _.template
  * @example i18n.getText('early_bird')
  */
  public getText(stringKey: string, options: any = null, isPlural = false): string {
    if (!stringKey) throw new StringKeyError('`stringKey` cannot be empty');

    const languagePack = this._langPackLoader.load(this._language);
    if (!languagePack) throw new LanguagePackNotFoundError('cannot find language: ' + this._language);

    const text = languagePack[stringKey];
    if (!text) throw new StringNotFoundError(`Cannot find string key: ${stringKey}`);

    const str = options ? template(text)(options) : text;
    if (isPlural) {
      return this.plural(str, false);
    }
    return str;
  }

  /*
  * Plural handlers, auto transform the string
  *
  * @Author: Kelly Peilin Chan (kelly@apitable.com)
  * @Date: 2020-03-12 14:17:51
  * @Last Modified by: Kelly Peilin Chan (kelly@apitable.com)
  * @Last Modified time: 2020-03-12 14:18:15
  */
  private plural(str: string, revert: boolean) {
    const plural = {
      '(quiz)$': '$1zes',
      '^(ox)$': '$1en',
      '([m|l])ouse$': '$1ice',
      '(matr|vert|ind)ix|ex$': '$1ices',
      '(x|ch|ss|sh)$': '$1es',
      '([^aeiouy]|qu)y$': '$1ies',
      '(hive)$': '$1s',
      '(?:([^f])fe|([lr])f)$': '$1$2ves',
      '(shea|lea|loa|thie)f$': '$1ves',
      sis$: 'ses',
      '([ti])um$': '$1a',
      '(tomat|potat|ech|her|vet)o$': '$1oes',
      '(bu)s$': '$1ses',
      '(alias)$': '$1es',
      '(octop)us$': '$1i',
      '(ax|test)is$': '$1es',
      '(us)$': '$1es',
      '([^s]+)$': '$1s',
    };

    const singular = {
      '(quiz)zes$': '$1',
      '(matr)ices$': '$1ix',
      '(vert|ind)ices$': '$1ex',
      '^(ox)en$': '$1',
      '(alias)es$': '$1',
      '(octop|vir)i$': '$1us',
      '(cris|ax|test)es$': '$1is',
      '(shoe)s$': '$1',
      '(o)es$': '$1',
      '(bus)es$': '$1',
      '([m|l])ice$': '$1ouse',
      '(x|ch|ss|sh)es$': '$1',
      '(m)ovies$': '$1ovie',
      '(s)eries$': '$1eries',
      '([^aeiouy]|qu)ies$': '$1y',
      '([lr])ves$': '$1f',
      '(tive)s$': '$1',
      '(hive)s$': '$1',
      '(li|wi|kni)ves$': '$1fe',
      '(shea|loa|lea|thie)ves$': '$1f',
      '(^analy)ses$': '$1sis',
      '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
      '([ti])a$': '$1um',
      '(n)ews$': '$1ews',
      '(h|bl)ouses$': '$1ouse',
      '(corpse)s$': '$1',
      '(us)es$': '$1',
      s$: '',
    };

    const irregular = {
      move: 'moves',
      foot: 'feet',
      goose: 'geese',
      sex: 'sexes',
      child: 'children',
      man: 'men',
      tooth: 'teeth',
      person: 'people',
    };

    const uncountable = ['sheep', 'fish', 'deer', 'moose', 'series', 'species', 'money', 'rice', 'information', 'equipment'];

    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(str.toLowerCase()) >= 0) {
      return str;
    }

    // check for irregular forms
    for (const word in irregular) {
      let pattern;
      let replace;
      if (revert) {
        pattern = new RegExp(irregular[word] + '$', 'i');
        replace = word;
      } else {
        pattern = new RegExp(word + '$', 'i');
        replace = irregular[word];
      }
      if (pattern.test(str)) {
        return str.replace(pattern, replace);
      }
    }

    let array;
    if (revert) {
      array = singular;
    } else {
      array = plural;
    }

    // check for matches using regular expressions
    for (const reg in array) {
      const pattern = new RegExp(reg, 'i');

      if (pattern.test(str)) {
        return str.replace(pattern, array[reg]);
      }
    }

    return str;
  }

}