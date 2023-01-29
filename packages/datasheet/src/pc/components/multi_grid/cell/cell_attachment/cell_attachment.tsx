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

import { Tooltip, useThemeColors } from '@apitable/components';
import { Field, IAttacheField, IAttachmentValue, IReduxState, isGif, isImage, RowHeight, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import Image from 'next/image';
import { ButtonPlus } from 'pc/components/common';
import { expandPreviewModal } from 'pc/components/preview_file';
import { MouseDownType } from 'pc/components/selection_wrapper';
import { useAllowDownloadAttachment } from 'pc/components/upload_modal/preview_item';
import { IUploadFile, IUploadFileList } from 'pc/components/upload_modal/upload_core';
import { UploadItem } from 'pc/components/upload_modal/upload_item';
import { IUploadZoneItem, UploadZone } from 'pc/components/upload_modal/upload_zone';
import { usePlatform } from 'pc/hooks/use_platform';
import { resourceService } from 'pc/resource_service';
import { getCellValueThumbSrc, showOriginImageThumbnail, UploadManager, UploadStatus } from 'pc/utils';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ImagePlaceholder from 'static/icon/datasheet/attachment/datasheet_img_placeholder.png';
import { ICellComponentProps } from '../cell_value/interface';
import optionalStyle from '../optional_cell_container/style.module.less';
import styles from './styles.module.less';

interface ICellAttachmentProps extends ICellComponentProps {
  field: IAttacheField;
  recordId: string;
  rowHeight?: number;
  keyPrefix?: string; // When keyPrefix is passed in actively, use keyPrefix + index as the children key under the map
}

const CELL_PADDING_OFFSET = 10;

const Loading = () => {
  return <div className={styles.loadingio}>
    <div className={styles.ldio}>
      <div />
    </div>
  </div>;
};

function calcFileWidth(file: IAttachmentValue, ratioHeight: number) {
  if (!(file.width && file.height)) {
    return 'auto';
  }
  if (!showOriginImageThumbnail(file)) {
    return 'auto';
  }
  const ratio = file.width / file.height;
  return ratioHeight * ratio;
}

export const CellAttachment: React.FC<ICellAttachmentProps> = props => {
  const {
    cellValue,
    isActive,
    className,
    toggleEdit,
    readonly,
    keyPrefix,
    recordId,
    field,
    onChange,
  } = props;
  const colors = useThemeColors();
  const rowHeight = props.rowHeight ? props.rowHeight : RowHeight.Short;
  const fileList: IAttachmentValue[] = cellValue as IAttachmentValue[];
  const uploadManager = resourceService.instance?.uploadManager;
  const [isDragEnter, setDragEnter] = useState(false);
  const [uploadList, setUploadList] = useState<IUploadFileList>(
    uploadManager ? uploadManager.get(UploadManager.getCellId(recordId, field.id)) : []
  );

  const {
    datasheetId,
    permissions,
  } = useSelector((state: IReduxState) => ({
    permissions: Selectors.getPermissions(state),
    datasheetId: state.pageParams.datasheetId,
    fieldMap: Selectors.getFieldMap(state, state.pageParams.datasheetId!),
  }), shallowEqual);
  const disabledDownload = !useAllowDownloadAttachment(field.id, datasheetId);
  const rowHeightLevel = useSelector(Selectors.getViewRowHeight);
  const height = rowHeight - CELL_PADDING_OFFSET;
  const editable = Field.bindModel(field).recordEditable() && permissions.cellEditable;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { mobile } = usePlatform();

  function Preview(file: IAttachmentValue, index: number) {
    const isImageType = isImage({ name: file.name, type: file.mimeType });
    // The icons in the cell are scaled
    const imgUrl = getCellValueThumbSrc(file,
      {
        h: height * (window.devicePixelRatio || 1),
        formatToJPG: isGif({ name: file.name, type: file.mimeType }),
      },
    );

    const ImageWrapper = (
      <span
        className={classNames(styles.imgItem, { image: isImageType }, 'img')}
        onMouseDown={(e) => {
          if (e.button !== MouseDownType.Left) {
            return;
          }
          if (isActive) {
            expandPreviewModal({
              activeIndex: index,
              cellValue: fileList,
              editable,
              onChange: onChange!,
              disabledDownload
            });
          }
        }}
        onMouseEnter={() => setHoverIndex(index)}
        onMouseOut={() => setHoverIndex(null)}
        style={{
          width: calcFileWidth(file, height),
          height,
          position: 'relative'
        }}
      >
        <Image
          src={imgUrl}
          alt={file.name}
          key={keyPrefix ? `${keyPrefix}-${index}` : file.id + index}
          layout={'fill'}
          className={styles.img}
          onError={e => {
            const ImgEle = (e.target as HTMLElement);
            ImgEle.setAttribute('src', ImagePlaceholder as any as string);
            ImgEle.setAttribute('style', 'width:auto;height:auto');
          }}
          style={{
            width: calcFileWidth(file, height),
            height,
            position: 'relative'
          }}
        />
      </span>

    );

    return (
      <>
        {
          (mobile || hoverIndex !== index)
            ? ImageWrapper
            : (
              <Tooltip
                content={file.name}
                key={file.id + index}
                visible={hoverIndex === index}
              >
                {ImageWrapper}
              </Tooltip>
            )
        }
      </>
    );
  }

  function onDragStart() {
    setDragEnter(true);
  }

  function onDragEnd() {
    if (!isDragEnter) {
      return;
    }
    setDragEnter(false);
  }

  const isUploading = useMemo(() => {
    const uploadingList = uploadList.reduce<IUploadFile[]>((list, item) => {
      if (item.status === UploadStatus.Loading || item.status === UploadStatus.Pending) {
        list.push(item);
      }
      return list;
    }, []);
    return Boolean(uploadingList.length);
  }, [uploadList]);

  useEffect(() => {
    const cellId = UploadManager.getCellId(recordId, field.id);
    uploadManager && uploadManager.subscribeUploadList(cellId, () => {
      const existList = uploadManager.get(cellId);
      setUploadList(uniqBy(existList, 'fileId'));
    });

    if (!fileList || uploadList.length === 0) {
      return;
    }
    const cvIds = fileList.map(item => item.id);
    setUploadList(state => {
      return state.filter(item => !cvIds.includes(item.fileId));
    });
    // eslint-disable-next-line
  }, [fileList]);

  function onUpload(list: IUploadZoneItem[]) {
    if (!uploadManager) {
      return;
    }
    const existList = uploadManager.get(UploadManager.getCellId(recordId, field.id));
    setUploadList(uniqBy([...existList, ...list], 'fileId'));
  }

  const showText = isActive &&
    (!fileList || (fileList && fileList.length === 0)) &&
    (!uploadList || (uploadList && uploadList.length === 0)) &&
    !readonly;

  return (
    <div
      className={classNames(styles.attachmentContainer, 'attachmentContainer', className)}
      onDoubleClick={readonly ? undefined : toggleEdit}
      onMouseOver={readonly ? undefined : onDragEnd}
      onDragOver={readonly ? undefined : onDragStart}
    >
      {
        isActive && !readonly && !isUploading &&
        <ButtonPlus.Icon
          size={'x-small'}
          className={optionalStyle.iconAdd}
          onClick={toggleEdit}
          style={{ marginTop: 0 }}
          icon={<AddOutlined color={colors.fourthLevelText} />}
        />
      }
      {
        isUploading && <Loading />
      }
      {
        showText &&
        <span className={styles.textTip}>
          {
            t(Strings.field_type_attachment_select_cell)
          }
        </span>
      }
      {
        fileList && fileList.map((item, index) => {
          return Preview(item, index);
        })
      }
      {
        uploadList && uploadList.map((item) => {
          return (
            <div key={item.fileId} style={{ marginRight: '5px' }}>
              <UploadItem
                fileUrl={item.fileUrl}
                recordId={recordId}
                field={field}
                fileId={item.fileId}
                status={item.status}
                file={item.file}
                datasheetId={datasheetId!}
                isCell
                cellHeight={height}
                rowHeightLevel={rowHeightLevel}
              />
            </div>
          );
        })
      }
      {
        !readonly && permissions.cellEditable && !keyPrefix &&
        <UploadZone
          onUpload={onUpload}
          recordId={recordId}
          fieldId={field.id}
          cellValue={fileList}
          style={isDragEnter ? { pointerEvents: 'auto' } : { pointerEvents: 'none' }}
          layoutOpacity
        />
      }
    </div>
  );
};
