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

import { cellValueToImageSrc, IAttachmentValue, IImageSrcOption, isImage, isPdf, isWebp, Settings } from '@apitable/core';
import accept from 'attr-accept';
import Bowser from 'bowser';
import { isString } from 'lodash';
import mime from 'mime-types';
import IconZip from '../../../../static/compressed_placeholder.png'; // zip
import IconExcel from '../../../../static/excel_placeholder.png'; // excel
import IconOther from '../../../../static/other_placeholder.png'; // other
import IconPdf from '../../../../static/pdf_placeholder.png'; // pdf
import IconPpt from '../../../../static/ppt_placeholder.png'; // ppt
import IconImg from '../../../../static/small_placeholder_filled.png'; // img
import IconTxt from '../../../../static/text_placeholder.png'; // txt
import IconAudio from '../../../../static/video_placeholder.png'; // Multimedia
import IconWord from '../../../../static/word_placeholder.png'; // word icon

let _browser;

(() => {
  if (!process.env.SSR) {
    _browser = Bowser.getParser(window.navigator.userAgent);
    (window as any).bowser = _browser;
  }
})();
export const browser = _browser;

function byte2Mb(byte: number | undefined) {
  if (!byte) {
    return 0;
  }
  return parseFloat((byte / 1024 / 1024).toFixed(2));
}

export enum FileType {
  Other,
  Image,
  Doc,
  Pdf,
  Media,
  Zip,
  Txt,
}

export enum DocType {
  Word,
  Excel,
  PPT,
}

export const NO_SUPPORT_IMG_MIME_TYPE = [
  'image/vnd.adobe.photoshop',
  'image/tiff',
];

const WORD_MIME_TYPE = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  'application/vnd.ms-word.document.macroEnabled.12',
];

const PPT_MIME_TYPE = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.template',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  'application/vnd.ms-powerpoint.addin.macroEnabled.12',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  'application/vnd.ms-powerpoint.template.macroEnabled.12',
  'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
];

const EXCEL_MIME_TYPE = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.template.macroEnabled.12',
  'application/vnd.ms-excel.addin.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'text/csv',
];

export const DOC_MIME_TYPE = [
  ...WORD_MIME_TYPE,
  ...EXCEL_MIME_TYPE,
  ...PPT_MIME_TYPE,
];

const MEDIA_TYPE = ['audio/*', 'video/*'];

// ts suffix files are recognized as video/mp2t video format by default.
const INVALID_MEDIA_TYPE = ['video/mp2t'];

const ZIPPED_TYPE = [
  'application/zip',
  'application/x-7z-compressed',
  'application/x-rar-compressed',
];

interface IFileLikeProps {
  name: string;
  type: string;
}

export function isWhatFileType(file: IFileLikeProps) {
  const inferredType = mime.lookup(file.name);
  if (isImage(file)) {
    return FileType.Image;
  }
  if (isPdf(file)) {
    return FileType.Pdf;
  }
  if (accept(file, DOC_MIME_TYPE) || inferredType && DOC_MIME_TYPE.includes(inferredType)) {
    return FileType.Doc;
  }
  if (accept(file, MEDIA_TYPE) && inferredType && !INVALID_MEDIA_TYPE.includes(inferredType)) {
    return FileType.Media;
  }
  if (accept(file, ZIPPED_TYPE)) {
    return FileType.Zip;
  }
  if (accept(file, 'text/plain')) {
    return FileType.Txt;
  }
  return FileType.Other;
}

export function isDocType(file: IFileLikeProps) {
  const inferredType = mime.lookup(file.name);
  if (accept(file, WORD_MIME_TYPE) || inferredType && WORD_MIME_TYPE.includes(inferredType)) {
    return DocType.Word;
  }
  if (accept(file, PPT_MIME_TYPE) || inferredType && PPT_MIME_TYPE.includes(inferredType)) {
    return DocType.PPT;
  }
  if (accept(file, EXCEL_MIME_TYPE) || inferredType && EXCEL_MIME_TYPE.includes(inferredType)) {
    return DocType.Excel;
  }
  return '';
}

/**
 * copy from next /image

 */
type StaticImageData = string | {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

export function renderFileIconUrl(curFile: IFileLikeProps) {
  const file = renderFileIcon(curFile);
  return isString(file) ? file : file.src;
}

export function renderFileIcon(curFile: IFileLikeProps): StaticImageData {
  const type = isWhatFileType({ name: curFile.name, type: curFile.type });
  switch (type) {
    case FileType.Image: {
      return IconImg;
    }
    case FileType.Media: {
      return IconAudio;
    }
    case FileType.Doc: {
      const docType = isDocType(curFile);
      if (docType === DocType.Word) {
        return IconWord;
      }
      if (docType === DocType.Excel) {
        return IconExcel;
      }
      if (docType === DocType.PPT) {
        return IconPpt;
      }
      return IconOther;
    }
    case FileType.Pdf: {
      return IconPdf;
    }
    case FileType.Zip: {
      return IconZip;
    }
    case FileType.Txt: {
      return IconTxt;
    }
    case FileType.Other:
    default: {
      return IconOther;
    }
  }
}

export const imageSizeExceeded = (size: number) => {
  const MAX_FILE_SIZE = 20;
  return byte2Mb(size) >= MAX_FILE_SIZE;
};

/**
 * Whether to display thumbnails of the original image, e.g. not after the volume exceeds 20Mb.
 */
export const showOriginImageThumbnail = (file: IAttachmentValue) => {
  const fileArgument = { name: file.name, type: file.mimeType };
  return (
    (isPdf(fileArgument) && file.preview) ||
    (isImage(fileArgument) &&
      !imageSizeExceeded(file.size) &&
      isSupportImage(file.mimeType))
  );
};

export const isSupportImage = (mimeType: string) => {
  return !NO_SUPPORT_IMG_MIME_TYPE.includes(mimeType);
};

// Get a preview of the file.
// 1. Pictures, PDF Show pictures.
// 2. Other file types show the corresponding Icon.
export const getCellValueThumbSrc = (
  file: IAttachmentValue,
  option: IImageSrcOption
) => {
  let imgSrc = '';
  if (!file) {
    return imgSrc;
  }

  if (showOriginImageThumbnail(file)) {
    const transformWebpIfNeeded =
      (isWebp({ name: file.name, type: file.mimeType }) &&
        browser?.satisfies({
          safari: '<14',
        })) ||
      browser?.is('iOS');

    imgSrc = cellValueToImageSrc(file, {
      ...option,
      isPreview: true,
      formatToJPG: transformWebpIfNeeded ? true : option.formatToJPG,
    });
  } else {
    imgSrc = renderFileIconUrl({ name: file.name, type: file.mimeType });
  }
  return imgSrc;
};

export function getDownloadSrc(fileInfo: IAttachmentValue) {
  return `${Settings[fileInfo.bucket].value}${
    fileInfo.token
  }?attname=${encodeURIComponent(fileInfo.name)}`;
}

export function getAvInfoRequestUrl(fileInfo: IAttachmentValue) {
  return `${Settings[fileInfo.bucket].value}${fileInfo.token}?avinfo`;
}
