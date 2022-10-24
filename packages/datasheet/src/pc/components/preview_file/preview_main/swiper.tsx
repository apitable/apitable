import { IAttachmentValue, IUserInfo } from '@apitable/core';
import { FC, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { ITransFormInfo } from '../preview_file.interface';
import { PreviewType } from '../preview_type';
import { MAX_SCALE, MIN_SCALE } from './constant';
import styles from './style.module.less';

interface ISwiperProps {
  transformInfo: ITransFormInfo;
  activeIndex: number;
  clientWidth: number;
  next(e: React.MouseEvent | React.TouchEvent): void;
  prev(e: React.MouseEvent | React.TouchEvent): void;
  files: IAttachmentValue[];
  userInfo: IUserInfo | null;
  spaceId?: string;
  onClose: () => void;
  officePreviewEnable: boolean;
  previewUrl: string | null;
  setTransformInfo: (transformInfo: ITransFormInfo) => void;
  readonly?: boolean;
  disabledDownload: boolean;
}

interface ITouchPosition {
  pageX: number;
}

export const Swiper: FC<ISwiperProps> = props => {
  const {
    transformInfo,
    activeIndex,
    clientWidth,
    next,
    prev,
    files,
    userInfo,
    spaceId,
    onClose,
    officePreviewEnable,
    previewUrl,
    setTransformInfo,
    disabledDownload,
  } = props;

  const [translate, setTranslate] = useState(0);
  const fileThumbRef = useRef<HTMLDivElement>(null);
  const touchPositionRef = useRef<ITouchPosition | null>(null);

  useEffect(() => {
    setTranslate(activeIndex * fileThumbRef.current!.clientWidth);
  }, [activeIndex, clientWidth]);

  useEffect(() => {
    setTimeout(() => {
      // 默认第一次预览，不添加过度动画，之后的操作才进行过度
      fileThumbRef.current?.classList.add(styles.transition);
    });
  }, []);

  /****** 双指缩放图片逻辑 ******/
  const [scaling, setScaling] = useState(false);
  const [originScale, setOriginScale] = useState(1);
  const [originDist, setOriginDist] = useState(0);

  const [originPos, setOriginPos] = useState({ x: 0, y: 0 });
  const [originTranslate, setOriginTranslate] = useState({ x: 0, y: 0 });

  // 计算双指距离
  function getDist(touches: React.TouchList) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const scaleHandler = {
    onTouchStart(e: React.TouchEvent) {
      const touches = e.touches;
      if (touches.length !== 2) return;

      if (!scaling) {
        setScaling(true);
        setOriginScale(transformInfo.scale);
        setOriginTranslate({
          x: transformInfo.translatePosition.x,
          y: transformInfo.translatePosition.y,
        });
        setOriginPos({
          x: touches[0].clientX,
          y: touches[0].clientY,
        });
      }
      setOriginDist(getDist(touches));
    },
    onTouchMove(e: React.TouchEvent) {
      const touches = e.touches;
      if (touches.length !== 2) return;
      const dist = getDist(touches);

      const dScale = dist / originDist;
      let newScale = originScale * dScale;
      if (newScale > MAX_SCALE) newScale = MAX_SCALE;
      else if (newScale < MIN_SCALE) newScale = MIN_SCALE;

      const newX = originTranslate.x + (touches[0].clientX - originPos.x);
      const newY = originTranslate.y + (touches[0].clientY - originPos.y);

      setTransformInfo({
        ...transformInfo,
        scale: newScale,
        translatePosition: { x: newX * dScale, y: newY * dScale },
      });
    },
    onTouchEnd(e: React.TouchEvent) {
      const touches = e.touches;
      if (touches.length === 0) {
        setScaling(false);
      }
    },
  };
  /****** end ******/

  const prevOrNextHandler = {
    onTouchStart(e: React.TouchEvent) {
      touchPositionRef.current = {
        pageX: e.changedTouches[0].pageX,
      };
    },
    onTouchMove() {
      return;
    },
    onTouchEnd(e: React.TouchEvent) {
      if (!touchPositionRef.current) return;
      const diff = touchPositionRef.current.pageX - e.changedTouches[0].pageX;
      if (Math.abs(diff) < 10) return;
      if (diff < 0 && activeIndex > 0) {
        prev(e);
      }
      if (diff > 0 && activeIndex < files.length - 1) {
        next(e);
      }
      touchPositionRef.current = null;
    },
  };

  const mobileHandler = {
    onTouchStart(e: React.TouchEvent) {
      scaleHandler.onTouchStart(e);
      !scaling && prevOrNextHandler.onTouchStart(e);
    },
    onTouchMove(e: React.TouchEvent) {
      scaleHandler.onTouchMove(e);
      prevOrNextHandler.onTouchMove();
    },
    onTouchEnd(e: React.TouchEvent) {
      scaleHandler.onTouchEnd(e);
      !scaling && prevOrNextHandler.onTouchEnd(e);
    },
  };

  return (
    <div
      className={styles.swiper}
      style={{
        transform: `translateX(-${translate}px)`,
      }}
      ref={fileThumbRef}
    >
      {files.map((file, index) => {
        return (
          <div
            // lookup 中可能会存在同样的附件id
            key={file.id + index}
            className={styles.swiperItem}
            draggable={false}
            {...mobileHandler}
            onContextMenu={e => {
              if (disabledDownload) {
                e.preventDefault();
                return false;
              }
              return true;
            }}
          >
            {index === activeIndex && (
              <PreviewType
                file={file}
                transformInfo={transformInfo}
                userInfo={userInfo}
                spaceId={spaceId}
                onClose={onClose}
                officePreviewEnable={officePreviewEnable}
                previewUrl={previewUrl}
                setTransformInfo={setTransformInfo}
                disabledDownload={disabledDownload}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
