import { IAttachmentValue } from 'types/field_types';
import accept from 'attr-accept';
import { Settings } from 'config';
import urlcat from 'urlcat';

export enum CutMethod {
  UNCUT = '0', // 进行等比缩放，不裁剪
  CUT = '1', // 进行等比缩放，居中裁剪
}

export interface IImageThumbOption {
  method?: CutMethod;
  w?: number;
  h?: number;
  size?: number; // 传入 size 相当于同时指定 w 和 h
  format?: 'jpg';
  quality?: number;
}

export interface IImageSrcOption extends IImageThumbOption {
  formatToJPG?: boolean;
  isPreview?: boolean;
}

export function isPdf(file: { name: string; type: string }) {
  return accept(file, 'application/pdf');
}

export function isGif(file: { name: string; type: string }) {
  return accept(file, 'image/gif');
}

export function isWebp(file: { name: string; type: string }) {
  return accept(file, 'image/webp');
}

export function isImage(file: { name: string; type: string }) {
  return accept(file, 'image/*');
}

export function isSvg(file: { name: string; type: string }) {
  return accept(file, 'image/svg+xml');
}

function getFileMethod(option: IImageSrcOption) {
  if (!option.method) return '/0';
  return `/${option.method}`;
}

function getFileSize(option: IImageThumbOption) {
  const w = option.w ? option.w : option.size;
  const h = option.h ? option.h : option.size;
  //NOTE: w and h must be integer
  if (w && h) {
    return `/w/${Math.floor(w)}/h/${Math.floor(h)}`;
  }
  if (w) {
    return `/w/${Math.floor(w)}`;
  }
  if (h) {
    return `/h/${Math.floor(h)}`;
  }
  return '';
}

function getFileQuality(option: IImageThumbOption) {
  if (option && option.quality) {
    return `/q/${option.quality}!`;
  }
  return '';
}

function getFileFormat(options?: IImageThumbOption) {
  if (options && options.format === 'jpg') {
    return '/format/jpg';
  }
  return '';
}

function getImageThumbSrcForQiniu(src: string, options: IImageThumbOption) {
  if (!/^http/.test(src)) {
    src[0] !== '/' && (src = '/' + src);
  }

  return [
    src,
    '?imageView2',
    getFileMethod(options),
    getFileSize(options),
    getFileFormat(options),
    getFileQuality(options),
  ].join('');
}

export function getImageThumbSrc(src: string, options?: IImageThumbOption) {
  if (!options) {
    return src;
  }
  return getImageThumbSrcForQiniu(src, options);
}

declare const window: any;

export const getHostOfAttachment = (bucket: string) => {
  const origin = typeof window == 'object' ? window.location.origin : '';
  if (bucket.toUpperCase() === 'QNY1') {
    return typeof window == 'object' ? urlcat(origin, window.__initialization_data__?.envVars.NEXT_PUBLIC_QNY1 + '') :
      Settings[bucket].value as string;
  }
  return typeof window == 'object' ? urlcat(origin, window.__initialization_data__?.envVars.NEXT_PUBLIC_QNY2 + '') : Settings[bucket].value as string;
};

export function cellValueToImageSrc(
  cellValue: IAttachmentValue | undefined,
  options?: IImageSrcOption,
): string {
  if (!cellValue) return '';
  const { bucket, token, preview: previewToken, mimeType, name } = cellValue;
  const host = getHostOfAttachment(bucket);
  if (!host) return '';
  const { formatToJPG, isPreview } = options || {};
  const fileArgument = { name, type: mimeType };
  const originSrc = host + token;
  const defaultSrc = getImageThumbSrc(originSrc, options);

  if (isPdf(fileArgument)) {
    if (isPreview && options && Object.keys(options).length > 1) {
      return getImageThumbSrc(host + previewToken, options);
    }
    return originSrc;
  }

  if (isGif(fileArgument) || isWebp(fileArgument)) {
    // 调用方来自 Swiper，不使用切图参数
    if (options == null) {
      return originSrc;
    }

    return getImageThumbSrc(originSrc, {
      ...options,
      format: formatToJPG ? 'jpg' : undefined,
    });
  }

  if (isSvg(fileArgument)) {
    return originSrc;
  }

  return defaultSrc;
}

export const integrateCdnHost = (
  pathName: string,
  host: string = process.env.NEXT_PUBLIC_QNY1 || Settings.QNY1.value,
): string => {
  // TODO:删掉这里。兼容旧版本数据
  if (pathName.startsWith('http')) {
    return pathName;
  }
  return urlcat(host, pathName);
};
