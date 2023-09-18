/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import accept from 'attr-accept';
import { getCustomConfig } from 'config';
import type { IAttachmentValue } from 'types/field_types';
import urlcat from 'urlcat';

export enum CutMethod {
  UNCUT = '0', // scale proportionally without cropping
  CUT = '1', // Proportional scaling, center cropping
}

export interface IImageThumbOption {
  method?: CutMethod;
  w?: number;
  h?: number;
  size?: number; // passing in size is equivalent to specifying both w and h
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

  if(src.includes('?')){
    return [
      src,
      '&imageView2',
      getFileMethod(options),
      getFileSize(options),
      getFileFormat(options),
      getFileQuality(options),
    ].join('');
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
  if (!options || getCustomConfig()?.DISABLED_QINIU_COMPRESSION_PARAMS) {
    return src;
  }
  return getImageThumbSrcForQiniu(src, options);
}

declare const window: any;

export const getHostOfAttachment = (bucket: string, fileUrl?: string) => {
  if (typeof window != 'object') {
    return process.env[bucket.toUpperCase()] || process.env.OSS_HOST;
  }

  const origin = window.location.origin;

  if (bucket.toUpperCase() === 'QNY1') {
    const QNY1 = window.__initialization_data__?.envVars.QNY1;
    if (QNY1.includes('http')) {
      return QNY1;
    }
    if (fileUrl && startsWithIgnoreSlashPre(fileUrl, QNY1)) {
      return origin;
    }
    return urlcat(origin, QNY1 + '');
  }

  if (bucket.toUpperCase() === 'QNY2') {
    const QNY2 = window.__initialization_data__?.envVars.QNY2;
    return QNY2.includes('http') ? QNY2 : urlcat(origin, QNY2 + '');
  }

  const QNY3 = window.__initialization_data__?.envVars.QNY3;
  return QNY3.includes('http') ? QNY3 : urlcat(origin, QNY3 + '');
};

export function cellValueToImageSrc(
  cellValue: IAttachmentValue | undefined,
  options?: IImageSrcOption,
): string {
  if (!cellValue) return '';

  const { bucket, token, preview: previewToken, mimeType, name } = cellValue;

  if (!bucket) return '';

  const host = getHostOfAttachment(bucket);

  if (!host) return '';

  const { formatToJPG, isPreview } = options || {};
  const fileArgument = { name, type: mimeType };
  const originSrc = integrateCdnHost(token);
  const defaultSrc = getImageThumbSrc(originSrc, options);

  if (isPdf(fileArgument)) {
    if (isPreview && options && Object.keys(options).length >= 1) {
      return getImageThumbSrc(integrateCdnHost(previewToken!), options);
    }
    return originSrc;
  }

  if (isGif(fileArgument) || isWebp(fileArgument)) {
    // The caller is from Swiper and does not use slice parameters
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
): string => {
  if (!pathName) {
    return pathName;
  }
  // TODO: delete this. Compatible with old version data
  if (pathName.startsWith('http')) {
    return pathName;
  }
  const host: string = getHostOfAttachment('QNY1', pathName);
  return urlcat(host, pathName);
};

function startsWithIgnoreSlashPre(str: string, prefix: string): boolean {
  if (str.startsWith(prefix)) {
    return true;
  }
  return removeSlashPrefix(str).startsWith(removeSlashPrefix(prefix));
}

function removeSlashPrefix(str: string): string {
  return str.startsWith('/') ? str.substring(1, str.length) : str;
}
