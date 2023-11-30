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
import classNames from 'classnames';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { Button, LinkButton, stopPropagation, Typography, useThemeColors } from '@apitable/components';
import { hiddenMobile, IReduxState, isIdassPrivateDeployment, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@apitable/icons';
import { Avatar, AvatarSize } from 'pc/components/common/avatar';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { StatusIconFunc } from 'pc/components/common/icon';
import { ImageCropUpload, IPreviewShape, ISelectInfo, IUploadType } from 'pc/components/common/image_crop_upload';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { IUnbindType, UnBindModal } from 'pc/components/navigation/account_center_modal/basic_setting/un_bind_modal';
import { useRequest } from 'pc/hooks/use_request';
import { useUserRequest } from 'pc/hooks/use_user_request';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { defaultAvatars } from './default_avatar';
import { Logout } from './log_out';
import { StepStatus } from './log_out/enum';
import { ModifyEmailModal } from './modify_email_modal';
import { ModifyMobileModal } from './modify_mobile_modal';
import { ModifyNameModal } from './modify_name_modal';
// @ts-ignore
import { getSocialWecomUnitName, isSocialWecom, isWecomFunc } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const customTips = {
  cropDesc: t(Strings.support_image_formats_limits, {
    number: 2,
  }),
};

export const BasicSetting: FC<React.PropsWithChildren<unknown>> = () => {
  const { user, spaceInfo } = useAppSelector(
    (state: IReduxState) => ({
      user: state.user.info,
      spaceInfo: state.space.curSpaceInfo,
    }),
    shallowEqual,
  );
  const isWecomSpace = isSocialWecom?.(spaceInfo);
  const colors = useThemeColors();
  const { customOrOfficialAvatarUpload, getUserCanLogoutReq, updateAvatarColor: _updateAvatarColor } = useUserRequest();
  const [nameModal, setNameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [mobileModal, setMobileModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [unBindModal, setUnBindModal] = useState<null | IUnbindType>(null);
  // const [imgUploadModal] = useState(false);

  // Enterprise Micro Browser + Enterprise Micro Third Party Space Station + Unbound Mobile
  const hiddenMobileRes = isWecomFunc?.() && isWecomSpace && !user!.mobile;
  const env = getEnvVariables();

  const { loading: uploadAvatarLoading, run: updateAvatar } = useRequest(customOrOfficialAvatarUpload, { manual: true });
  const { loading: avatarColorLoading, run: updateAvatarColor } = useRequest(_updateAvatarColor, { manual: true });
  const { run: getUserCanLogout, loading: getUserLoading } = useRequest(getUserCanLogoutReq, { manual: true });

  const dispatch = useDispatch();

  const [logoutStepVisible, setLogoutStepVisible] = useState(false);
  const [step, setStep] = useState(StepStatus.Reading);

  useEffect(() => {
    dispatch(StoreActions.setHomeErr(null));
  }, [nameModal, emailModal, mobileModal, dispatch]);

  const mobileContent = () => {
    if (user!.mobile === undefined || user!.mobile === null) {
      return t(Strings.unbound);
    }
    return hiddenMobile(user!.mobile);
  };
  const renderAvatar = (style?: React.CSSProperties) => {
    if (!user) {
      return;
    }
    const { memberId, avatar, nickName, avatarColor } = user;
    return (
      <Avatar
        id={memberId}
        src={avatar}
        title={nickName}
        avatarColor={avatarColor}
        size={AvatarSize.Size80}
        className={styles.avatorImg}
        style={style}
      />
    );
  };
  const uploadConfirm = (data: ISelectInfo) => {
    const { officialToken, customFile, color } = data;
    if (color != null) {
      updateAvatarColor(color);
      return;
    }
    if (officialToken) {
      updateAvatar({ token: officialToken });
      return;
    }
    if (!customFile) {
      return;
    }
    updateAvatar({ file: customFile as File });
  };

  const unBind = (type: 'mobile' | 'email') => {
    if (!(user?.mobile && user?.email)) {
      Modal.confirm({
        title: t(Strings.can_not_un_bind_title),
        content: t(Strings.can_not_un_bind_content),
      });
      return;
    }
    setUnBindModal(type);
  };

  const handleUserLogout = () => {
    getUserCanLogout().then((res) => {
      const { success, message, code } = res;
      if (!success) {
        if (code === StatusCode.LOG_OUT_UNSATISFIED) {
          Modal.confirm({
            title: t(Strings.kindly_reminder),
            content: <Typography variant="body2">{t(Strings.logout_warning)}</Typography>,
            okButtonProps: {
              color: 'warning',
            },
            cancelButtonProps: {
              className: styles.cancelBtn,
              onClick: (e: React.MouseEvent) => {
                stopPropagation(e);
                window.open(getEnvVariables().ACCOUNT_DELELTE_HELP_URL);
              },
            } as any,
            cancelText: t(Strings.know_how_to_logout),
            closable: false,
            icon: (
              <div className={styles.statusIcon}>
                <StatusIconFunc type="warning" />
              </div>
            ),
          });
          return;
        }

        Message.error({
          content: message,
        });
        return;
      }

      setLogoutStepVisible(true);
      setStep(StepStatus.Reading);
    });
  };

  if (!user) return null;

  const { email, mobile, areaCode, nickName, isNickNameModified, avatarColor } = user;

  const userData = {
    email,
    mobile,
    areaCode,
  };
  const realNickName =
    getSocialWecomUnitName?.({
      name: nickName,
      isModified: isNickNameModified,
      spaceInfo,
    }) || nickName;

  const items = [
    {
      label: user!.mobile ? t(Strings.button_change_phone) : t(Strings.button_bind_now),
      onClick: () => {
        setMobileModal(true);
      },
      visible: !hiddenMobileRes,
    },
    {
      label: t(Strings.un_bind_mobile),
      onClick: () => {
        unBind('mobile');
      },
      visible: user!.mobile,
    },
    {
      label: user!.email ? t(Strings.change_email) : t(Strings.button_bind_now),
      onClick: () => {
        setEmailModal(true);
      },
      visible: true,
    },
    {
      label: t(Strings.un_bind_email),
      onClick: () => {
        unBind('email');
      },
      visible: user!.email,
    },
    {
      label: t(Strings.user_log_out),
      onClick: handleUserLogout,
      visible: true,
    },
  ];

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.basicSettingWrapper}>
          <div className={styles.title}>{t(Strings.user_profile)}</div>
          <div className={styles.setting}>
            <div className={styles.item}>
              <div className={styles.label}>{t(Strings.user_avatar)}:</div>
              <div className={styles.content}>
                <div className={styles.avatar}>
                  <Spin spinning={!nameModal && (uploadAvatarLoading || avatarColorLoading)}>{renderAvatar()}</Spin>
                </div>
              </div>
              <LinkButton component="button" underline={false} className={styles.modifyBtn} onClick={() => setUploadModal(true)}>
                {t(Strings.change_avatar)}
              </LinkButton>
              {uploadModal && (
                <ImageCropUpload
                  type={IUploadType.Avatar}
                  avatarName={nickName}
                  avatarColor={avatarColor}
                  title={t(Strings.upload_avatar)}
                  confirm={(data) => uploadConfirm(data)}
                  visible={uploadModal}
                  officialImgs={defaultAvatars}
                  initPreview={renderAvatar({ width: '100%', height: '100%' })}
                  fileLimit={2}
                  cancel={() => {
                    setUploadModal(false);
                  }}
                  customTips={customTips}
                  previewShape={IPreviewShape.Circle}
                />
              )}
            </div>
            <div className={styles.item}>
              <div className={styles.label}>{t(Strings.personal_nickname)}:</div>
              <div className={styles.content}>{realNickName}</div>
              {!isIdassPrivateDeployment() && (
                <LinkButton component="button" underline={false} onClick={() => setNameModal(true)}>
                  {t(Strings.modal_title_modify_nickname)}
                </LinkButton>
              )}
            </div>
            {!hiddenMobileRes && env.USER_BIND_PHONE_VISIBLE && (
              <div className={styles.item}>
                <div className={styles.label}>{t(Strings.label_bind_phone)}:</div>
                <div className={styles.content}>{mobileContent()}</div>
                {!isIdassPrivateDeployment() && (
                  <>
                    <LinkButton component="button" underline={false} onClick={() => setMobileModal(true)}>
                      {user!.mobile ? t(Strings.button_change_phone) : t(Strings.button_bind_now)}
                    </LinkButton>
                    {user!.mobile && (
                      <LinkButton component="button" underline={false} onClick={() => unBind('mobile')} color={colors.errorColor}>
                        {t(Strings.unbind)}
                      </LinkButton>
                    )}
                  </>
                )}
              </div>
            )}

            <div className={styles.item}>
              <div className={styles.label}>{t(Strings.label_bind_email)}:</div>
              <div className={styles.content}>{user?.email || t(Strings.unbound)}</div>
              {env.USER_EDIT_EMAIL_VISIBLE && (
                <>
                  <LinkButton component="button" underline={false} onClick={() => setEmailModal(true)}>
                    {user!.email ? t(Strings.change_email) : t(Strings.button_bind_now)}
                  </LinkButton>
                  {user!.email && (
                    <LinkButton component="button" underline={false} onClick={() => unBind('email')} color={colors.errorColor}>
                      {t(Strings.unbind)}
                    </LinkButton>
                  )}
                </>
              )}
            </div>
          </div>
          {env.DELETE_ACCOUNT_VISIBLE && (
            <div className={styles.logout}>
              <Button
                loading={getUserLoading}
                color={colors.errorColor}
                style={{
                  background: 'none',
                  color: colors.errorColor,
                }}
                block
                onClick={handleUserLogout}
              >
                {t(Strings.user_log_out)}
              </Button>
            </div>
          )}
        </div>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.mobileSetting}>
          {items
            .filter((_) => _.visible)
            .map(({ onClick, label }) => (
              <div key={label} className={classNames(styles.linkItem)} onClick={onClick}>
                <label className={styles.label}>{label}</label>
                <div className={styles.value}>
                  <ChevronRightOutlined />
                </div>
              </div>
            ))}
        </div>
      </ComponentDisplay>
      {nameModal && <ModifyNameModal setNameModal={setNameModal} originName={nickName} />}
      {emailModal && <ModifyEmailModal setEmailModal={setEmailModal} data={userData} />}
      {mobileModal && <ModifyMobileModal setMobileModal={setMobileModal} data={userData} />}
      {unBindModal && <UnBindModal setUnBindModal={setUnBindModal} unbindType={unBindModal} data={userData} />}
      {logoutStepVisible && <Logout userData={userData} step={step} setStep={setStep} />}
    </>
  );
};
