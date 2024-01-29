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
import * as React from 'react';
import { LinkButton, Skeleton, useThemeColors } from '@apitable/components';
import { ConfigConstant, integrateCdnHost, isIdassPrivateDeployment, Navigation, Strings, t, TEMPLATE_CENTER_ID } from '@apitable/core';
import { ChevronLeftOutlined, Collapse2OpenOutlined, Collapse2Outlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Avatar, AvatarSize, AvatarType, Message, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useSideBarVisible, useSpaceInfo } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { NodeTree } from '../../template_centre/template_detail';
import { TemplateUseButton } from '../../template_centre/template_use_button';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export const TemplateDetailSide: React.FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const officialLogo = integrateCdnHost(getEnvVariables().SYSTEM_CONFIGURATION_OFFICIAL_AVATAR!);

  const categoryId = useAppSelector((state) => state.pageParams.categoryId);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const templateId = useAppSelector((state) => state.pageParams.templateId);
  const { spaceInfo } = useSpaceInfo(spaceId);

  const goBack = () => {
    const uncategorized = categoryId === ConfigConstant.TEMPLATE_UNCATEGORIZED;
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        categoryId: uncategorized ? undefined : categoryId,
      },
    });
  };

  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const templateDirectory = useAppSelector((state) => state.templateCentre.directory);
  const title = templateDirectory
    ? getSocialWecomUnitName?.({
      name: templateDirectory.nickName,
      isModified: templateDirectory.isMemberNameModified,
      spaceInfo,
    }) || templateDirectory.nickName
    : '';

  const isOfficial = categoryId !== 'tpcprivate';

  const shareTemplate = () => {
    const { origin } = window.location;
    copy2clipBoard(`${origin}/template/${categoryId}/${templateId}`, () => Message.success({ content: t(Strings.shared_link_copied) }));
  };

  const handleClick = () => {
    setSideBarVisible(!sideBarVisible);
  };

  const closeBtnClass = classNames({
    [styles.closeBtn]: true,
    [styles.isPanelClose]: !sideBarVisible,
  });

  const closeBtnStyles: React.CSSProperties = {};
  if (templateId) {
    closeBtnStyles.top = '26px';
  }

  return (
    <div
      className={styles.left}
      style={{
        backgroundColor: spaceId ? 'unset' : colors.blackBlue[900],
      }}
    >
      {!templateDirectory && (
        <div style={{ padding: '0 16px', width: '100%', height: '100%' }}>
          <Skeleton className={styles.categoryName} />
          <div className={styles.creator}>
            <Skeleton image circle style={{ width: '80px', height: '80px' }} />
            <Skeleton count={2} width="100%" />
          </div>
          <Skeleton count={1} width="38%" />
          <Skeleton count={2} />
          <Skeleton count={1} width="61%" />
        </div>
      )}
      {templateDirectory && (
        <>
          <div className={styles.categoryName}>
            <div className={styles.goBackWrapper} onClick={goBack}>
              <ChevronLeftOutlined color="currentColor" />
              <span>
                {t(Strings.template_go_back, {
                  category:
                    categoryId === ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID
                      ? t(Strings.template_recommend_title)
                      : templateDirectory.categoryName
                        ? templateDirectory.categoryName
                        : t(Strings.space_template),
                })}
              </span>
            </div>
          </div>
          <div className={styles.creator}>
            <Avatar
              size={AvatarSize.Size80}
              id={templateDirectory.uuid || 'VIKA'}
              title={t(Strings.official_name)}
              src={templateDirectory.uuid ? templateDirectory.avatar : officialLogo}
              type={AvatarType.Member}
              className={styles.avatar}
            />
            <div className={styles.nickName}>{templateDirectory.uuid ? title || templateDirectory.nickName : t(Strings.official_name)}</div>
            <div className={styles.spaceName}>
              {templateDirectory.uuid ? templateDirectory.spaceName : t(Strings.official_template_centre_description)}
            </div>
          </div>
          <div className={styles.templateName}>{templateDirectory.templateName}</div>
          <div className={styles.treeWrapper}>{templateDirectory.nodeTree && <NodeTree nodeTree={templateDirectory.nodeTree} />}</div>
          <div className={styles.buttonGroup}>
            {(!isIdassPrivateDeployment() || spaceId) && <TemplateUseButton id={TEMPLATE_CENTER_ID.USE_TEMPLATE_BTN} style={{ width: '200px' }} />}
            {isOfficial && (
              <LinkButton
                underline={false}
                onClick={shareTemplate}
                style={{
                  color: colors.blackBlue[50],
                  marginTop: 16,
                }}
              >
                {t(Strings.copy_template_share_link)}
              </LinkButton>
            )}
          </div>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Tooltip title={!sideBarVisible ? t(Strings.expand_pane) : t(Strings.hide_pane)}>
              <div className={closeBtnClass} style={closeBtnStyles} onClick={handleClick}>
                {!sideBarVisible ? <Collapse2OpenOutlined size={16} /> : <Collapse2Outlined size={16} />}
              </div>
            </Tooltip>
          </ComponentDisplay>
        </>
      )}
    </div>
  );
};
