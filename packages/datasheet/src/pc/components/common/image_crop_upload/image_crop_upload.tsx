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

import { Col, Row, Tabs, Upload } from 'antd';
import { RowProps } from 'antd/lib/row';
import classNames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { FC, useCallback, useRef, useState } from 'react';
// @ts-ignore
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, TextButton, useThemeColors } from '@apitable/components';
import { ConfigConstant, CutMethod, getImageThumbSrc, integrateCdnHost, Strings, t } from '@apitable/core';
import { CheckOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useResponsive } from 'pc/hooks/use_responsive';
import { useAppSelector } from 'pc/store/react-redux';
import { createAvatarRainbowColorsArr } from 'pc/utils/color_utils';
import { Avatar, AvatarSize } from '../avatar';
import { ICropShape, IImageUploadProps, IUploadType, IPreviewShape, TabKeys } from './interface';
import styles from './style.module.less';

const { TabPane } = Tabs;
const horizontalGutter = { xs: 16, sm: 16, md: 24, lg: 24, xl: 24 };
const rowConfig: RowProps = {
  gutter: [horizontalGutter, 12],
};
const initCropConfigMap = new Map([
  [ICropShape.Square, { unit: '%', width: 100, aspect: 1 }],
  [ICropShape.Rectangle, { unit: '%', width: 100, aspect: 3 }],
  [ICropShape.AnyShape, { unit: '%', width: 100, height: 100 }],
]);

