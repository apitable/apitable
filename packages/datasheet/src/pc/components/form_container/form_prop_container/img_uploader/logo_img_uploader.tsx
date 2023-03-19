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

import { useThemeColors } from '@apitable/components';
import { isGif, Strings, t } from '@apitable/core';
import { AddOutlined, EditOutlined } from '@apitable/icons';
import classnames from 'classnames';
import Image from 'next/image';
import { ICropShape } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { getCellValueThumbSrc } from 'pc/utils';
import * as React from 'react';
import { useState } from 'react';
import { ButtonPlus } from '../../../common';
import { IBasePropEditorProps, IModeEnum } from '../interface';
import { ImgBaseUploader } from './img_base_uploader';
import styles from './style.module.less';

interface ILogoImgUploaderProps extends IBasePropEditorProps {
  logoUrl?: string;
}

const customTips = {
  cropDesc: t(Strings.custom_upload_tip),
};

export const LogoImgUploader: React.FC<React.PropsWithChildren<ILogoImgUploaderProps>> = props => {
  const colors = useThemeColors();
  const { formId, mode, logoUrl, updateProps } = props;
  const [isModalShow, setModalShow] = useState(false);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const logoSize = isMobile ? 80 : 120;
  const logoAddIconSize = isMobile ? 16 : 32;
  const logoWrapClassName = classnames(styles.logoImgWrapper, isMobile && styles.logoWrapMobile);

  const onChange = (file: any) => {
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
                  <AddOutlined size={logoAddIconSize} color={colors.fourthLevelText} />
                  <span>{t(Strings.add_form_logo)}</span>
                </div>
              )}
              {logoUrl && <Image src={logoUrl} alt="cover" layout={'fill'} />}
              {logoUrl && (
                <div className={classnames(styles.editBtn, isMobile && styles.editBtnMobile)}>
                  <ButtonPlus.Icon size="small" onClick={() => setModalShow(true)} icon={<EditOutlined />} />
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
