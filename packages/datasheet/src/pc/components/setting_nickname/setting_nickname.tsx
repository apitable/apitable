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

import { useMount } from 'ahooks';
import { Form, Input } from 'antd';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, useThemeColors } from '@apitable/components';
import { Api, IReduxState, IUnitValue, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { EditOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, ButtonBase, Emoji, ImageCropUpload, ISelectInfo, IUploadType, Wrapper } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useUserRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { isLocalSite } from 'pc/utils';
import { useQuery } from '../../hooks/use_home';
import { defaultAvatars } from '../navigation/account_center_modal/basic_setting/default_avatar';
import styles from './style.module.less';

const customTips = {
  cropDesc: t(Strings.support_image_formats_limits, { number: 2 }),
};

const SettingNickname: FC<React.PropsWithChildren<unknown>> = () => {
  const query = useQuery();
  const colors = useThemeColors();
  const [avatarSelectModalVisible, setAvatarSelectModalVisible] = useState(false);
  const dispatch = useDispatch();
  const error = useAppSelector((state: IReduxState) => state.user.err);
  const user = useAppSelector((state: IReduxState) => state.user.info);
  const { getLoginStatusReq, customOrOfficialAvatarUpload } = useUserRequest();
  const { loading } = useRequest(getLoginStatusReq);
  const { run: updateAvatar } = useRequest(customOrOfficialAvatarUpload, { manual: true });
  const inviteMailToken = query.get('inviteMailToken');
  const inviteLinkToken = query.get('inviteLinkToken');
  const nodeId = query.get('nodeId');
  const suiteId = query.get('suiteId');
  const defaultName = query.get('defaultName') || '';
  const sourceType = query.get('sourceType') || '';
  const [nickName, setNickName] = useState(defaultName);

  const { run } = useRequest(() => Api.loadOrSearch({ unitIds: user?.unitId }), {
    onSuccess: (res) => {
      const unitInfo = res.data.data[0] as IUnitValue;
      if (!unitInfo.isActive) {
        setNickName(unitInfo.name);
      }
    },
    onError: () => {},
    manual: true,
  });

  useEffect(() => {
    if (user?.nickName) {
      setNickName(user.nickName);
    } else {
      setNickName(sourceType === 'wecomShop' ? defaultName : '');
    }
  }, [user?.nickName, sourceType, defaultName]);

  useEffect(() => {
    if (!loading && !user) {
      Router.push(Navigation.HOME);
    }
    // eslint-disable-next-line
  }, [loading]);

  useMount(() => {
    dispatch(StoreActions.setHomeErr(null));
    if (suiteId) run();
  });

  const changeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      dispatch(StoreActions.setHomeErr(null));
    }
    setNickName(e.target.value);
  };

  const uploadImgConfirm = (data: ISelectInfo) => {
    const { officialToken, customFile } = data;
    if (officialToken) {
      updateAvatar({ token: officialToken });
      return;
    }
    if (!customFile) {
      return;
    }
    updateAvatar({ file: customFile as File });
  };

  async function redirect() {
    const reference = query.get('reference') || localStorage.getItem('reference');
    if (reference) {
      localStorage.removeItem('reference');
      if (isLocalSite(window.location.href, reference)) {
        window.location.href = reference;
        return;
      }
    }

    if (inviteMailToken) {
      const result = await Api.inviteEmailVerify(inviteMailToken);
      const { success, data: info } = result.data;
      if (success && info) {
        const bindResult = await Api.linkInviteEmail(info?.spaceId, info?.inviteEmail);
        if (bindResult.data.success) {
          Router.push(Navigation.WORKBENCH, { params: { spaceId: info?.spaceId }, clearQuery: true });
          return;
        }
      }
    }
    if (inviteLinkToken && nodeId) {
      const result = await Api.linkValid(inviteLinkToken, nodeId);
      const { success, data: info } = result.data;
      if (success && info) {
        const bindResult = await Api.joinViaSpace(inviteLinkToken, nodeId);
        if (bindResult.data.success) {
          Router.push(Navigation.WORKBENCH, { params: { spaceId: info?.spaceId }, clearQuery: true });
          return;
        }
      }
    }
    Router.push(Navigation.HOME);
  }

  const handleSubmit = async () => {
    if (!nickName) {
      await redirect();
      return;
    }
    Api.updateUser({ nickName, init: true }).then(async (res) => {
      const { success, message, code } = res.data;
      if (success) {
        await redirect();
      } else {
        dispatch(
          StoreActions.setHomeErr({
            code,
            msg: message,
          }),
        );
      }
    });
  };

  const renderAvatar = (style?: React.CSSProperties) => {
    if (!user) {
      return;
    }
    return (
      <Avatar
        id={user.memberId}
        src={user.avatar}
        avatarColor={user.avatarColor}
        title={user.nickName}
        size={AvatarSize.Size80}
        className={styles.avatorImg}
        style={style}
      />
    );
  };

  if (loading) {
    return null;
  }

  return (
    <Wrapper>
      <div className={styles.settingNickname}>
        <div className={styles.title}>{t(Strings.setting_nickname_title)}</div>
        <Form className={styles.form} onFinish={handleSubmit}>
          <div className={styles.formContent}>
            <div className={styles.avatarContainer}>
              <Avatar
                id={user?.memberId || ''}
                src={user?.avatar}
                title={user?.nickName || ''}
                size={AvatarSize.Size80}
                className={styles.avatorImg}
              />
              <ButtonBase
                className={styles.editAvatarBtn}
                size="x-small"
                shadow
                shape="circle"
                icon={<EditOutlined color={colors.secondLevelText} />}
                onClick={() => setAvatarSelectModalVisible(true)}
              />
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.subTitle}>{t(Strings.setting_nickname_sub_title)}</div>
              <Input
                className={error ? 'error' : ''}
                value={nickName}
                placeholder={t(Strings.placeholder_input_nickname_with_rules, {
                  minCount: 1,
                  maxCount: 20,
                })}
                ref={function (input) {
                  if (input != null) {
                    input.focus();
                    if (nickName.startsWith(t(Strings.planet_dwellers))) {
                      input.select();
                    }
                  }
                }}
                onChange={changeNickname}
              />
            </div>
          </div>
          <div className={styles.errorMsg}>{error ? error.msg : ''}</div>
          <Button className={styles.submit} onClick={handleSubmit} color="primary" size="large" block>
            <div className={styles.button}>
              <Emoji emoji="airplane" size={18} set="apple" />
              {t(Strings.button_come_on)}
            </div>
          </Button>
        </Form>
        <div className={styles.tip}>{t(Strings.change_nickname_tips)}</div>
        <ImageCropUpload
          type={IUploadType.Avatar}
          avatarName={user?.nickName}
          avatarColor={user?.avatarColor}
          title={t(Strings.upload_avatar)}
          confirm={(data) => uploadImgConfirm(data)}
          visible={avatarSelectModalVisible}
          officialImgs={defaultAvatars}
          initPreview={renderAvatar({ width: '100%', height: '100%' })}
          fileLimit={2}
          cancel={() => {
            setAvatarSelectModalVisible(false);
          }}
          customTips={customTips}
        />
      </div>
    </Wrapper>
  );
};

export default SettingNickname;
