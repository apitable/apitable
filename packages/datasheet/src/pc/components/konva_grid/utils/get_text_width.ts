import LRU from 'lru-cache';
import { IWrapTextResultProps } from './interface';

const fontCache: { [key: string]: LRU<string, number> } = {};
export const textDataCache = new LRU<string, IWrapTextResultProps>(500);

export const getTextWidth = (ctx: CanvasRenderingContext2D, text: string, font: string) => {
  let width: number | undefined = 0;
  if (!text || typeof text !== 'string') {
    return width;
  }
  let cacheOfFont = fontCache[font];
  if (!cacheOfFont) {
    cacheOfFont = fontCache[font] = new LRU(500);
  }
  width = cacheOfFont.get(text);
  if (width == null) {
    width = ctx!.measureText(text).width;
    cacheOfFont.set(text, width);
  }

  return width;
};

export const getTextData = (text: string, font: string) => {
  if (!text || typeof text !== 'string') {
    return null;
  }
  return textDataCache.get(text);
};

export const setTextData = (text: string, font: string, textData: IWrapTextResultProps) => {
  let cacheOfFont = textDataCache[font];
  if (!cacheOfFont) {
    cacheOfFont = textDataCache[font] = new LRU(500);
  }
  cacheOfFont.set(text, textData);
};

