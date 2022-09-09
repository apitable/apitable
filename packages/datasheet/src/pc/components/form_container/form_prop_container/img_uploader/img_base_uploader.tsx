import { Strings, t } from '@vikadata/core';
import { uploadAttachToS3, UploadType } from '@vikadata/widget-sdk';
import { Spin } from 'antd';
import classnames from 'classnames';
import Image from 'next/image';
import { ICropShape, ICustomTip, ImageCropUpload, IPreviewShape, Message } from 'pc/components/common';
import * as React from 'react';
import { useState } from 'react';
import EmptyState from 'static/icon/datasheet/emptystates.png';
import styles from './style.module.less';

export enum IFileType {
  Default = 'Default',
  Custom = 'Custom',
}

interface IImgBaseUploader {
  formId: string;
  visible: boolean;
  imgUrl: string | undefined;
  fileLimit?: number;
  cropShape: ICropShape;
  customTips?: ICustomTip;
  officialImgs?: string[];
  previewShape?: IPreviewShape;
  setVisible: (visible: boolean) => void;
  onChange: (file: any, type: IFileType) => void;
}

export const ImgBaseUploader: React.FC<IImgBaseUploader> = props => {
  const {
    formId,
    visible,
    imgUrl,
    cropShape,
    officialImgs,
    customTips = {},
    onChange,
    setVisible,
    previewShape = IPreviewShape.Square,
    fileLimit,
  } = props;
  const [coverLoading, setCoverLoading] = useState(false);

  const uploadCoverImg = (file: File) => {
    if (!formId) return false;
    setCoverLoading(true);
    uploadFile(file, formId);
    return false;
  };

  const uploadFile = (file: File, nodeId: string) => {
    return uploadAttachToS3({
      file: file,
      fileType: UploadType.CoverImage,
      nodeId,
    }).then(res => {
      const { success, data } = res.data;
      if (success) {
        onChange(data, IFileType.Custom);
      } else {
        Message.error({ content: t(Strings.message_upload_img_failed) });
      }
      setCoverLoading(false);
    });
  };

  const uploadConfirm = data => {
    const { customFile, officialToken } = data;
    if (officialToken) {
      onChange(officialToken, IFileType.Default);
      return;
    }
    if (customFile) {
      uploadCoverImg(customFile as File);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <Spin spinning={coverLoading}>{props.children}</Spin>
      <ImageCropUpload
        visible={visible}
        initPreview={
          <div
            className={classnames(styles.initPreview, {
              [styles.initBorder]: imgUrl,
              [styles.initBackground]: !imgUrl,
            })}
          >
            {imgUrl ? (
              <span style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <Image src={imgUrl} alt="banner" width={210} height={70} />
              </span>
            ) : (
              <Image src={EmptyState} width={106} height={80} />
            )}
          </div>
        }
        cropShape={cropShape}
        previewShape={previewShape}
        customTips={customTips}
        officialImgs={officialImgs}
        cancel={() => setVisible(false)}
        confirm={data => uploadConfirm(data)}
        fileLimit={fileLimit}
      />
    </div>
  );
};
