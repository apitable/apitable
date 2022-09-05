import { IconButton } from '@vikadata/components';
import { CutMethod, getImageThumbSrc, integrateCdnHost, isGif, Settings, Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import Image from 'next/image';
import { ICropShape, IPreviewShape } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { getCellValueThumbSrc } from 'pc/utils';
import * as React from 'react';
import { useState } from 'react';
import BannerEditIcon from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import { IBasePropEditorProps, IModeEnum } from '../interface';
import { IFileType, ImgBaseUploader } from './img_base_uploader';
import styles from './style.module.less';

interface ICoverImgUploaderProps extends IBasePropEditorProps {
  coverUrl?: string;
}

const officialImgParams = {
  method: CutMethod.CUT,
  w: 1440,
  h: 480,
};

const customTips = {
  previewTip: t(Strings.form_cover_crop_tip),
  previewDesc: t(Strings.form_cover_crop_desc),
  cropTip: t(Strings.form_cover_crop_tip),
  cropDesc: t(Strings.form_cover_crop_desc),
};

export const CoverImgUploader: React.FC<ICoverImgUploaderProps> = props => {
  const { formId, mode, coverUrl, updateProps } = props;
  const [isModalShow, setModalShow] = useState(false);
  const officialImgs = Settings.folder_showcase_banners.value.split(',');
  const coverImgUrl = coverUrl || getImageThumbSrc(integrateCdnHost(officialImgs[0]), officialImgParams);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const onChange = (file: any, type: IFileType) => {
    let coverUrl;

    if (type === IFileType.Custom) {
      coverUrl = getCellValueThumbSrc(file, {
        h: 240 * (window.devicePixelRatio || 1),
        formatToJPG: isGif({ name: file.name, type: file.mimeType }),
      });
    } else {
      coverUrl = getImageThumbSrc(integrateCdnHost(file), officialImgParams);
    }
    updateProps({ coverUrl });
  };

  return (
    <ImgBaseUploader
      formId={formId}
      visible={isModalShow}
      imgUrl={coverImgUrl}
      cropShape={ICropShape.Rectangle}
      previewShape={IPreviewShape.Rectangle}
      officialImgs={officialImgs}
      customTips={customTips}
      setVisible={setModalShow}
      fileLimit={5}
      onChange={onChange}
    >
      <div className={styles.coverImgWrapper}>
        <span className={styles.coverImg}>
          <Image src={coverImgUrl} alt="cover" layout={'fill'} />
        </span>

        {mode === IModeEnum.Edit && (
          <div className={classnames(styles.editBtn, isMobile && styles.editBtnMobile)}>
            <IconButton onClick={() => setModalShow(true)} size="large" variant="background" icon={() => <BannerEditIcon />} />
          </div>
        )}
      </div>
    </ImgBaseUploader>
  );
};
