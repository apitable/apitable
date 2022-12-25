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

import { IAttachmentValue, isGif } from '@apitable/core';
import React, { CSSProperties } from 'react';
import { AttachmentDiv, AttachmentWrapperStyled } from './styled';
import { getCellValueThumbSrc, showOriginImageThumbnail } from './utils/file_type';
import { Tooltip } from '@apitable/components';

interface ICellAttachment {
  files: IAttachmentValue[] | null;
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}

const HEIGHT = 24;

function calcFileWidth(file: IAttachmentValue, ratioHeight: number) {
  if (!(file.width && file.height)) {
    return 'auto';
  }
  if (!showOriginImageThumbnail(file)) {
    return 'auto';
  }
  const ratio = file.width / file.height;
  return ratioHeight * ratio;
}

export const CellAttachment = (props: ICellAttachment) => {
  const { files, className, style, cellClassName, cellStyle } = props;
  if (!files) {
    return null;
  }
  return (
    <AttachmentWrapperStyled className={className} style={style}>
      {files.map((file, index) => {
        const imgUrl = getCellValueThumbSrc(file, {
          h: HEIGHT,
          formatToJPG: isGif({ name: file.name, type: file.mimeType }),
        });
        return (
          <Tooltip content={file.name} key={file.id + index}>
            <AttachmentDiv className={cellClassName} style={cellStyle}>
              <img
                src={imgUrl}
                width={calcFileWidth(file, HEIGHT)}
                height={HEIGHT}
              />
            </AttachmentDiv>
          </Tooltip>
        );
      })}
    </AttachmentWrapperStyled>
  );
};