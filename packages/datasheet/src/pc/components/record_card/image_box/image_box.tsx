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

import classNames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Field, IAttachmentValue, IField, Selectors, ViewType } from '@apitable/core';
import { DisplayFile } from 'pc/components/display_file';
import { useAllowDownloadAttachment } from 'pc/components/upload_modal/preview_item';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

export enum ImageShowType {
  Thumbnail = 'thumbnail',
  Marquee = 'marquee',
}

const SHOW_IMAGE_MAX_COUNT = 6;

interface IImageBoxProps {
  images: string[];
  showType?: ImageShowType;
  style?: React.CSSProperties;
  height?: number;
  width?: number;
  isCoverFit?: boolean;
  fileList: IAttachmentValue[];
  recordId: string;
  field: IField;
  showOneImage?: boolean;
}

export const ImageBox: React.FC<React.PropsWithChildren<IImageBoxProps>> = ({
  images,
  showType = ImageShowType.Thumbnail,
  style,
  width,
  fileList,
  height,
  recordId,
  field,
  showOneImage,
  isCoverFit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const permissions = useAppSelector((state) => Selectors.getPermissions(state));
  const currentView = useAppSelector(Selectors.getCurrentView);
  const isGalleryView = currentView!.type === ViewType.Gallery;
  const imgWidthDiff = isGalleryView ? 2 : 4;
  const datasheetId = useAppSelector((state) => state.pageParams.datasheetId);
  const allowDownload = useAllowDownloadAttachment(field.id, datasheetId);

  useEffect(() => {
    setCurrentIndex(0);
  }, [recordId]);

  const showImages = images.slice(0, showOneImage ? 1 : SHOW_IMAGE_MAX_COUNT);
  const marqueeWrapperWidth = showImages.length * 16 + 8;
  const imgWidth = Math.floor((width! - 200) / 6);
  const thumbHeight = (imgWidth * 4) / 3;
  const editable = Field.bindModel(field).recordEditable() && permissions.cellEditable;

  return (
    <div style={{ height }} className={styles.imageBox}>
      <DisplayFile
        fileList={fileList}
        index={currentIndex}
        style={{ border: 'none' }}
        imageStyle={{
          ...style,
          border: 'none',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
        height={height!}
        width={width! - imgWidthDiff}
        setPreviewIndex={setCurrentIndex}
        recordId={recordId}
        field={field}
        editable={editable}
        isCoverFit={isCoverFit}
        disabledDownload={!allowDownload}
      />
      <div className={styles.bottomWrapper} />
      {showImages.length > 1 && (
        <>
          {showType === ImageShowType.Thumbnail ? (
            <div className={styles.indexThumbnailWrapper}>
              {showImages.map((imgSrc, index) => (
                <span
                  key={index}
                  className={classNames(styles.thumbnailItem, {
                    [styles.activeThumb]: index === currentIndex,
                  })}
                  onMouseOver={() => {
                    setCurrentIndex(index);
                  }}
                  style={{
                    height: thumbHeight,
                    width: imgWidth,
                  }}
                >
                  <Image key={imgSrc + index} src={imgSrc} height={thumbHeight} width={imgWidth} alt="" />
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className={styles.indexMarqueeWrapper} style={{ width: marqueeWrapperWidth }}>
                {showImages.map((_imgSrc, index) => (
                  <div
                    key={index}
                    onMouseOver={() => setCurrentIndex(index)}
                    className={classNames(styles.marqueeItem, {
                      [styles.active]: index === currentIndex,
                    })}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
