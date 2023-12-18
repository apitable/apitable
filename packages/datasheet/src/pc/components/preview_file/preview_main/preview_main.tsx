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

import { useKeyPress } from 'ahooks';
import mime from 'mime-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { stopPropagation, useThemeColors } from '@apitable/components';
import { Api, IAttachmentValue, isImage, IUserInfo, IReduxState } from '@apitable/core';
import { RotateOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { DOC_MIME_TYPE, getDownloadSrc, isSupportImage, KeyCode } from 'pc/utils';
import NextFilled from 'static/icon/common/next_filled.svg';
import PreviousFilled from 'static/icon/common/previous_filled.svg';
import { Header } from '../mobile/header';
import { PreviewDisplayList } from '../preview_display_list';
import { ITransFormInfo } from '../preview_file.interface';
import useFrameSetState from '../preview_type/preview_image/hooks/use_frame_state';
import { ToolBar } from '../tool_bar';
import { initTransformInfo, initTranslatePosition, MAX_SCALE, MIN_SCALE } from './constant';
import { Swiper } from './swiper';
import { isFocusingInput } from './util';
import styles from './style.module.less';

interface IPreviewMain {
  activeIndex: number;
  files: IAttachmentValue[];
  setActiveIndex(index: number): void;
  onClose(): void;
  onDelete(): void;
  readonly: boolean;
  userInfo: IUserInfo | null;
  spaceId: string;
  officePreviewEnable: boolean;
  disabledDownload: boolean;
  isFullScreen: boolean;
  toggleIsFullScreen: () => void;
}

export const PreviewMain: React.FC<React.PropsWithChildren<IPreviewMain>> = (props) => {
  const {
    activeIndex,
    setActiveIndex,
    files,
    onClose,
    onDelete,
    readonly,
    userInfo,
    spaceId,
    officePreviewEnable,
    disabledDownload,
    isFullScreen,
    toggleIsFullScreen,
  } = props;
  const colors = useThemeColors();
  const { screenIsAtMost, clientWidth: _clientWidth } = useResponsive();
  const rightPaneWidth = useAppSelector((state: IReduxState) => state.rightPane.width);
  const isMobile = screenIsAtMost(ScreenSize.md);
  const clientWidth = typeof rightPaneWidth == 'number' && !isFullScreen ? _clientWidth - rightPaneWidth : _clientWidth;

  // The fileInfo instance currently being previewed
  const activeFile: IAttachmentValue = files[activeIndex];

  const [officePreviewUrl, setOfficePreviewUrl] = useState<string | null>(null);

  const [transformInfo, setTransformInfo] = useFrameSetState<ITransFormInfo>(initTransformInfo);

  const mimeType = useMemo(() => {
    const name2Type = mime.lookup(activeFile.name);
    if (typeof name2Type == 'string') {
      return name2Type;
    }
    return activeFile.mimeType;
  }, [activeFile.mimeType, activeFile.name]);

  const isDocType = DOC_MIME_TYPE.includes(mimeType);
  const isPdf = mimeType === 'application/pdf';

  const fetchPreviewUrl = async () => {
    if (activeFile && (isDocType || isPdf) && officePreviewEnable) {
      const res = await Api.getAttachPreviewUrl(spaceId!, activeFile.token, activeFile.name);
      const { data, message, success } = res.data;
      if (success) {
        setOfficePreviewUrl(data);
        return;
      }
      Message.error({ content: message });
    }
  };

  useEffect(() => {
    setOfficePreviewUrl(null);
    fetchPreviewUrl();
    // eslint-disable-next-line
  }, [activeIndex,officePreviewEnable]);

  const handlePrev = useCallback(
    (e: any) => {
      e.stopPropagation();

      if (activeIndex - 1 >= 0) {
        setTransformInfo(initTransformInfo, true);
        setActiveIndex(activeIndex - 1);
      }
    },
    [activeIndex, setActiveIndex, setTransformInfo],
  );

  const handleNext = useCallback(
    (e: any) => {
      e.stopPropagation();

      if (activeIndex + 1 < files.length) {
        setTransformInfo(initTransformInfo, true);
        setActiveIndex(activeIndex + 1);
      }
    },
    [activeIndex, files.length, setActiveIndex, setTransformInfo],
  );

  useKeyPress([KeyCode.Left], (e) => {
    if (isFocusingInput()) return;
    handlePrev(e);
  });
  useKeyPress([KeyCode.Right], (e) => {
    if (isFocusingInput()) return;
    handleNext(e);
  });

  const onZoom = useCallback(
    (newScale: number) => {
      const { initActualScale } = transformInfo;

      const minTransformScale = MIN_SCALE / initActualScale;
      const maxTransformScale = MAX_SCALE / initActualScale;

      setTransformInfo((state) => {
        if (newScale <= minTransformScale) {
          return {
            ...state,
            scale: minTransformScale,
            translatePosition: initTranslatePosition,
          };
        }

        if (newScale >= maxTransformScale) {
          return {
            ...state,
            scale: maxTransformScale,
            translatePosition: initTranslatePosition,
          };
        }
        return {
          ...state,
          scale: newScale,
          translatePosition: initTranslatePosition,
        };
      });
    },
    [setTransformInfo, transformInfo],
  );

  const onRotate = useCallback(() => {
    setTransformInfo((state) => {
      const rotate = state.rotate || 0;
      return {
        ...state,
        rotate: rotate + 90,
        translatePosition: initTranslatePosition,
      };
    });
  }, [setTransformInfo]);

  if (!activeFile) {
    return null;
  }

  const showPrevBtn = activeIndex !== 0 && !isMobile;
  const showNextBtn = activeIndex !== files.length - 1 && !isMobile;

  return (
    <div className={styles.mainContainer}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <header className={styles.header}>
          <ToolBar
            transformInfo={transformInfo}
            setTransformInfo={setTransformInfo}
            fileInfo={activeFile}
            onClose={onClose}
            onDelete={onDelete}
            readonly={readonly}
            onRotate={onRotate}
            previewEnable={officePreviewEnable}
            isDocType={isDocType}
            officePreviewUrl={officePreviewUrl}
            onZoom={onZoom}
            disabledDownload={disabledDownload}
            isFullScreen={isFullScreen}
            toggleIsFullScreen={toggleIsFullScreen}
          />
        </header>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Header
          onClose={onClose}
          downloadSrc={getDownloadSrc(activeFile)}
          readonly={readonly}
          fileName={activeFile.name}
          onDelete={onDelete}
          disabledDownload={disabledDownload}
        />
        {isImage({ name: activeFile.name, type: activeFile.mimeType }) && isSupportImage(activeFile.mimeType) && (
          <div onClick={onRotate} className={styles.rotate}>
            <RotateOutlined color={colors.defaultBg} size={16} />
          </div>
        )}
      </ComponentDisplay>

      <main className={styles.container} onMouseDown={onClose}>
        <div className={styles.left}>
          {showPrevBtn && (
            <div className={styles.iconPre} onClick={handlePrev} onMouseDown={stopPropagation}>
              <PreviousFilled width={40} height={40} className={styles.prev} />
            </div>
          )}
        </div>
        <div className={styles.middle}>
          <Swiper
            transformInfo={transformInfo}
            clientWidth={clientWidth}
            next={handleNext}
            prev={handlePrev}
            files={files}
            activeIndex={activeIndex}
            userInfo={userInfo}
            spaceId={spaceId}
            onClose={onClose}
            officePreviewEnable={officePreviewEnable}
            previewUrl={officePreviewUrl}
            setTransformInfo={setTransformInfo}
            readonly={readonly}
            disabledDownload={disabledDownload}
          />
        </div>

        <div className={styles.right}>
          {showNextBtn && (
            <div className={styles.iconNext} onClick={handleNext} onMouseDown={stopPropagation}>
              <NextFilled width={40} height={40} className={styles.next} />
            </div>
          )}
        </div>
      </main>

      <PreviewDisplayList
        activeIndex={activeIndex}
        setActiveIndex={(newActiveIndex) => {
          if (newActiveIndex !== activeIndex) {
            setTransformInfo(initTransformInfo, true);
            setActiveIndex(newActiveIndex);
          }
        }}
        files={files}
      />
    </div>
  );
};
