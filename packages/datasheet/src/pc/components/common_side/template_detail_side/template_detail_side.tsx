import { ConfigConstant, integrateCdnHost, Navigation, Settings, Strings, t, TEMPLATE_CENTER_ID, isIdassPrivateDeployment } from '@vikadata/core';
import classNames from 'classnames';
import { Avatar, AvatarSize, AvatarType, Message, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useSideBarVisible, useSpaceInfo } from 'pc/hooks';
import { copy2clipBoard } from 'pc/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import PackupIcon from 'static/icon/workbench/packup.svg';
import OpenupIcon from 'static/icon/workbench/openup.svg';
import BackIcon from 'static/icon/common/common_icon_left_line.svg';
import { TemplateUseButton } from '../../template_centre/template_use_button';
import styles from './style.module.less';
import { useThemeColors, Skeleton, LinkButton } from '@vikadata/components';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { NodeTree } from '../../template_centre/template_detail';

export const TemplateDetailSide: React.FC = () => {
  const colors = useThemeColors();
  const officialLogo = integrateCdnHost(Settings.official_avatar.value);

  const categoryId = useSelector(state => state.pageParams.categoryId);
  const spaceId = useSelector(state => state.space.activeId);
  const templateId = useSelector(state => state.pageParams.templateId);
  const { spaceInfo } = useSpaceInfo(spaceId);

  const navigationTo = useNavigation();
  const goBack = () => {
    navigationTo({ path: Navigation.TEMPLATE, params: { spaceId, categoryId }});
  };

  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const templateDirectory = useSelector(state => state.templateCentre.directory);
  const title = templateDirectory
    ? getSocialWecomUnitName({
      name: templateDirectory.nickName,
      isModified: templateDirectory.isMemberNameModified,
      spaceInfo,
    })
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
      // 无 spaceId 时不存在div.bg, 特殊处理
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
              <BackIcon fill="currentColor" />
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
                }}
              >
                {t(Strings.copy_template_share_link)}
              </LinkButton>
            )}
          </div>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <Tooltip title={!sideBarVisible ? t(Strings.expand_pane) : t(Strings.hide_pane)}>
              <div className={closeBtnClass} style={closeBtnStyles} onClick={handleClick}>
                {!sideBarVisible ? <OpenupIcon width={16} height={16} /> : <PackupIcon width={16} height={16} />}
              </div>
            </Tooltip>
          </ComponentDisplay>
        </>
      )}
    </div>
  );
};
