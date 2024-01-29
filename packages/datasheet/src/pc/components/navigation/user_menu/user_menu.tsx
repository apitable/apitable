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

import { useClickAway, useMount } from 'ahooks';
import { Input, Spin } from 'antd';
import classNames from 'classnames';
import dd from 'dingtalk-jsapi';
import { AnimationItem } from 'lottie-web/index';
import Image from 'next/image';
import * as React from 'react';
import { FC, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Button, useThemeColors } from '@apitable/components';
import { ConfigConstant, Events, hiddenMobile, IReduxState, isIdassPrivateDeployment, NAV_ID, Player, Selectors, Strings, t } from '@apitable/core';
import { ChevronRightOutlined, CopyOutlined, EditOutlined, LogoutOutlined, UserOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Avatar, AvatarSize, ImageCropUpload, Message, Modal, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { IPreviewShape, ISelectInfo, IUploadType } from 'pc/components/common/image_crop_upload';
import { useRequest, useUserRequest } from 'pc/hooks';
import { usePlatform } from 'pc/hooks/use_platform';
import { NotificationStore } from 'pc/notification_store';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import Vikaji from 'static/icon/common/vikaji.png';
import AnimationJson from 'static/json/invite_box_filled.json';
import { defaultAvatars } from '../account_center_modal/basic_setting/default_avatar';
// @ts-ignore
import { getDingtalkConfig } from 'enterprise/dingtalk/utils/index';
// @ts-ignore
import { clearWizardsData } from 'enterprise/guide/utils';
import {
  getSocialWecomUnitName,
  inSocialApp,
  isSocialDingTalk,
  isSocialFeiShu,
  isSocialPlatformEnabled,
  isSocialWecom,
  isWecomFunc,
  // @ts-ignore
} from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export interface IUserMenuProps {
  setShowUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAccountCenter: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInviteCode: React.Dispatch<React.SetStateAction<boolean>>;
}

(() => {
  if (!process.env.SSR) {
    window['dd'] = dd;
  }
})();

const customTips = {
  cropDesc: t(Strings.support_image_formats_limits, { number: 2 }),
};

export const UserMenu: FC<React.PropsWithChildren<IUserMenuProps>> = (props) => {
  const colors = useThemeColors();
  const { IS_ENTERPRISE } = getEnvVariables();
  const { ACCOUNT_LOGOUT_VISIBLE, USER_BIND_PHONE_VISIBLE, IS_SELFHOST, IS_APITABLE } = getEnvVariables();
  const { userInfo, spaceId, spaceInfo, unitMap } = useAppSelector(
    (state: IReduxState) => ({
      userInfo: state.user.info,
      spaceId: state.space.activeId || '',
      spaceInfo: state.space.curSpaceInfo,
      unitMap: Selectors.getUnitMap(state),
      themeName: state.theme,
    }),
    shallowEqual,
  );
  const isWecomSpace = isSocialWecom?.(spaceInfo);
  const [inEditName, setInEditName] = useState(false);
  const [nameLengthErr, setNameLengthErr] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const { signOutReq, editOwnerMemberName, customOrOfficialAvatarUpload, updateAvatarColor: _updateAvatarColor } = useUserRequest();
  const { loading: avatarLoading, run: updateAvatar } = useRequest(customOrOfficialAvatarUpload, { manual: true });
  const { loading: avatarColorLoading, run: updateAvatarColor } = useRequest(_updateAvatarColor, { manual: true });
  const lottieAnimate = useRef<AnimationItem>();

  const renderLottie = () => {
    const el = document.querySelector('#' + NAV_ID.USER_MENU_INVITE_ICON)!;
    if (!isMobile && el && !el.hasChildNodes()) {
      import('lottie-web/build/player/lottie_svg').then((module) => {
        const lottie = module.default;
        lottieAnimate.current = lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: 1,
          autoplay: true,
          animationData: AnimationJson,
        });
      });
    }
  };

  useMount(() => {
    if (userInfo?.isNewComer) {
      clearWizardsData?.();
      Player.doTrigger(Events.datasheet_user_menu);
    }
    renderLottie();
  });

  const openUserCenter = () => {
    if (inSocialApp?.(2)) {
      try {
        getDingtalkConfig(spaceId);
      } catch (e) {
        console.warn('get dingtalk config error');
      }
    }
    props.setShowUserMenu(false);
    props.setShowAccountCenter(true);
  };
  const userMenuRef = useRef(null);

  const signOut = () => {
    props.setShowUserMenu(false);
    if (isIdassPrivateDeployment()) {
      localStorage.setItem('spaceId', spaceId);
    }
    signOutReq().then(() => {
      resourceService.instance!.destroy();
      NotificationStore.destroy();
    });
  };
  const editNameClick = () => {
    if (isIdassPrivateDeployment()) {
      return;
    }
    if (spaceInfo && isSocialPlatformEnabled?.(spaceInfo) && !isSocialDingTalk?.(spaceInfo) && !isSocialFeiShu?.(spaceInfo) && !isWecomSpace) {
      Modal.warning({
        title: t(Strings.kindly_reminder),
        content: t(Strings.third_party_edit_space_name_err),
      });
      return;
    }
    setInEditName(true);
  };
  const onPressEnter = (e: any) => {
    if (nameLengthErr) {
      return;
    }
    setInEditName(false);
    if (!nameLengthErr && e.target.value !== userInfo!.memberName) {
      editOwnerMemberName(e.target.value, unitMap && userInfo && unitMap[userInfo?.unitId], true);
    }
    setNameLengthErr(false);
  };
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > ConfigConstant.MEMBER_NAME_LENGTH) {
      !nameLengthErr && setNameLengthErr(true);
    } else {
      nameLengthErr && setNameLengthErr(false);
    }
  };
  useClickAway(() => {
    if (!uploadModal) {
      props.setShowUserMenu(false);
    }
  }, userMenuRef);

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
  const copySuccess = () => {
    Message.success({ content: t(Strings.copy_success) });
  };

  const getInviteCodeUrl = () => {
    const url = new URL(window.location.origin);
    if (userInfo?.inviteCode) {
      url.searchParams.append('inviteCode', userInfo.inviteCode);
      return url.href;
    }
    return '';
  };

  const cancelChangeAvatar = () => {
    setTimeout(() => {
      setUploadModal(false);
    }, 0);
  };

  const PrivacyItem = ({ label, onClick }: { label: string; onClick: (e: React.MouseEvent) => void }) => (
    <div className={classNames(styles.centerItem, styles.inviteItem, styles.linkItem)} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueWrapper}>
        <ChevronRightOutlined />
      </div>
    </div>
  );

  const _isMobileApp = isMobileApp();
  const linkToPrivacyPolicy = _isMobileApp ? Strings.privacy_policy_title : getEnvVariables().PRIVACY_POLICY_URL;
  const linkToTermsOfService = _isMobileApp ? Strings.terms_of_service_title : getEnvVariables().SERVICE_AGREEMENT_URL;

  const items = [
    {
      label: t(Strings.privacy_policy_pure_string),
      onClick: () => window.open(linkToPrivacyPolicy),
      visible: !getEnvVariables().IS_SELFHOST,
    },
    {
      label: t(Strings.terms_of_service_pure_string),
      onClick: () => window.open(linkToTermsOfService),
      visible: !getEnvVariables().IS_SELFHOST,
    },
    {
      label: t(Strings.user_center),
      onClick: openUserCenter,
      visible: true,
    },
    {
      label: t(Strings.user_feedback),
      onClick: async () => {
        try {
          await (window as any).WebViewJavascriptBridge.callHandler(
            ConfigConstant.JSBridgeMethod.OpenAppFeedback,
            JSON.stringify({
              userId: userInfo?.userId || '',
            }),
          );
        } catch (e) {
          console.warn(e);
        }
      },
      visible: isMobileApp(),
    },
  ];

  const { mobile: isMobile } = usePlatform();
  if (!userInfo) return null;
  const { avatar, avatarColor, nickName, memberId, memberName, spaceName, mobile, email, inviteCode, isMemberNameModified } = userInfo;
  const realMemberName =
    getSocialWecomUnitName?.({
      name: memberName,
      isModified: isMemberNameModified,
      spaceInfo,
    }) || memberName;
  // Enterprise Micro Browser + Enterprise Micro Third Party Space Station + Unbound Mobile
  const hiddenMobileRes = isWecomFunc?.() && isWecomSpace && !mobile;

  return (
    <div className={styles.userMenuWrapper} ref={userMenuRef}>
      <div className={styles.userMenuTop}>
        <div
          onClick={() => {
            setUploadModal(true);
          }}
          className={styles.avatarWrap}
        >
          <Spin spinning={avatarLoading || avatarColorLoading}>
            <Avatar
              id={memberId}
              avatarColor={avatarColor}
              src={avatar}
              title={nickName}
              size={AvatarSize.Size64}
              style={{
                border: `1px solid ${colors.textStaticPrimary}`,
              }}
            />
          </Spin>
          <div className={styles.svgWrap}>
            <EditOutlined color={colors.black[50]} />
          </div>
        </div>
        {uploadModal && (
          <ImageCropUpload
            type={IUploadType.Avatar}
            avatarName={nickName}
            avatarColor={avatarColor}
            title={t(Strings.upload_avatar)}
            confirm={(data) => uploadConfirm(data)}
            visible={uploadModal}
            officialImgs={defaultAvatars}
            initPreview={
              <Avatar
                id={memberId}
                src={avatar}
                title={memberName}
                style={{ height: '100%', width: '100%' }}
                isGzip={false}
                size={AvatarSize.Size120}
              />
            }
            fileLimit={2}
            cancel={cancelChangeAvatar}
            customTips={customTips}
            previewShape={IPreviewShape.Circle}
          />
        )}
        <div className={styles.topRight}>
          <div className={styles.name} onClick={editNameClick}>
            <Tooltip
              title={t(Strings.user_menu_tooltip_member_name, {
                spaceName,
              })}
              textEllipsis
            >
              <span>{realMemberName}</span>
            </Tooltip>
            {!isIdassPrivateDeployment() && (
              <button className={styles.editNameButton}>
                <EditOutlined currentColor />
              </button>
            )}
            {inEditName && (
              <Tooltip title={t(Strings.member_err)} placement="top" visible={nameLengthErr}>
                <Input
                  defaultValue={memberName}
                  className={classNames(styles.input, {
                    [styles.err]: nameLengthErr,
                  })}
                  size="small"
                  autoFocus
                  onChange={inputChange}
                  onPressEnter={onPressEnter}
                  onBlur={onPressEnter}
                />
              </Tooltip>
            )}
          </div>
          <Tooltip title={spaceName} textEllipsis>
            <div className={styles.space}>{spaceName}</div>
          </Tooltip>
          {isMobile && (
            <div className={styles.idWrap}>
              <span className={styles.label}>{t(Strings.space_id)}</span>
              <span className={styles.valueWrap}>
                <span className={styles.value}>{spaceId}</span>
                <span className={classNames(styles.copy, styles.bgIsPrimary)} onClick={() => copy2clipBoard(spaceId, copySuccess)}>
                  <CopyOutlined />
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.userMenuCenter}>
        <div className={styles.menuListWrapper}>
          <div className={styles.centerTitle}>{t(Strings.personal_info)}</div>
          {!hiddenMobileRes && USER_BIND_PHONE_VISIBLE && (
            <div className={styles.centerItem}>
              <span className={styles.label}>{t(Strings.phone_number)}</span>
              {mobile ? hiddenMobile(mobile) : t(Strings.unbound)}
            </div>
          )}
          <div className={styles.centerItem}>
            <span className={styles.label}>{t(Strings.email)}</span>
            {email || t(Strings.unbound)}
          </div>

          {IS_ENTERPRISE && !isWecomSpace && !(IS_SELFHOST || IS_APITABLE) && inviteCode && (
            <div className={classNames(styles.centerItem, styles.inviteItem)}>
              <span className={styles.label}>{t(Strings.personal_invite_code_usercenter)}</span>
              <div className={styles.valueWrapper}>
                <div>
                  {inviteCode}
                  <span className={classNames(styles.copy, styles.bgIsWhite)} onClick={() => copy2clipBoard(getInviteCodeUrl(), copySuccess)}>
                    <CopyOutlined />
                  </span>
                </div>
              </div>
            </div>
          )}
          {isMobile && items.filter((item) => item.visible).map((item) => <PrivacyItem key={item.label} label={item.label} onClick={item.onClick} />)}
          {!isMobile && !isMobileApp() && !isWecomSpace && !(IS_SELFHOST || IS_APITABLE) && IS_ENTERPRISE && (
            <div className={styles.inviteCodeBtnWrap}>
              <div
                className={styles.inviteCodeBtn}
                onClick={() => {
                  props.setShowUserMenu(false);
                  props.setShowInviteCode(true);
                }}
              >
                <span id={NAV_ID.USER_MENU_INVITE_ICON} className={styles.inviteIcon} />
                {t(Strings.invite_code_get_v_coin)}
              </div>
            </div>
          )}
        </div>
        {!isWecomSpace && !(IS_SELFHOST || IS_APITABLE) && IS_ENTERPRISE && (
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <div className={styles.centerTip}>
              <span>{t(Strings.invitation_code_usage_tip)}</span>
              <Image src={Vikaji} alt="vikaji" width={36} height={36} />
            </div>
          </ComponentDisplay>
        )}
      </div>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div className={styles.userMenuBottom}>
          <div className={styles.userMenuItem} onClick={openUserCenter}>
            <UserOutlined className={styles.icon} />
            <div className={styles.name}>{t(Strings.user_center)}</div>
          </div>
          {!inSocialApp?.() && (
            <div className={styles.userMenuItem} onClick={signOut}>
              <LogoutOutlined className={styles.icon} />
              <div className={styles.name}>{t(Strings.logout)}</div>
            </div>
          )}
        </div>
      </ComponentDisplay>
      {!inSocialApp?.() && ACCOUNT_LOGOUT_VISIBLE && (
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <div className={styles.btnWrap}>
            <Button variant="jelly" onClick={signOut} block size="large">
              {t(Strings.logout)}
            </Button>
          </div>
        </ComponentDisplay>
      )}
    </div>
  );
};
