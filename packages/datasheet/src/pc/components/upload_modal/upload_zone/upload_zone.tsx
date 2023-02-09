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

import { IAttachmentValue, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { ScreenSize } from 'pc/components/common/component_display';
import { resourceService } from 'pc/resource_service';
import { useResponsive } from 'pc/hooks';
import { stopPropagation } from 'pc/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { useThemeColors } from '@apitable/components';
import { ICommonTabRef } from '../upload_tab';
import styles from './styles.module.less';
import { AddOutlined } from '@apitable/icons';
import { browser } from 'modules/shared/browser';

interface IUploadZonProps {
  onUpload(files: IUploadZoneItem[]): void;
  recordId: string;
  fieldId: string;
  cellValue: IAttachmentValue[];
  style?: React.CSSProperties;
  accept?: string[];
  // Hover in a transparent state, currently only available for cells.
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

  useImperativeHandle<ICommonTabRef, ICommonTabRef>(ref, () => ({
    focus() {
      return;
    },
    trigger() {
      uploadRef.current?.click();
    },
  }));

  const { getRootProps, getInputProps, isFocused, isFileDialogActive } = useDropzone({
    accept: accept || '',
    onDragOver() {
      setDragOver(true);
    },
    onDragLeave() {
      setDragOver(false);
    },
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

  const isMiniProgram = browser?.is('wechat') && browser?.is('android');

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
      {/* WeChat applet input does not support multiple, widget side forced to set to false */}
      <input {...getInputProps()} defaultValue="" {...(isMiniProgram && { multiple: false })} />
      {!layoutOpacity && (
        <>
          <span onMouseDown={stopPropagation} style={{ display: 'flex', alignItems: 'center' }} ref={uploadRef}>
            <AddOutlined color={colors.fourthLevelText} />
          </span>
          {isMobile ? (isMiniProgram ? t(Strings.upload_on_your_phone) : t(Strings.take_photos_or_upload)) : t(Strings.select_local_file)}
        </>
      )}
    </div>
  );
};

export const UploadZone = forwardRef<ICommonTabRef, IUploadZonProps>(UploadZoneBase);
