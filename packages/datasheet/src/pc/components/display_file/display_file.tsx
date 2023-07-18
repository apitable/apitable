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

import { CollaCommandName, CutMethod, IAttachmentValue, IField, isGif } from '@apitable/core';
import classNames from 'classnames';
import Image from 'next/image';
import { usePlatform } from 'pc/hooks/use_platform';
import { resourceService } from 'pc/resource_service';
import { getCellValueThumbSrc, showOriginImageThumbnail } from 'pc/utils';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { expandPreviewModal } from '../preview_file';
import styles from './style.module.less';

interface IDisplayFileProps {
  index: number;
  field: IField;
  fileList: IAttachmentValue[];
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  imageStyle?: React.CSSProperties;
  cutImage?: boolean;
  setPreviewIndex?(index: number): void;
  datasheetId?: string;
  recordId: string;
  editable: boolean;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  disabledDownload?: boolean;
}

const DisplayFileBase: React.FC<React.PropsWithChildren<IDisplayFileProps>> = props => {
  const {
    fileList,
    index,
    width,
    imageStyle,
    className,
    height,
    cutImage,
    style,
    setPreviewIndex,
    datasheetId,
    recordId,
    field,
    editable,
    onSave,
    disabledDownload
  } = props;
  const PIXEL_RATIO = window.devicePixelRatio || 1;
  const lastIndex = fileList.length - 1;
  const activeIndex = index > lastIndex ? lastIndex : index;
  const curFile = fileList[activeIndex];
  const { mobile } = usePlatform();

  const onChange = (value: IAttachmentValue[]) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: [{
        recordId: recordId,
        fieldId: field.id,
        value,
      }],
    });
  };

  const _isGif = isGif({ name: curFile.name, type: curFile.mimeType });
  const imgSrc = getCellValueThumbSrc(
    curFile, {
      size: (width || 0) * PIXEL_RATIO,
      method: cutImage ? CutMethod.CUT : CutMethod.UNCUT,
      formatToJPG: _isGif,
    });

  return (
    <div
      style={{ height: '100%', ...style }}
      className={classNames(styles.displayFile, className)}
      onClick={() => {
        expandPreviewModal({
          datasheetId,
          recordId,
          fieldId: field?.id,
          activeIndex,
          cellValue: fileList,
          editable,
          onChange: onSave || onChange,
          disabledDownload: Boolean(disabledDownload)
        });
        setPreviewIndex && setPreviewIndex(activeIndex);
      }}
    >
      {
        showOriginImageThumbnail(curFile) ? (
          <div
            className={classNames(_isGif && styles.gif, styles.imageWrapper)}
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: !width ? '100%' : width,
              height: !height ? '100%' : height,
              ...imageStyle,
            }}
          >
            <Image src={imgSrc} layout={'fill'} objectFit={'cover'} alt="" />
          </div>
        ) : (
          <span
            style={{
              maxWidth: '100%',
              width: mobile ? undefined : 80
            }}
            className={styles.imgWrapper}
          >
            <Image
              src={imgSrc}
              alt='attachment'
              layout={'fill'}
              objectFit={'contain'}
            />
          </span>

        )
      }
    </div>
  );
};

export const DisplayFile = React.memo(DisplayFileBase, shallowEqual);
