import { useThemeColors } from '@vikadata/components';
import { isGif, Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import Image from 'next/image';
import { ICropShape } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { getCellValueThumbSrc } from 'pc/utils';
import * as React from 'react';
import { useState } from 'react';
import IconAdd from 'static/icon/common/add_big.svg';
import BannerEditIcon from 'static/icon/datasheet/rightclick/datasheet_icon_rename.svg';
import { ButtonPlus } from '../../../common';
import { IBasePropEditorProps, IModeEnum } from '../interface';
import { IFileType, ImgBaseUploader } from './img_base_uploader';
import styles from './style.module.less';

interface ILogoImgUploaderProps extends IBasePropEditorProps {
  logoUrl?: string;
}

const customTips = {
  cropDesc: t(Strings.custom_upload_tip),
};

export const LogoImgUploader: React.FC<ILogoImgUploaderProps> = props => {
  const colors = useThemeColors();
  const { formId, mode, logoUrl, updateProps } = props;
  const [isModalShow, setModalShow] = useState(false);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const logoSize = isMobile ? 80 : 120;
  const logoAddIconSize = isMobile ? 16 : 32;
  const logoWrapClassName = classnames(styles.logoImgWrapper, isMobile && styles.logoWrapMobile);

  const onChange = (file: any, type: IFileType) => {
    const logoUrl = getCellValueThumbSrc(file, {
      w: logoSize * (window.devicePixelRatio || 1),
      formatToJPG: isGif({ name: file.name, type: file.mimeType }),
    });
    updateProps({ logoUrl });
  };

  return (
    <>
      {mode === IModeEnum.Edit ? (
        <div className={logoWrapClassName}>
          <ImgBaseUploader
            formId={formId}
            visible={isModalShow}
            imgUrl={logoUrl}
            cropShape={ICropShape.Square}
            customTips={customTips}
            setVisible={setModalShow}
            onChange={onChange}
            fileLimit={2}
          >
            <div className={styles.logoImg} onClick={() => setModalShow(true)}>
              {!logoUrl && (
                <div className={classnames(styles.logoPlaceHolder, isMobile && styles.placeholderMobile)}>
                  <IconAdd width={logoAddIconSize} height={logoAddIconSize} fill={colors.fourthLevelText} />
                  <span>{t(Strings.add_form_logo)}</span>
                </div>
              )}
              {logoUrl && <Image src={logoUrl} alt="cover" layout={'fill'} />}
              {logoUrl && (
                <div className={classnames(styles.editBtn, isMobile && styles.editBtnMobile)}>
                  <ButtonPlus.Icon size="small" onClick={() => setModalShow(true)} icon={<BannerEditIcon />} />
                </div>
              )}
            </div>
          </ImgBaseUploader>
        </div>
      ) : (
        logoUrl && (
          <div className={logoWrapClassName}>
            <div className={styles.logoImg}>
              <Image src={logoUrl} alt="cover" layout={'fill'} />
            </div>
          </div>
        )
      )}
    </>
  );
};
