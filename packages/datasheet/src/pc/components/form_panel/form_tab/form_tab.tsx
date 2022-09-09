import { memo, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { ConfigConstant, IReduxState, Selectors, Navigation, t, Strings, WORKBENCH_SIDE_ID, ResourceType, ViewType } from '@vikadata/core';
import classNames from 'classnames';
import styles from './style.module.less';
import { Tooltip } from 'pc/components/common';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { useSideBarVisible, useResponsive } from 'pc/hooks';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { ToolBar } from './tool_bar';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { ScreenSize } from 'pc/components/common/component_display';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import IconSide from 'static/icon/miniprogram/nav/nav_icon_drawer.svg';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';
import { useSize } from 'ahooks';
import { LinkButton, useThemeColors } from '@vikadata/components';

const HIDDEN_TOOLBAR_RIGHT_LABEL_WIDTH = 816;

const FormTabBase = props => {
  const { sideBarVisible } = useSideBarVisible();
  const colors = useThemeColors();
  const tabRef = useRef<HTMLDivElement>(null);
  const navigationTo = useNavigation();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { setSideBarVisible } = useSideBarVisible();
  const { formId, shareId, templateId } = useSelector(state => state.pageParams);

  const {
    icon,
    name,
    role,
    nodeShared,
    nodeFavorite,
    renamable,
    editable,
    iconEditable,
    datasheetId,
    viewId,
    datasheetName,
    datasheetIcon,
    viewName,
    viewType,
  } = useSelector((state: IReduxState) => {
    const form = Selectors.getForm(state)!;
    const { icon, name, role, nodeShared, nodeFavorite, sourceInfo, permissions } = form;
    const formRelMeta = Selectors.getFormRelMeta(state);
    const { renamable, iconEditable, editable } = permissions;
    const { datasheetId, viewId, datasheetName, datasheetIcon } = sourceInfo;
    let viewName = '',
        viewType = ViewType.Form;
    if (formRelMeta) {
      viewName = formRelMeta.views[0].name;
      viewType = formRelMeta.views[0].type;
    }
    return {
      icon,
      name,
      role,
      nodeShared,
      nodeFavorite,
      renamable,
      editable,
      iconEditable,
      datasheetId,
      viewId,
      datasheetName,
      datasheetIcon,
      viewName,
      viewType,
    };
  }, shallowEqual);
  const spaceId = useSelector(state => state.space.activeId);

  const tabSize = useSize(tabRef);

  const showLabel = tabSize?.width! > HIDDEN_TOOLBAR_RIGHT_LABEL_WIDTH;

  const jumpHandler = () => {
    navigationTo({ path: Navigation.WORKBENCH, params: { spaceId, nodeId: datasheetId, viewId }});
  };
  return (
    <div
      className={classNames(styles.nav, {
        [styles.navMobile]: isMobile,
      })}
      ref={tabRef}
    >
      {isMobile && (
        <div className={styles.sidebar} onClick={() => setSideBarVisible(true)}>
          <IconSide width={20} height={20} fill={colors.defaultBg} />
        </div>
      )}
      {!isMobile && (
        <div className={styles.left} style={{ paddingLeft: !sideBarVisible ? 60 : '' }}>
          <div className={styles.container}>
            <div className={styles.nodeInfo}>
              <NodeInfoBar
                data={{
                  nodeId: formId!,
                  name: name,
                  type: ConfigConstant.NodeType.FORM,
                  icon: icon,
                  role: role === ConfigConstant.Role.Foreigner && editable ? ConfigConstant.Role.Editor : role,
                  favoriteEnabled: nodeFavorite,
                  nameEditable: renamable,
                  iconEditable: iconEditable,
                }}
                hiddenModule={{ favorite: Boolean(shareId || templateId) }}
                style={{ maxWidth: showLabel ? 256 : 120 }}
              />
            </div>
            {/* 来源信息 */}
            {!shareId && !templateId && (
              <div className={styles.sourceInfo}>
                {t(Strings.form_source_text)}：
                <InlineNodeName
                  className={styles.datasheetInfo}
                  nodeId={datasheetId!}
                  nodeName={datasheetName}
                  nodeIcon={datasheetIcon}
                  withIcon
                  iconSize={16}
                  iconEditable={false}
                />
                /
                <Tooltip title={t(Strings.form_to_datasheet_view)}>
                  <span className={styles.viewInfo} onClick={jumpHandler}>
                    <span className={styles.viewIcon}>
                      <ViewIcon width={16} height={16} viewType={viewType} fill={colors.primaryColor} />
                    </span>
                    <span className={styles.viewName}>{viewName}</span>
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 设置 & 分享 */}
      {!templateId && (
        <div
          className={classNames(styles.right, {
            [styles.rightMobile]: isMobile,
          })}
        >
          {!isMobile && <CollaboratorStatus resourceId={formId!} resourceType={ResourceType.Form} />}
          <a href={t(Strings.form_tour_link)} target="_blank" rel="noreferrer">
            <LinkButton component="button" className={styles.tourDesc} underline={false} id={WORKBENCH_SIDE_ID.FORM_USE_GUIDE_BTN}>
              {t(Strings.form_tour_desc)}
            </LinkButton>
          </a>
          {!shareId && editable && <ToolBar nodeShared={nodeShared} showLabel={showLabel} />}
        </div>
      )}
    </div>
  );
};
export const FormTab = memo(FormTabBase, shallowEqual);
