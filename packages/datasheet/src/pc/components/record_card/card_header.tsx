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

import { compact } from 'lodash';
import Image from 'next/image';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import {
  cellValueToImageSrc,
  CutMethod,
  Field,
  FieldType,
  IAttachmentValue,
  IField,
  IFieldMap,
  ILookUpValue,
  isImage,
  Selectors,
} from '@apitable/core';
import { useGetSignatureAssertFunc } from '@apitable/widget-sdk';
import { ScreenSize } from 'pc/components/common/component_display';
import { DisplayFile } from 'pc/components/display_file';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { isSupportImage, renderFileIconUrl } from 'pc/utils';
import NoImage from 'static/icon/datasheet/gallery/emptystates_img_datasheet.png';
import { hasCover } from '../gallery_view/utils';
import { ImageBox, ImageShowType } from './image_box';
import styles from './style.module.less';

const getImageSrc = (value: IAttachmentValue, height: number): string => {
  const file = { name: value.name, type: value.mimeType };
  if (!isImage(file) || !isSupportImage(file.type)) {
    return renderFileIconUrl(file) as any as string;
  }

  return cellValueToImageSrc(value, {
    method: CutMethod.UNCUT,
    h: height,
  });
};

interface ICardHeaderProps {
  coverFieldId?: string;
  isCoverFit: boolean;
  recordId: string;
  height: number;
  width: number;
  showEmptyCover: boolean;
  showOneImage?: boolean;
  datasheetId: string;
}

export const CardHeader: React.FC<React.PropsWithChildren<ICardHeaderProps>> = (props) => {
  const { coverFieldId, recordId, width, height, isCoverFit, showEmptyCover, showOneImage, datasheetId } = props;

  const { recordSnapshot, permissions } = useAppSelector((state) => {
    return {
      recordSnapshot: Selectors.getRecordSnapshot(state, datasheetId, recordId),
      permissions: Selectors.getPermissions(state),
    };
  }, shallowEqual);

  const getSignatureUrl = useGetSignatureAssertFunc();

  const { screenIsAtMost } = useResponsive();
  if (!recordSnapshot) return null;
  const fieldMap = recordSnapshot.meta.fieldMap;
  const showCover = hasCover(fieldMap, coverFieldId);
  // No attachment field directly does not show the cover
  if (!showCover) return null;

  const coverField = coverFieldId
    ? fieldMap[coverFieldId]
    : Object.values(fieldMap as IFieldMap).find((item: IField) => {
      return item.type === FieldType.Attachment;
    })!;

  let _coverValue = compact(Selectors.getCellValue(store.getState(), recordSnapshot, recordId, coverField!.id));
  if (coverField?.type === FieldType.LookUp && _coverValue) {
    if (Array.isArray(_coverValue)) {
      _coverValue = (_coverValue as ILookUpValue).flat() as IAttachmentValue[];
    } else if (_coverValue) {
      _coverValue = [_coverValue];
    }
  }

  const coverValue = _coverValue.map((value) => ({
    ...(value as IAttachmentValue),
    token: getSignatureUrl((value as IAttachmentValue).token),
  }));

  if (coverValue && coverValue.length && screenIsAtMost(ScreenSize.md)) {
    const field = fieldMap[coverFieldId!]!;
    const editable = Field.bindModel(field).recordEditable() && permissions.cellEditable;

    return (
      <div style={{ height }} className={styles.boxWrapper}>
        <DisplayFile
          width={width}
          height={height}
          fileList={coverValue as IAttachmentValue[]}
          index={0}
          style={{ border: 'none' }}
          imageStyle={{
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
          field={field}
          recordId={recordId}
          editable={editable}
        />
      </div>
    );
  }
  const hasCoverImage = coverValue && coverValue.length;
  if (!showEmptyCover && !hasCoverImage) return null;

  // With cover without attachment value, showing placeholder image
  return hasCoverImage ? (
    <ImageBox
      showOneImage={showOneImage}
      width={width}
      height={height}
      fileList={coverValue as IAttachmentValue[]}
      images={(coverValue as IAttachmentValue[]).map((url) => getImageSrc(url, height))}
      style={{
        backgroundColor: '#fff',
        backgroundSize: isCoverFit ? 'contain' : 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
      }}
      showType={height === 320 ? ImageShowType.Thumbnail : ImageShowType.Marquee}
      isCoverFit={isCoverFit}
      recordId={recordId}
      field={coverField!}
    />
  ) : (
    <div style={{ width: '100%', height }} className={styles.nextImage}>
      <Image
        style={{ height: '100% !important', width: 'auto !important' }}
        src={NoImage}
        alt="NoImage"
        objectFit={'cover'}
        objectPosition={'center center'}
      />
    </div>
  );
};