export const ImageCropUpload: FC<React.PropsWithChildren<IImageUploadProps>> = (props) => {
  const {
    type = IUploadType.Other,
    confirm,
    visible,
    initPreview,
    children,
    title = t(Strings.choose_picture),
    fileLimit,
    officialImgs,
    customTips = {},
    previewShape = IPreviewShape.Square,
    cropShape = ICropShape.Square,
    avatarName,
    avatarColor: initAvatarColor = null,
  } = props;
  const colors = useThemeColors();
  const themeName = useAppSelector((state) => state.theme);
  const avatarColorList = createAvatarRainbowColorsArr(themeName);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const initCropConfig = initCropConfigMap.get(cropShape);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [tabKey, setTabKey] = useState<string>(() => {
    if (type === IUploadType.Avatar) {
      return initAvatarColor != null ? TabKeys.Default : TabKeys.Custom;
    }
    return officialImgs?.length ? TabKeys.Default : TabKeys.Custom;
  });
  const [officialImgToken, setOfficialImgToken] = useState(''); // Official picture id
  const [upImg, setUpImg] = useState<string>(''); // Latest images uploaded - url
  const [upImgFile, setUpImgFile] = useState<string | File>(''); // Latest images uploaded -file format
  const [crop, setCrop] = useState(initCropConfig); // Image cropping information
  const [previewUrl, setPreviewUrl] = useState<string>(''); // Preview images
  const [innerControlModal, setInnerControlModal] = useState(false); // This state only takes effect when the children parameter is passed
  const [isGif, setIsGif] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [avatarColor, setAvatarColor] = useState(initAvatarColor);
  const isCropRectangle = cropShape === ICropShape.Rectangle;
  const isPreviewRectangle = previewShape === IPreviewShape.Rectangle;
  const isPreviewCircle = previewShape === IPreviewShape.Circle;
  const thumbOptions = isCropRectangle
    ? {
      method: CutMethod.CUT,
      w: 420,
      h: 140,
    }
    : {
      method: CutMethod.CUT,
      size: 470,
    };
  const { cropTip, cropDesc } = customTips;
  const { width: imgWidth, height: imgHeight } = imgRef.current || {};

  const previewTip = customTips.previewTip || cropTip;
  const previewDesc = customTips.previewDesc || cropDesc;

  const clearState = () => {
    setUpImg('');
    setUpImgFile('');
    setOfficialImgToken('');
    setCrop(initCropConfig);
    setIsGif(false);
    setPreviewUrl('');
  };

  const onLoad = useCallback((img: any) => {
    imgRef.current = img;
  }, []);

  const officialImgClick = (bannerId: string, url: string) => {
    setPreviewUrl(url);
    setOfficialImgToken(bannerId);
    setUpImg('');
    setUpImgFile('');
  };

  const onComplete = (crop: { width: number; height: number }, percentCrop: { width: number; height: number }) => {
    const image = imgRef.current;
    if (!image) {
      return;
    }
    if (crop.width && crop.height && cropShape === ICropShape.AnyShape) {
      cropAnyView(image, crop);
    }
    if (percentCrop.width && percentCrop.height && cropShape === ICropShape.Rectangle) {
      cropRectangleView(image, percentCrop);
    }
    if (percentCrop.width && percentCrop.height && cropShape === ICropShape.Square) {
      cropSquareView(image, percentCrop);
    }
  };

  // Draw arbitrarily shaped cropped areas
  const cropAnyView = (image: any, crop: any) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    canvasToFile(canvas);
  };

  // Drawing a square cut-out area
  const cropSquareView = (image: any, percentCrop: any) => {
    const canvas = document.createElement('canvas');
    const computedSize = Math.floor((image.naturalHeight * percentCrop.height) / 100);
    canvas.width = computedSize;
    canvas.height = computedSize;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(
      image,
      Math.floor((image.naturalWidth * percentCrop.x) / 100),
      Math.floor((image.naturalHeight * percentCrop.y) / 100),
      computedSize,
      computedSize,
      0,
      0,
      computedSize,
      computedSize,
    );

    canvasToFile(canvas);
  };

  // Drawing rectangular cut-out areas
  const cropRectangleView = (image: any, percentCrop: any) => {
    const canvas = document.createElement('canvas');
    const computedSize = Math.floor((image.naturalWidth * percentCrop.width) / 100);
    canvas.width = computedSize;
    canvas.height = computedSize / 3;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(
      image,
      Math.floor((image.naturalWidth * percentCrop.x) / 100),
      Math.floor((image.naturalHeight * percentCrop.y) / 100),
      computedSize,
      computedSize / 3,
      0,
      0,
      computedSize,
      computedSize / 3,
    );

    canvasToFile(canvas);
  };

  const canvasToFile = (canvas: HTMLCanvasElement) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          new Error('Canvas is empty');
        }
        // Image Preview
        setPreviewUrl(window.URL.createObjectURL(blob!));
      },
      (upImgFile as File).type,
    );
    const imgBase64 = canvas.toDataURL((upImgFile as File).type, 1);
    const file = dataURLtoFile(imgBase64, (upImgFile as File).name);
    setUpImgFile(file);
  };

  const dataURLtoFile = (urlData: string, fileName: string) => {
    const bytes = window.atob(urlData.split(',')[1]); // Remove the url header and convert to byte
    // @ts-ignore
    const mime = urlData.split(',')[0].match(/:(.*?);/)[1];
    // Handling exceptions, converting ascii codes less than 0 to greater than 0
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new File([ab], fileName, { type: mime });
  };

  const beforeUpload = (file: File): Promise<void> =>
    new Promise<void>((res, rej) => {
      setIsGif(Boolean(file.type === 'image/gif'));

      const reader = new FileReader();
      // Because it takes time to read a file, the result of the read is used in the callback function
      reader.onload = () => {
        const isLt2M = fileLimit ? (file as File).size / 1024 / 1024 > fileLimit : false;
        if (isLt2M) {
          Message.error({ content: t(Strings.image_limit, { number: fileLimit }) });
          setDisabled(true);
          rej();
          return;
        }

        setAvatarColor(null);
        setUpImg(reader.result as string);
        setOfficialImgToken('');
        setUpImgFile(file);
        setPreviewUrl(window.URL.createObjectURL(file));
        setDisabled(false);
        props.children && setInnerControlModal(true);
        res();
      };

      reader.readAsDataURL(file);
    });

  const cancelBtnClick = () => {
    clearState();
    setInnerControlModal(false);
    props.cancel && props.cancel();
  };

  const confirmBtnClick = () => {
    confirm?.({
      officialToken: officialImgToken,
      officialUrl: officialImgToken ? getImageThumbSrc(integrateCdnHost(officialImgToken), { method: CutMethod.CUT, size: 480 }) : '',
      customUrl: upImg,
      customFile: upImgFile,
      color: avatarColor,
    });
    cancelBtnClick();
  };

  // Deselect
  const clearSelect = () => {
    setUpImg('');
    setUpImgFile('');
    setOfficialImgToken('');
  };

  const renderReselect = () => {
    if (!(upImg || officialImgToken)) {
      return;
    }
    if (tabKey === TabKeys.Default || (tabKey === TabKeys.Custom && !upImg)) {
      return (
        <div className={styles.leftBtnWrap}>
          <TextButton color="primary" onClick={clearSelect} style={{ height: 36 }}>
            {t(Strings.deselect)}
          </TextButton>
        </div>
      );
    }
    if (tabKey === TabKeys.Custom && upImg) {
      return (
        <>
          <div className={styles.leftBtnWrap}>
            <Upload showUploadList={false} beforeUpload={beforeUpload} accept={ConfigConstant.ACCEPT_FILE_TYPE}>
              <TextButton color="primary" disabled={!upImg} style={{ height: 36 }}>
                {t(Strings.reselect)}
              </TextButton>
            </Upload>
            <div className={styles.leftReselectDesc}>
              <div style={{ color: colors.firstLevelText }}>{previewTip || t(Strings.support_image_formats)}</div>
              {previewDesc || (fileLimit && t(Strings.message_img_size_limit, { size: `${fileLimit}M` }))}
            </div>
          </div>
        </>
      );
    }
    return;
  };

  const onAvatarColorSelect = (colorIndex: number) => {
    clearSelect();
    setAvatarColor(colorIndex);
  };

  return (
    <>
      {children && (
        <Upload showUploadList={false} beforeUpload={beforeUpload} accept={ConfigConstant.ACCEPT_FILE_TYPE}>
          {children}
        </Upload>
      )}
      <Modal
        title={title}
        visible={children ? innerControlModal : visible}
        className={styles.imageCropUpload}
        width={718}
        footer={null}
        onCancel={cancelBtnClick}
        destroyOnClose
        centered
      >
        <div className={styles.container} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          <div className={styles.leftContent}>
            <div className={styles.title}>{t(Strings.preview)}</div>
            <div
              className={classNames(styles.preview, isPreviewRectangle && styles.previewRectangle, isPreviewCircle && styles.previewCircle)}
              style={{ flexDirection: isMobile ? 'row' : 'column' }}
            >
              <div className={styles.previewImg}>
                {avatarColor != null ? (
                  <Avatar
                    id={avatarName || ''}
                    title={avatarName || ''}
                    avatarColor={avatarColor}
                    size={isMobile ? AvatarSize.Size80 : AvatarSize.Size120}
                  />
                ) : upImg || officialImgToken ? (
                  <span className={styles.previewImgWrapper}>
                    <img src={previewUrl} alt={''} />
                  </span>
                ) : (
                  initPreview
                )}
              </div>
              {renderReselect()}
            </div>
          </div>
          <div className={styles.rightContent} style={{ width: isMobile ? '100%' : 436 }}>
            <Tabs
              activeKey={tabKey}
              className={classNames(styles.imgSelector, isCropRectangle && styles.imgRectangleSelector)}
              onChange={(key) => setTabKey(key)}
            >
              {type === IUploadType.Avatar && (
                <TabPane tab={t(Strings.default)} key={TabKeys.Default}>
                  <div className={styles.scrollWrapper}>
                    <div className={styles.colorList}>
                      <Row gutter={[horizontalGutter, 24]}>
                        {avatarColorList.map((item, index) => {
                          return (
                            <Col key={item} span={4}>
                              <div
                                key={item}
                                className={styles.colorItem}
                                style={{ backgroundColor: item }}
                                onClick={() => onAvatarColorSelect(index)}
                              >
                                {avatarColor === index && <CheckOutlined size={16} color={colors.textStaticPrimary} />}
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </div>
                </TabPane>
              )}
              {type === IUploadType.Other && officialImgs?.length && (
                <TabPane tab={t(Strings.default)} key={TabKeys.Default}>
                  <div className={styles.scrollWrapper}>
                    <div className={styles.banners}>
                      <Row {...rowConfig}>
                        {officialImgs.map((imgToken) => {
                          const url = getImageThumbSrc(integrateCdnHost(imgToken), thumbOptions);
                          return (
                            <Col key={imgToken} span={isCropRectangle ? 12 : 8}>
                              <div className={styles.bannerPreviewImg} onClick={() => officialImgClick(imgToken, url)}>
                                <span className={styles.bannerPreviewImgWrapper}>
                                  <Image src={url} alt="vika.cn" layout={'fill'} />
                                </span>
                                {officialImgToken === imgToken && (
                                  <div className={styles.checked}>
                                    <CheckOutlined />
                                  </div>
                                )}
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </div>
                </TabPane>
              )}
              <TabPane tab={t(Strings.custom)} key={TabKeys.Custom}>
                <div className={styles.uploadWrapper}>
                  {!upImg ? (
                    <div className={styles.upload}>
                      <Upload showUploadList={false} beforeUpload={beforeUpload} accept={ConfigConstant.ACCEPT_FILE_TYPE}>
                        <Button color="primary" style={{ marginBottom: 24 }}>
                          {title}
                        </Button>
                      </Upload>
                      {cropTip && <div className={styles.tip}>{cropTip}</div>}
                      {cropDesc && <div className={styles.desc}>{cropDesc}</div>}
                    </div>
                  ) : isGif ? (
                    <div className={styles.imageWrapper}>
                      <span className={styles.gifImgWrapper}>
                        <Image src={upImg} alt="logo" layout={'fill'} />
                      </span>
                    </div>
                  ) : (
                    <div
                      className={classNames(styles.imageWrapper, {
                        [styles.circleImageWrapper]: isPreviewCircle,
                        [styles.squareImageWrapper]: imgWidth != null && imgWidth === imgHeight,
                      })}
                    >
                      <ReactCrop src={upImg} onImageLoaded={onLoad} crop={crop} onChange={(c: any) => setCrop(c)} onComplete={onComplete} />
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.footerBtn}>
          <TextButton size="small" onClick={cancelBtnClick}>
            {t(Strings.cancel)}
          </TextButton>
          <Button size="small" color="primary" onClick={confirmBtnClick} disabled={disabled || !(upImg || officialImgToken || avatarColor != null)}>
            {t(Strings.confirm)}
          </Button>
        </div>
      </Modal>
    </>
  );
};
