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
} from '@vikadata/core';
import { compact } from 'lodash';
import Image from 'next/image';
import { ScreenSize } from 'pc/components/common/component_display';
import { DisplayFile } from 'pc/components/display_file';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { isSupportImage, renderFileIconUrl } from 'pc/utils';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import NoImage from 'static/icon/datasheet/gallery/emptystates_img_datasheet.png';
import { hasCover } from '../gallery_view/utils';
import { ImageBox, ImageShowType } from './image_box';
import styles from './style.module.less';

const getImageSrc = (value: IAttachmentValue, height: number): string => {
  const file = { name: value.name, type: value.mimeType };
  if (!isImage(file) || !isSupportImage(file.type)) {
    return (renderFileIconUrl(file) as any) as string;
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
}

export const CardHeader: React.FC<ICardHeaderProps> = props => {
  const { coverFieldId, recordId, width, height, isCoverFit, showEmptyCover, showOneImage } = props;

  const { recordSnapshot, permissions } = useSelector(state => {
    return {
      recordSnapshot: Selectors.getRecordSnapshot(state, recordId),
      permissions: Selectors.getPermissions(state),
    };
  }, shallowEqual);

  const { screenIsAtMost } = useResponsive();
  if (!recordSnapshot) return null;
  const fieldMap = recordSnapshot.meta.fieldMap;
  const showCover = hasCover(fieldMap, coverFieldId);
  // 没附件字段直接不展示封面
  if (!showCover) return null;

  const coverField: IField = coverFieldId
    ? fieldMap[coverFieldId]
    : Object.values(fieldMap as IFieldMap).find((item: IField) => {
        return item.type === FieldType.Attachment;
      })!;

  let coverValue = compact(Selectors.getCellValue(store.getState(), recordSnapshot, recordId, coverField.id));
  if (coverField.type === FieldType.LookUp && coverValue) {
    if (Array.isArray(coverValue)) {
      coverValue = (coverValue as ILookUpValue).flat() as IAttachmentValue[];
    } else if (coverValue) {
      coverValue = [coverValue];
    }
  }

  if (coverValue && coverValue.length && screenIsAtMost(ScreenSize.md)) {
    const field = fieldMap[coverFieldId!];
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

  // 有封面无附件值，展示占位图
  return hasCoverImage ? (
    <ImageBox
      showOneImage={showOneImage}
      width={width}
      height={height}
      fileList={coverValue as IAttachmentValue[]}
      images={(coverValue as IAttachmentValue[]).map(url => getImageSrc(url, height))}
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
      field={coverField}
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
