import { IAttachmentValue, Strings, t } from '@vikadata/core';
import classNames from 'classnames';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { resourceService } from 'pc/resource_service';
import { useResponsive } from 'pc/hooks';
import { stopPropagation } from 'pc/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { useThemeColors } from '@vikadata/components';
import { ICommonTabRef } from '../upload_tab';
import styles from './styles.module.less';
import { AddOutlined } from '@vikadata/icons';
import { browser } from 'pc/common/browser';

interface IUploadZonProps {
  onUpload(files: IUploadZoneItem[]): void;
  recordId: string;
  fieldId: string;
  cellValue: IAttachmentValue[];
  style?: React.CSSProperties;
  accept?: string[];
  // 以透明的状态悬浮显示，目前仅用于单元格
  layoutOpacity?: boolean;
}

export interface IUploadZoneItem {
  file: File;
  fileUrl: string;
  fileId: string;
}

export const UploadZoneBase: React.ForwardRefRenderFunction<ICommonTabRef, IUploadZonProps> = (props, ref) => {
  const { onUpload, accept, recordId, fieldId, style, layoutOpacity, cellValue } = props;
  const colors = useThemeColors();
  const [isDragOver, setDragOver] = useState(false);
  const uploadRef = useRef<HTMLElement | null>(null);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useImperativeHandle<ICommonTabRef, ICommonTabRef>(
    ref,
    () => ({
      focus() {
        return;
      },
      trigger() {
        uploadRef.current?.click();
      }
    }),
  );

  const { getRootProps, getInputProps, isFocused, isFileDialogActive } = useDropzone({
    accept: accept || '',
    onDragOver() { setDragOver(true); },
    onDragLeave() { setDragOver(false); },
    onDrop(acceptedFiles: File[]) {
      onUpload(resourceService.instance!.uploadManager.buildStdUploadList(acceptedFiles, recordId, fieldId, cellValue));
      setDragOver(false);
    },
    onFileDialogCancel() {
      setDragOver(false);
    },
  });

  useEffect(() => {
    if (isFocused) {
      return setDragOver(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFileDialogActive) {
      return setDragOver(true);
    }
    setDragOver(false);
  }, [isFileDialogActive]);

  const isMiniProgram = browser.is('wechat') && browser.is('android');

  return (
    <div
      {...getRootProps({
        className: classNames({
          [styles.uploadZone]: !layoutOpacity,
          [styles.opacity]: layoutOpacity,
          [styles.dragOver]: !layoutOpacity && isDragOver,
          [styles.animation]: layoutOpacity && isDragOver,
        }),
      })}
      style={{
        ...style,
      }}
      defaultValue=""
    >
      {/* 微信小程序input不支持multiple, 小程序端强制设置为false */}
      <input {...getInputProps()} defaultValue="" {...(isMiniProgram && { multiple: false })} />
      {
        !layoutOpacity && <>
          <span onMouseDown={stopPropagation} style={{ display: 'flex', alignItems: 'center' }} ref={uploadRef}>
            <AddOutlined color={colors.fourthLevelText} />
          </span>
          {isMobile ?
            (isMiniProgram ? t(Strings.upload_on_your_phone)
              : t(Strings.take_photos_or_upload)) : t(Strings.select_local_file)}
        </>
      }
    </div>
  );
};

export const UploadZone = forwardRef<ICommonTabRef, IUploadZonProps>(UploadZoneBase);
