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

import classNames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { Button, IconButton, Tooltip, useThemeColors } from '@apitable/components';
import { ConfigConstant, IWidgetPackage, ResourceType, Strings, t, WidgetInstallEnv, WidgetPackageStatus, WidgetReleaseType } from '@apitable/core';
import { AddOutlined, LinkOutlined, MoreOutlined } from '@apitable/icons';
import { useGetSignatureAssertByToken } from '@apitable/widget-sdk';
import { Avatar, AvatarSize, Message, UserCardTrigger } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { InstallPosition } from 'pc/components/widget/widget_center/enum';
import { installToDashboard, installToPanel, installWidget } from 'pc/components/widget/widget_center/install_utils';
import { IWidgetPackageItemBase } from 'pc/components/widget/widget_center/interface';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';

import { useResourceManageable } from '../hooks';
import { WrapperTooltip } from '../widget_panel/widget_panel_header';
import { expandReviewInfo } from './review_info';
import styles from './style.module.less';

type IWidgetPackageItemProps = IWidgetPackage & IWidgetPackageItemBase;

const WidgetPackageItemBase = (props: IWidgetPackageItemProps) => {
  const {
    cover: _cover,
    name,
    releaseType,
    description,
    widgetPackageId,
    installPosition,
    onModalClose,
    authorIcon,
    authorName,
    icon,
    showMenu,
    status,
    ownerUuid,
    ownerMemberId,
    extras,
    version,
    installEnv,
  } = props;
  const colors = useThemeColors();
  const isOwner = useAppSelector((state) => state.user.info?.uuid === ownerUuid);
  const { dashboardId, datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const spacePermission = useAppSelector((state) => state.spacePermissionManage.spaceResource?.permissions || []);
  const [installing, setInstalling] = useState(false);
  const manageable = useResourceManageable();
  const cover = useGetSignatureAssertByToken(_cover);
  const toInstallWidget = async (widgetPackageId: string) => {
    const nodeId = installPosition === InstallPosition.WidgetPanel ? (mirrorId || datasheetId)! : dashboardId!;
    setInstalling(true);
    try {
      const widget = await installWidget(widgetPackageId, nodeId, name);
      setInstalling(false);
      Message.success({
        content: t(Strings.add_widget_success),
      });
      if (installPosition === InstallPosition.WidgetPanel) {
        await installToPanel(widget, nodeId, mirrorId ? ResourceType.Mirror : ResourceType.Datasheet);
        onModalClose(widget.id);
        return;
      }
      await installToDashboard(widget, nodeId);
      onModalClose(widget.id);
    } catch (e) {
      setInstalling(false);
    }
  };

  // Check before installing the widget, distinguish between the space station and the official different interactions.
  const installWidgetPre = (widgetPackageId: string) => {
    if (getDisabledStatus()) {
      return;
    }

    if (releaseType === WidgetReleaseType.Space) {
      Modal.confirm({
        type: 'warning',
        title: t(Strings.widget_center_install_modal_title),
        width: 400,
        content: <div className={styles.spaceWidgetInfoContent}>{t(Strings.widget_center_install_modal_content)}</div>,
        okText: t(Strings.confirm),
        cancelText: t(Strings.cancel),
        onOk: () => toInstallWidget(widgetPackageId),
        okButtonProps: { className: styles.warningBtn, color: colors.warningColor, size: 'small' },
        cancelButtonProps: { size: 'small' },
      });
      return;
    }
    toInstallWidget(widgetPackageId);
  };

  // Check if the environment supports.
  const onClickInstall = () => {
    const installPosToEnvMap = {
      [InstallPosition.WidgetPanel]: WidgetInstallEnv.Panel,
      [InstallPosition.Dashboard]: WidgetInstallEnv.Dashboard,
    };

    if (installEnv && installEnv.length > 0 && !installEnv.includes(installPosToEnvMap[installPosition])) {
      Modal.confirm({
        type: 'warning',
        title: t(Strings.widget_install_error_title),
        width: 400,
        content: t(Strings.widget_install_error_env, {
          errorEnv: installPosition === InstallPosition.Dashboard ? t(Strings.dashboard) : t(Strings.widget_panel),
          expectEnv: installPosition !== InstallPosition.Dashboard ? t(Strings.dashboard) : t(Strings.widget_panel),
        }),
        okText: t(Strings.confirm),
        okButtonProps: { className: styles.warningBtn, color: colors.warningColor, size: 'small' },
      });
      return;
    }
    installWidgetPre(widgetPackageId);
  };

  const getDisabledStatus = () => {
    if (installPosition === InstallPosition.Dashboard && status === WidgetPackageStatus.Developing) {
      return true;
    }

    return !manageable;
  };

  const InstallButton = () => {
    return (
      <WrapperTooltip style={{ width: '100%' }} wrapper={getDisabledStatus()} tip={t(Strings.no_permission_add_widget)}>
        <Button
          color="primary"
          prefixIcon={<AddOutlined size={12} color={colors.staticWhite0} />}
          onClick={onClickInstall}
          loading={installing}
          disabled={getDisabledStatus()}
          size="small"
          block
        >
          {t(Strings.install_widget)}
        </Button>
      </WrapperTooltip>
    );
  };

  const isReview = releaseType === WidgetReleaseType.Preview;

  const VikaWidgetPackageItem = () => (
    <div className={styles.widgetPackageItem}>
      <div className={styles.imgBox}>
        <img src={cover} className={styles.headImg} alt={''} onClick={() => isReview && expandReviewInfo(props)} />
        <div className={styles.authorIconWrap}>
          <div className={styles.arcBoxLeft} />
          <div className={styles.avatarWrap}>
            <Avatar className={styles.avatar} style={{ border: 0 }} id={icon} src={icon} title={authorName} size={AvatarSize.Size24} />
          </div>
          <div className={styles.arcBoxRight} />
        </div>
        {extras?.website && !getEnvVariables().IS_SELFHOST && (
          <Tooltip content={t(Strings.widget_homepage_tooltip)} placement="top-center">
            <a href={extras?.website} target="_blank" className={styles.website} rel="noreferrer">
              <IconButton className={styles.iconButton} icon={() => <LinkOutlined color={'#696969'} />} variant="background" />
            </a>
          </Tooltip>
        )}
      </div>
      <div className={styles.itemContent}>
        <h3>{name}</h3>
        <p>{description}</p>
        {!getEnvVariables().IS_SELFHOST && (
          <div className={styles.developerWrap}>
            <span>{t(Strings.widget_center_publisher)}</span>
            <div className={styles.avatarWrap}>
              <Avatar style={{ border: 0 }} id={authorIcon} src={authorIcon} title={authorName} size={AvatarSize.Size20} />
            </div>
            <span>{authorName}</span>
          </div>
        )}
        {isReview && <div>{version}</div>}
        <InstallButton />
      </div>
    </div>
  );
  const ReactMoreOutlined = () => <MoreOutlined size={16} color={colors.thirdLevelText} className={styles.rotateIcon} />;

  const SpaceWidgetPackageItem = () => (
    <div className={classNames(styles.widgetPackageItem, styles.widgetPackageItemSpace)}>
      <div className={styles.headerBox}>
        <span className={styles.widgetIcon}>
          <Image layout={'fill'} src={icon} alt="" />
        </span>
        <h3>{name}</h3>
        {(isOwner || spacePermission.includes(ConfigConstant.PermissionCode.MANAGE_WIDGET)) && (
          <IconButton
            className={styles.hoverShow}
            icon={ReactMoreOutlined}
            onClickCapture={(e) =>
              showMenu &&
              showMenu(e, {
                widgetPackageId,
                widgetPackageName: name,
                authorName,
                ownerMemberId,
              })
            }
          />
        )}
      </div>
      <p className={styles.spaceWidgetDesc}>{description}</p>
      <div className={styles.developerWrap}>
        <span>{t(Strings.widget_center_publisher)}</span>
        <UserCardTrigger
          popupAlign={{
            points: ['bl', 'tl'],
            offset: [0, -8],
          }}
          userId={ownerUuid}
          permissionVisible={false}
        >
          <div className={styles.triggerWrap}>
            <div className={styles.avatarWrap}>
              <Avatar style={{ border: 0 }} id={ownerUuid} src={authorIcon} title={authorName} size={AvatarSize.Size20} />
            </div>
            <span>{authorName}</span>
          </div>
        </UserCardTrigger>
      </div>
      <InstallButton />
    </div>
  );

  return releaseType === WidgetReleaseType.Global || isReview ? <VikaWidgetPackageItem /> : <SpaceWidgetPackageItem />;
};

export const WidgetPackageItem = React.memo(WidgetPackageItemBase);
