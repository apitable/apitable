import { IAttachmentValue, isGif } from '@vikadata/core';
import React, { CSSProperties } from 'react';
import { AttachmentDiv, AttachmentWrapperStyled } from './styled';
import { getCellValueThumbSrc, showOriginImageThumbnail } from './utils/file_type';
import { Tooltip } from '@vikadata/components';

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