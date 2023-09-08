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

import classnames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { IconButton } from '@apitable/components';
import { CutMethod, getImageThumbSrc, integrateCdnHost, isGif, Settings, Strings, t } from '@apitable/core';
import { EditOutlined } from '@apitable/icons';
import { useGetSignatureAssertByToken } from '@apitable/widget-sdk';
import { ICropShape, IPreviewShape } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { getCellValueThumbSrc } from 'pc/utils';
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

export const CoverImgUploader: React.FC<React.PropsWithChildren<ICoverImgUploaderProps>> = (props) => {
  const { nodeId, mode, coverUrl, updateProps } = props;
  const [isModalShow, setModalShow] = useState(false);
  const officialImgs = Settings.workbench_folder_default_cover_list.value.split(',');
  const _coverImgUrl = coverUrl || getImageThumbSrc(integrateCdnHost(officialImgs[0]), officialImgParams);
  const coverImgUrl = useGetSignatureAssertByToken(_coverImgUrl);
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
      nodeId={nodeId}
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
            <IconButton onClick={() => setModalShow(true)} size="large" variant="background" icon={() => <EditOutlined />} />
          </div>
        )}
      </div>
    </ImgBaseUploader>
  );
};
