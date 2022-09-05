import { DatasheetApi, IAttachmentValue, isImage, isPdf, isPrivateDeployment, Strings, t } from '@vikadata/core';
import { useEffect, useState } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { copy2clipBoard, getDownloadSrc, isSupportImage } from 'pc/utils';
import { ITransFormInfo } from '../preview_file.interface';
import {
  CloseLargeOutlined,
  ColumnUrlOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  NewtabOutlined,
  RotateOutlined,
  UnfullscreenOutlined,
} from '@vikadata/icons';
import IconZoomIn from 'static/icon/datasheet/datasheet_icon_zoom_in.svg';
import IconZoomOut from 'static/icon/datasheet/datasheet_icon_zoom_out.svg';
import { IPreviewToolItem, PreviewToolItem } from './tool_item';
import { Message } from 'pc/components/common';
import { Loading, useThemeColors } from '@vikadata/components';
import { navigationToUrl } from 'pc/components/route_manager/use_navigation';
import { getFile } from '../preview_main/util';
import FileSaver from 'file-saver';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { MAX_SCALE, MIN_SCALE } from '../preview_main/constant';

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
  toggleIsFullScreen: () => void;
}

interface IPreviewToolBar {
  toolLeft: IPreviewToolItem[];
  title: React.ReactNode;
  toolRight: IPreviewToolItem[];
}

export const MULTIPLE = 1.5;

export function directDownload(href: string, name: string) {
  const a = document.createElement('a');
  a.download = name;
  a.href = href;
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
    // 如果图片 contentDisposition 类型是 inline, 强制使用二进制流下载
    if (contentDisposition.includes('inline')) {
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

export const ToolBar: React.FC<IToolBar> = props => {
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
  } = props;
  const colors = useThemeColors();
  const { scale, initActualScale } = transformInfo;

  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const isSideRecordOpen = useSelector(state => state.space.isSideRecordOpen);
  const isRecordFullScreen = useSelector(state => state.space.isRecordFullScreen);

  useEffect(() => {
    // initActualScale 变化, 代表切换了图片，此时应该重置 adaptiveMode
    setAdaptiveMode(true);
  }, [initActualScale]);

  const areEqualToInitial = Math.abs(1 / initActualScale - scale) < 1e-2;

  const toolBarData: IPreviewToolBar = {
    toolLeft: [
      {
        visible: isImage({ name: fileInfo.name, type: fileInfo.mimeType }) && isSupportImage(fileInfo.mimeType),
        group: [
          {
            component: <IconZoomOut width={16} height={16} fill={colors.black[50]} opacity={scale * initActualScale <= MIN_SCALE ? 0.5 : 1} />,
            tip: t(Strings.zoom_out),
            onClick: () => onZoom(scale / MULTIPLE),
            style: { marginRight: 0 },
          },
          {
            // 实际缩放比例 = 初始缩放比例 * scale
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
              <IconZoomIn
                width={16}
                height={16}
                fill={colors.black[50]}
                opacity={scale * initActualScale >= MAX_SCALE || initActualScale === -1 ? 0.5 : 1}
              />
            ),
            tip: t(Strings.zoom_in),
            onClick: () => onZoom(scale * MULTIPLE),
          },
          {
            component: <RotateOutlined size={16} color={colors.black[50]} />,
            tip: t(Strings.rotate),
            onClick: onRotate,
          },
        ],
        divider: !disabledDownload,
      },
      {
        visible: (isDocType || isPdf({ name: fileInfo.name, type: fileInfo.mimeType })) && previewEnable,
        component: <NewtabOutlined color={colors.black[50]} size={15} />,
        tip: t(Strings.open_in_new_tab),
        onClick: () => officePreviewUrl && navigationToUrl(officePreviewUrl),
      },
      {
        visible: !disabledDownload,
        component: <ColumnUrlOutlined size={16} color={colors.black[50]} />,
        tip: t(Strings.preview_copy_attach_url),
        onClick: () => {
          let addr = getDownloadSrc(fileInfo);
          if (isPrivateDeployment()) {
            addr = window.location.origin + addr;
          }
          copy2clipBoard(addr, () => Message.success({ content: t(Strings.preview_copy_attach_url_succeed) }));
        },
      },
      {
        visible: !disabledDownload,
        component: <DownloadOutlined size={16} color={colors.black[50]} />,
        tip: t(Strings.download),
        onClick: () => {
          download(fileInfo);
        },
      },
      {
        visible: !readonly,
        tip: t(Strings.delete),
        component: <DeleteOutlined size={16} color={colors.black[50]} />,
        onClick: onDelete,
        style: { marginRight: 0 },
      },
    ],
    title: fileInfo.name,
    toolRight: [
      {
        component: () =>
          isFullScreen ? <UnfullscreenOutlined size={16} color={colors.black[50]} /> : <FullscreenOutlined size={16} color={colors.black[50]} />,
        tip: () => t(isFullScreen ? Strings.attachment_preview_exit_fullscreen : Strings.attachment_preview_fullscreen),
        onClick: () => toggleIsFullScreen(),
        className: styles.rightIcon,
        visible: !isRecordFullScreen && isSideRecordOpen && !document.querySelector('.centerExpandRecord'),
      },
      {
        component: <CloseLargeOutlined size={16} color={colors.black[50]} />,
        tip: t(Strings.close),
        onClick: onClose,
        className: classNames(styles.rightIcon, styles.iconClose),
      },
    ],
  };

  const renderToolItem = (toolItemProps: IPreviewToolItem, index) => {
    return <PreviewToolItem key={index} {...toolItemProps} />;
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolLeft}>{toolBarData.toolLeft.map(renderToolItem)}</div>

      <h4>{toolBarData.title}</h4>

      <div className={styles.toolRight}>{toolBarData.toolRight.map(renderToolItem)}</div>
    </div>
  );
};
