import { ILanguagePack } from './packs.interface';

export interface ILanguagePackerLoader {
  load(language: string): ILanguagePack;
}