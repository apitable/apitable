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

import { LinkButton, useThemeColors } from '@apitable/components';
import { ConfigConstant, IReduxState, Navigation, ResourceType, Selectors, Strings, t, ViewType, WORKBENCH_SIDE_ID } from '@apitable/core';
import { ListOutlined } from '@apitable/icons';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import { Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';
import { Router } from 'pc/components/route_manager/router';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { useResponsive, useSideBarVisible } from 'pc/hooks';
import { memo, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import styles from './style.module.less';
import { ToolBar } from './tool_bar';

const HIDDEN_TOOLBAR_RIGHT_LABEL_WIDTH = 816;

const FormTabBase = () => {
  const { sideBarVisible } = useSideBarVisible();
  const colors = useThemeColors();
  const tabRef = useRef<HTMLDivElement>(null);
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
    Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: datasheetId, viewId }});
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
          <ListOutlined size={20} color={colors.defaultBg} />
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
            {/* Source information */}
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
                      <ViewIcon size={16} viewType={viewType} color={colors.primaryColor} />
                    </span>
                    <span className={styles.viewName}>{viewName}</span>
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Setup & Share */}
      {!templateId && (
        <div
          className={classNames(styles.right, {
            [styles.rightMobile]: isMobile,
          })}
        >
          {!isMobile && <CollaboratorStatus resourceId={formId!} resourceType={ResourceType.Form} />}
          <a href={t(Strings.form_tour_link)} target='_blank' rel='noreferrer'>
            <LinkButton component='button' className={styles.tourDesc} underline={false} id={WORKBENCH_SIDE_ID.FORM_USE_GUIDE_BTN}>
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
