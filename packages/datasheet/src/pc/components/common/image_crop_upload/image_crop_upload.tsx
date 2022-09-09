import { Button, TextButton, useThemeColors } from '@vikadata/components';
import { ConfigConstant, CutMethod, getImageThumbSrc, integrateCdnHost, Strings, t } from '@vikadata/core';
import { Col, Row, Tabs, Upload } from 'antd';
import { RowProps } from 'antd/lib/row';
import classNames from 'classnames';
import Image from 'next/image';
import { ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useResponsive } from 'pc/hooks';
import * as React from 'react';
import { FC, useCallback, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import SelectedIcon from 'static/icon/common/common_icon_select.svg';
import styles from './style.module.less';

enum TabKeys {
  Default = '1',
  Custom = '2',
}

export enum ICropShape {
  AnyShape = 'AnyShape',
  Square = 'Square',
  Rectangle = 'Rectangle',
}

export enum IPreviewShape {
  Circle = 'Circle',
  Square = 'Square',
  Rectangle = 'Rectangle',
}

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

interface ISelectInfoBase {
  officialToken: string;
  officialUrl: string;
  customUrl: string;
  customFile: File | string;
}

export interface ICustomTip {
  previewTip?: string;
  previewDesc?: string;
  cropTip?: string;
  cropDesc?: string;
}

export type ISelectInfo = Partial<ISelectInfoBase>;

export interface IImageUploadProps {
  visible: boolean;
  initPreview: React.ReactNode; // 图片预览组件
  title?: string;
  fileLimit?: number; // 上传图片大小限制，以MB为单位，比如限制图片裁剪之后大小限制为2MB，则fileLimit传2
  officialImgs?: string[]; // 官方头像列表，传id
  customTips?: ICustomTip; // 自定义 预览区 和 裁剪区 提示文案
  previewShape?: IPreviewShape; // 预览图的形状
  cropShape?: ICropShape;
  cancel: () => void;
  confirm: (data: ISelectInfo) => void;
}

export interface IImageCropUploadRef {
  clearState: () => void;
}

export const ImageCropUpload: FC<IImageUploadProps> = (props, ref) => {
  const {
    visible,
    initPreview,
    children,
    title = t(Strings.choose_picture),
    fileLimit,
    officialImgs,
    customTips = {},
    previewShape = IPreviewShape.Square,
    cropShape = ICropShape.Square,
  } = props;
  const colors = useThemeColors();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const initCropConfig = initCropConfigMap.get(cropShape);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [tabKey, setTabKey] = useState<string>(officialImgs?.length ? TabKeys.Default : TabKeys.Custom);
  const [officialImgToken, setOfficialImgToken] = useState(''); // 官方图片id
  const [upImg, setUpImg] = useState<string>(''); // 上传的最新图片 - url
  const [upImgFile, setUpImgFile] = useState<string | File>(''); // 上传的最新图片 -file格式
  const [crop, setCrop] = useState(initCropConfig); // 图片裁剪信息
  const [previewUrl, setPreviewUrl] = useState<string>(''); // 预览图片
  const [innerControlModal, setInnerControlModal] = useState(false); // 当传入了children参数，此state才生效
  const [isGif, setIsGif] = useState(false);
  const [disabled, setDisabled] = useState(false);
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

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const officialImgClick = (bannerId: string, url: string) => {
    setPreviewUrl(url);
    setOfficialImgToken(bannerId);
    setUpImg('');
    setUpImgFile('');
  };

  const onComplete = (crop, percentCrop) => {
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

  // 绘制任意形状裁剪区域
  const cropAnyView = (image, crop) => {
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

  // 绘制正方形裁剪区域
  const cropSquareView = (image, percentCrop) => {
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

  // 绘制长方形裁剪区域
  const cropRectangleView = (image, percentCrop) => {
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

  const canvasToFile = canvas => {
    canvas.toBlob(blob => {
      if (!blob) {
        new Error('Canvas is empty');
      }
      // 图片预览
      setPreviewUrl(window.URL.createObjectURL(blob));
    }, (upImgFile as File).type);
    const imgBase64 = canvas.toDataURL((upImgFile as File).type, 1);
    const file = dataURLtoFile(imgBase64, (upImgFile as File).name);
    setUpImgFile(file);
  };

  const dataURLtoFile = (urlData, fileName) => {
    const bytes = window.atob(urlData.split(',')[1]); // 去掉url的头，并转换为byte
    const mime = urlData.split(',')[0].match(/:(.*?);/)[1];
    // 处理异常,将ascii码小于0的转换为大于0
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
      // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
      reader.onload = () => {
        const isLt2M = fileLimit ? (file as File).size / 1024 / 1024 > fileLimit : false;
        if (isLt2M) {
          Message.error({ content: t(Strings.image_limit, { number: fileLimit }) });
          setDisabled(true);
          rej();
          return;
        }

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
    props.confirm &&
      props.confirm({
        officialToken: officialImgToken,
        officialUrl: officialImgToken ? getImageThumbSrc(integrateCdnHost(officialImgToken), { method: CutMethod.CUT, size: 480 }) : '',
        customUrl: upImg,
        customFile: upImgFile,
      });
    cancelBtnClick();
  };

  // 取消选择
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
                {upImg || officialImgToken ? (
                  <span className={styles.previewImgWrapper}>
                    <Image src={previewUrl} layout={'fill'} alt={''} />
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
              onChange={key => setTabKey(key)}
            >
              {officialImgs?.length && (
                <TabPane tab={t(Strings.default)} key={TabKeys.Default}>
                  <div className={styles.scrollWrapper}>
                    <div className={styles.banners}>
                      <Row {...rowConfig}>
                        {officialImgs.map(imgToken => {
                          const url = getImageThumbSrc(integrateCdnHost(imgToken), thumbOptions);
                          return (
                            <Col key={imgToken} span={isCropRectangle ? 12 : 8}>
                              <div className={styles.bannerPreviewImg} onClick={() => officialImgClick(imgToken, url)}>
                                <span className={styles.bannerPreviewImgWrapper}>
                                  <Image src={url} alt="vika.cn" layout={'fill'} />
                                </span>
                                {officialImgToken === imgToken && (
                                  <div className={styles.checked}>
                                    <SelectedIcon />
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
                      <ReactCrop src={upImg} onImageLoaded={onLoad} crop={crop} onChange={c => setCrop(c)} onComplete={onComplete} />
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
          <Button size="small" color="primary" onClick={confirmBtnClick} disabled={disabled || !(upImg || officialImgToken)}>
            {t(Strings.confirm)}
          </Button>
        </div>
      </Modal>
    </>
  );
};
