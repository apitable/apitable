import { useRef } from 'react';
import * as React from 'react';
import { IPreviewTypeBase } from '../preview_type.interface';
import { cellValueToImageSrc, isWebp } from '@vikadata/core';
import styles from './style.module.less';
import { FileType, getDownloadSrc, isSupportImage, renderFileIconUrl } from 'pc/utils/file_type';
import { browser } from 'pc/common/browser';
import { NoSupport } from '../no_support';
import IconImg from 'static/icon/datasheet/attachment/attachment_ img_placeholder_filled.png'; // img
import { useEvents } from './hooks/use_events';
import { stopPropagation } from '@vikadata/components';
import { MIN_SCALE } from '../../preview_main/constant';
import classNames from 'classnames';

export const PreviewImage: React.FC<IPreviewTypeBase> = props => {
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

    // 初次渲染缩放比例超出下限
    if (initActualScale < MIN_SCALE) {
      if (width > height) {
        scale = MIN_SCALE / initActualScale;
      } else {
        // 长边是 height, 若小于 520 的宽度，则设为 520，优化预览体验
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
    (browser.satisfies({
      safari: '<14',
    }) ||
      browser.is('iOS'));

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
