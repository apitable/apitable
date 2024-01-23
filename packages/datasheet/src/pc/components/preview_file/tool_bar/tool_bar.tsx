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
import FileSaver from 'file-saver';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Loading, useThemeColors } from '@apitable/components';
import { DatasheetApi, IAttachmentValue, isImage, isPdf, isPrivateDeployment, Strings, t } from '@apitable/core';
import {
  AddCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExpandOutlined,
  LinkOutlined,
  NarrowOutlined,
  NewtabOutlined,
  RotateOutlined,
  SubtractCircleOutlined,
} from '@apitable/icons';
import { Message } from 'pc/components/common';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard, getDownloadSrc, getPreviewUrl, isSupportImage } from 'pc/utils';
import { ITransFormInfo } from '../preview_file.interface';
import { MAX_SCALE, MIN_SCALE } from '../preview_main/constant';
import { getFile } from '../preview_main/util';
import { IPreviewToolItem, PreviewToolItem } from './tool_item';
import styles from './style.module.less';

interface IToolBar {
  transformInfo: ITransFormInfo;
  setTransformInfo: React.Dispatch<React.SetStateAction<ITransFormInfo>>;
  fileInfo: IAttachmentValue;

  onClose(): void;

  onDelete(): void;

  onZoom: (scale: number) => void;
  readonly?: boolean;

  onRotate(): void;

  previewEnable: boolean;
  isDocType: boolean;
  officePreviewUrl: string | null;
  disabledDownload?: boolean;
  isFullScreen: boolean;
  toggleIsFullScreen?: () => void;
  onDownload?: () => void;
}

interface IPreviewToolBar {
  toolLeft: IPreviewToolItem[];
  title: React.ReactNode;
  toolRight: IPreviewToolItem[];
}

export const MULTIPLE = 1.5;

