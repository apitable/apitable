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

import { Spin } from 'antd';
import Image from 'next/image';
import * as React from 'react';
import { useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { IReduxState, Strings, t } from '@apitable/core';
import { EditOutlined } from '@apitable/icons';
import { uploadAttachToS3, UploadType } from '@apitable/widget-sdk';
import { Avatar, AvatarSize, AvatarType, IImageCropUploadRef, ImageCropUpload } from 'pc/components/common';
import { ISelectInfo } from 'pc/components/common/image_crop_upload';
import { useChangeLogo } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import AvatarBgImg from 'static/icon/space/space_img_avatarsbj.png';
import styles from './style.module.less';

const customTips = {
  cropDesc: t(Strings.support_image_formats_limits, { number: 2 }),
};

export const ChangeLogo = () => {
  const colors = useThemeColors();
  const ImageCropUploadRef = useRef<IImageCropUploadRef>(null);
  const { spaceInfo, spaceId, spaceResource, userInfo } = useAppSelector(
    (state: IReduxState) => ({
      spaceInfo: state.space.curSpaceInfo,
      spaceId: state.space.activeId || '',
      spaceResource: state.spacePermissionManage.spaceResource,
      userInfo: state.user.info,
    }),
    shallowEqual,
  );

  const [logoLoading, setLogoLoading] = useState(false);

  const cancelChangeLogoModal = () => {
    if (ImageCropUploadRef.current) {
      ImageCropUploadRef.current.clearState();
    }
  };
  const { setLogo, logo } = useChangeLogo(spaceId, cancelChangeLogoModal);
  const confirmChangeLogo = (data: ISelectInfo) => {
    const { customFile } = data;
    setLogoLoading(true);
    return uploadAttachToS3({
      file: customFile as File,
      fileType: UploadType.SpaceLogo,
    }).then((res) => {
      setLogoLoading(false);
      const { success, data } = res.data;
      if (success) {
        setLogo(data.token);
      }
    });
  };

  const renderAvatar = (style?: React.CSSProperties) => {
    if (!userInfo || !spaceInfo) return null;
    return (
      <Avatar
        title={spaceInfo.spaceName}
        size={AvatarSize.Size56}
        id={userInfo!.spaceId}
        src={spaceInfo.spaceLogo}
        type={AvatarType.Space}
        style={style}
      />
    );
  };
  return (
    <div className={styles.logoWrap}>
      <div className={styles.bgWrap}>
        <Image src={AvatarBgImg} alt="" layout={'fill'} objectFit={'contain'} />
      </div>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Spin spinning={Boolean(logoLoading || logo)}>{renderAvatar()}</Spin>
        </div>
        {spaceResource && spaceResource.mainAdmin && (
          <ImageCropUpload
            fileLimit={2}
            visible={Boolean(spaceResource?.mainAdmin)}
            initPreview={renderAvatar({ width: '100%', height: '100%' })}
            customTips={customTips}
            cancel={() => {}}
            confirm={(data) => confirmChangeLogo(data)}
          >
            <div className={styles.editIcon}>
              <EditOutlined color={colors.staticWhite0} />
            </div>
          </ImageCropUpload>
        )}
      </div>
    </div>
  );
};
