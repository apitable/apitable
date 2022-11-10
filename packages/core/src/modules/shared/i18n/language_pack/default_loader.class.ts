import { LanguagePackNotFoundError } from '../i18n.errors';
import { ILanguagePack, ILanguagePacks } from './packs.interface';
import { ILanguagePackerLoader } from './loader.interface';

/**
 * Default Language Packer loader, just pass the JSON data to constructor
 * 
 * You can custom the loader by implements ILanguagePackerLoader. 
 * 
 * Example Use case: dynamic load to reduce the download size.
 * 
 */
export class DefaultLanguagePackLoader implements ILanguagePackerLoader {
  private _languagePacks: ILanguagePacks;

  constructor(langPacks: ILanguagePacks) {
    this._languagePacks = langPacks;
  }

  public load(lang: string): ILanguagePack {
    const languagePack = this._languagePacks[lang];
    if (!languagePack) throw new LanguagePackNotFoundError('cannot find language pack: ' + lang);

    return languagePack;
  }
}
