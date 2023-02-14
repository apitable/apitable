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

import { useRef } from 'react';
import * as React from 'react';
import { IPreviewTypeBase } from '../preview_type.interface';
import { cellValueToImageSrc, isWebp } from '@apitable/core';
import styles from './style.module.less';
import { FileType, getDownloadSrc, isSupportImage, renderFileIconUrl } from 'pc/utils/file_type';
import { browser } from 'modules/shared/browser';
import { NoSupport } from '../no_support';
import IconImg from 'static/icon/datasheet/attachment/attachment_ img_placeholder_filled.png'; // img
import { useEvents } from './hooks/use_events';
import { stopPropagation } from '@apitable/components';
import { MIN_SCALE } from '../../preview_main/constant';
import classNames from 'classnames';

export const PreviewImage: React.FC<React.PropsWithChildren<IPreviewTypeBase>> = props => {
  const { file, transformInfo, setTransformInfo, disabledDownload } = props;
  const { rotate, scale, translatePosition } = transformInfo;

  const fileLikeProps = { name: file.name, type: file.mimeType };

  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement;
    const { naturalWidth: width, naturalHeight: height } = target;

    const { offsetWidth, offsetHeight } = wrapperRef.current as HTMLDivElement;

    let initActualScale = 1,
        scale = 1;

    let translatePosition = {
      x: 0,
      y: 0,
    };

    if (width >= offsetWidth) {
      initActualScale = offsetWidth / width;
    }

    if (height >= offsetHeight) {
      initActualScale = offsetHeight / height;
    }

    // Initial rendering scaling exceeds lower limit
    if (initActualScale < MIN_SCALE) {
      if (width > height) {
        scale = MIN_SCALE / initActualScale;
      } else {
        if (target.width < 520) {
          scale = Math.min(520, offsetWidth) / target.width;
          const offset = (scale * target.height - target.height) / 2;
          translatePosition = {
            x: 0,
            y: offset,
          };
        } else {
          scale = MIN_SCALE / initActualScale;
        }
      }
    }

    setTransformInfo({
      ...transformInfo,
      initActualScale,
      scale,
      translatePosition,
    });
  };

  const transformWebpIfNeeded =
    isWebp(fileLikeProps) &&
    (browser?.satisfies({
      safari: '<14',
    }) ||
      browser?.is('iOS'));

  const isRotated = rotate % 180 !== 0;

  const { overflow } = useEvents({
    scale,
    isRotated,
    imageEle: imgRef.current!,
    wrapperEle: wrapperRef.current!,
    transformInfo,
    setTransformInfo,
  });

  if (!isSupportImage(file.mimeType)) {
    return (
      <NoSupport
        icon={<img src={IconImg.src} alt={file.name} draggable={false} className={styles.displayImg} />}
        disabledDownload={disabledDownload}
        downloadUrl={getDownloadSrc(file)}
        fileName={file.name}
        type={FileType.Image}
      />
    );
  }

  const src = !isSupportImage(file.mimeType)
    ? renderFileIconUrl(fileLikeProps).src
    : cellValueToImageSrc(file, transformWebpIfNeeded ? { formatToJPG: true } : undefined);

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.imgWrapper, styles.transition)}
      style={{
        transform: `translate3d(${translatePosition.x}px, ${translatePosition.y}px, 0)`,
      }}
      draggable={false}
    >
      <img
        onMouseDown={stopPropagation}
        onLoad={handleImageLoad}
        ref={imgRef}
        src={src as string}
        alt={file.name}
        draggable={false}
        className={classNames(styles.displayImg, styles.transition, {
          [styles.overflow]: overflow,
        })}
        style={{
          transform: `rotate(${rotate}deg) scale3d(${scale}, ${scale}, 1)`,
        }}
      />
    </div>
  );
};
