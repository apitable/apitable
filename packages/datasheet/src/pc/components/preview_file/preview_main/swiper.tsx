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

import { FC, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { IAttachmentValue, IUserInfo } from '@apitable/core';
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

export const Swiper: FC<React.PropsWithChildren<ISwiperProps>> = (props) => {
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
      // By default, no transition animation is added for the first preview, and transition animation is performed only for subsequent operations
      fileThumbRef.current?.classList.add(styles.transition);
    });
  }, []);

  const [scaling, setScaling] = useState(false);
  const [originScale, setOriginScale] = useState(1);
  const [originDist, setOriginDist] = useState(0);

  const [originPos, setOriginPos] = useState({ x: 0, y: 0 });
  const [originTranslate, setOriginTranslate] = useState({ x: 0, y: 0 });

  // Calculate two-finger distance
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
            // The same attachment id may exist in lookup
            key={file.id + index}
            className={styles.swiperItem}
            draggable={false}
            {...mobileHandler}
            onContextMenu={(e) => {
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
