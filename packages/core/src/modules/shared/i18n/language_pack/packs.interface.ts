
export interface ILanguagePacks {
  [lang: string]: ILanguagePack
}

export interface ILanguagePack {
  [key: string]: string;
}