export function directDownload(href: string, name: string) {
  const a = document.createElement('a');
  const url = new URL(href);
  url.searchParams.set('attname', name);
  a.download = name;
  a.href = url.href;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function download(fileInfo: IAttachmentValue) {
  const href = getDownloadSrc(fileInfo);
  const { name, mimeType: type } = fileInfo;
  const isImageType = isImage({ name, type });
  let mode: 'stream' | 'direct' = 'direct';
  if (isImageType && !isPrivateDeployment()) {
    Message.loading({
      content: t(Strings.downloading_attachments),
      duration: 0,
    });
    const resp = await DatasheetApi.getContentDisposition(href);
    const contentDisposition = resp.data.data;
    if (resp.data.code === 500) {
      Message.error({ content: 'SERVER_ERROR' });
      return;
    }
    // If the image contentDisposition type is inline, force the download using a binary stream
    if (contentDisposition?.includes('inline')) {
      mode = 'stream';
    }
  }

  if (mode === 'direct' || isPrivateDeployment()) {
    directDownload(href, name);
  } else {
    const blob = await getFile(href);
    FileSaver.saveAs(blob, name);
  }

  Message.destroy();
}

export const ToolBar: React.FC<React.PropsWithChildren<IToolBar>> = (props) => {
  const {
    transformInfo,
    fileInfo,
    onClose,
    onDelete,
    onZoom,
    readonly,
    onRotate,
    previewEnable,
    isDocType,
    officePreviewUrl,
    disabledDownload,
    isFullScreen,
    toggleIsFullScreen,
    onDownload,
  } = props;
  const colors = useThemeColors();
  const { scale, initActualScale } = transformInfo;

  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const isSideRecordOpen = useAppSelector((state) => state.space.isSideRecordOpen);
  const isRecordFullScreen = useAppSelector((state) => state.space.isRecordFullScreen);

  useEffect(() => {
    // initActualScale changes, which means that the image is switched, and the adaptiveMode should be reset.
    setAdaptiveMode(true);
  }, [initActualScale]);

  const areEqualToInitial = Math.abs(1 / initActualScale - scale) < 1e-2;

  const toolBarData: IPreviewToolBar = {
    toolLeft: [
      {
        visible: isImage({ name: fileInfo.name, type: fileInfo.mimeType }) && isSupportImage(fileInfo.mimeType),
        group: [
          {
            component: (
              <span style={{ opacity: scale * initActualScale <= MIN_SCALE ? 0.5 : 1 }}>
                <SubtractCircleOutlined size={16} color={colors.black[50]} />
              </span>
            ),
            tip: t(Strings.zoom_out),
            onClick: () => onZoom(scale / MULTIPLE),
            style: { marginRight: 0 },
          },
          {
            // Actual scale = Initial scale * scale
            component: initActualScale == -1 ? <Loading currentColor /> : Math.floor((areEqualToInitial ? 1 : initActualScale * scale) * 100) + '%',
            tip: adaptiveMode ? t(Strings.initial_size) : t(Strings.adaptive),
            onClick: () => {
              if (adaptiveMode) {
                onZoom(1 / initActualScale);
              } else {
                onZoom(1);
              }
              setAdaptiveMode(!adaptiveMode);
            },
            className: styles.zoomText,
          },
          {
            component: (
              <span
                style={{
                  opacity: scale * initActualScale >= MAX_SCALE || initActualScale === -1 ? 0.5 : 1,
                }}
              >
                <AddCircleOutlined size={16} color={colors.black[50]} />
              </span>
            ),
            tip: t(Strings.zoom_in),
            onClick: () => onZoom(scale * MULTIPLE),
          },
          {
            icon: RotateOutlined,
            tip: t(Strings.rotate),
            onClick: onRotate,
          },
        ],
        divider: !disabledDownload,
      },
      {
        visible: (isDocType || isPdf({ name: fileInfo.name, type: fileInfo.mimeType })) && previewEnable,
        icon: NewtabOutlined,
        tip: t(Strings.open_in_new_tab),
        onClick: () => officePreviewUrl && navigationToUrl(officePreviewUrl),
      },
      {
        visible: !disabledDownload,
        icon: LinkOutlined,
        tip: t(Strings.preview_copy_attach_url),
        onClick: () => {
          let addr = getPreviewUrl(fileInfo);
          if (isPrivateDeployment()) {
            addr = window.location.origin + addr;
          }
          copy2clipBoard(addr, () => Message.success({ content: t(Strings.preview_copy_attach_url_succeed) }));
        },
      },
      {
        visible: !disabledDownload,
        icon: DownloadOutlined,
        tip: t(Strings.download),
        onClick: () => {
          if (onDownload) {
            onDownload();
            return;
          }
          download(fileInfo);
        },
      },
      {
        visible: !readonly,
        tip: t(Strings.delete),
        icon: DeleteOutlined,
        onClick: onDelete,
        style: { marginRight: 0 },
      },
    ],
    title: fileInfo.name,
    toolRight: [
      {
        icon: isFullScreen ? NarrowOutlined : ExpandOutlined,
        tip: () => t(isFullScreen ? Strings.attachment_preview_exit_fullscreen : Strings.attachment_preview_fullscreen),
        onClick: () => toggleIsFullScreen?.(),
        className: styles.rightIcon,
        visible: !isRecordFullScreen && isSideRecordOpen && !document.querySelector('.centerExpandRecord'),
      },
      {
        icon: CloseOutlined,
        tip: t(Strings.close),
        onClick: onClose,
        className: classNames(styles.rightIcon, styles.iconClose),
      },
    ],
  };

  const renderToolItem = (toolItemProps: IPreviewToolItem, index: number) => {
    const component = toolItemProps.icon ? <toolItemProps.icon size={16} color={colors.black[50]} /> : toolItemProps.component;
    return <PreviewToolItem key={index} {...toolItemProps} component={component} />;
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolLeft}>{toolBarData.toolLeft.map(renderToolItem)}</div>

      <h4>{toolBarData.title}</h4>

      <div className={styles.toolRight}>{toolBarData.toolRight.map(renderToolItem)}</div>
    </div>
  );
};
