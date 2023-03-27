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

import { Typography, useThemeColors } from '@apitable/components';
import {
  CollaCommandName, ConfigConstant, getMaxViewCountPerSheet, IReduxState, isIdassPrivateDeployment, IViewProperty, PREVIEW_DATASHEET_ID, ResourceType,
  Selectors
} from '@apitable/core';
import classNames from 'classnames';
import { get } from 'lodash';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';
import { NetworkStatus } from 'pc/components/network_status';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { TemplateUseButton } from 'pc/components/template_centre/template_use_button';
// import { ToolHandleType } from 'pc/components/tool_bar/interface';
import { changeView, usePrevious, useSideBarVisible } from 'pc/hooks';
import { useNetwork } from 'pc/hooks/use_network';
import { useViewNameChecker } from 'pc/hooks/use_view_name_checker';
import { resourceService } from 'pc/resource_service';
import { KeyCode, stopPropagation } from 'pc/utils';
import * as React from 'react';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
// import { Display } from '../../tool_bar/display/display';
// import { DescriptionModal } from '../description_modal';
import { TabAddView } from '../tab_add_view';
import styles from './style.module.less';
import { ViewBar } from './view_bar';

export interface ITabStateProps {
  width: number;
}

export type ICustomViewProps = Pick<IViewProperty, 'name' | 'id' | 'type'>;

export const Tab: FC<React.PropsWithChildren<ITabStateProps>> = memo(props => {
  const [editIndex, setEditIndex] = useState<null | number>(null);
  const [viewEditor, setViewEditor] = useState(false);

  const { datasheetId, viewId: activeView, templateId, shareId, embedId } = useSelector(state => state.pageParams);
  const datasheet = useSelector((state: IReduxState) => Selectors.getDatasheet(state));
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const { viewCreatable, editable, iconEditable, renamable } = useSelector((state: IReduxState) => Selectors.getDatasheet(state)?.permissions) || {};
  const embedInfo = useSelector(state => Selectors.getEmbedInfo(state));

  const datasheetName = treeNodesMap[datasheetId!]?.nodeName || datasheet?.name;
  const datasheetIcon = datasheet?.icon;
  const role = datasheet?.role;
  const nodeFavorite = datasheet?.nodeFavorite;
  const views = datasheet?.snapshot.meta.views;
  const isShowViewbar = get(embedInfo, 'viewControl.tabBar', true);
  const isOnlyView = get(embedInfo, 'viewControl.viewId', false);
  const isShowNodeInfoBar = get(embedInfo, 'viewControl.nodeInfoBar', true);

  const { sideBarVisible } = useSideBarVisible();
  const { status } = useNetwork(true, datasheetId!, ResourceType.Datasheet);
  const { errMsg, checkViewName } = useViewNameChecker();
  const colors = useThemeColors();

  useEffect(() => {
    if (!activeView) {
      return;
    }
    const view = views!.find(item => {
      return item.id === activeView;
    });
    if (!view) {
      switchView(null, views![0].id);
    }
    // eslint-disable-next-line
  }, [views]);

  const switchView = (_e: React.MouseEvent | null, id: string) => {
    if (activeView === id) {
      return;
    }
    // View cannot be switched during time machine preview
    if (datasheet?.id === PREVIEW_DATASHEET_ID) {
      return;
    }
    changeView(id);
  };

  const embedOnlyViewName = useMemo(() => {
    if (!views || !get(embedInfo, 'viewControl.viewId', false) || !embedId) return '';
    const view = views.filter(view => view.id === embedInfo.viewControl?.viewId);

    return view.length > 0 ? view[0].name : '';
  }, [views, embedInfo, embedId]);

  const previousEmbedOnlyViewName = usePrevious(embedOnlyViewName);

  useEffect(() => {
    // Avoid initialization phase execution
    if (!previousEmbedOnlyViewName || !embedOnlyViewName) return;
    if (previousEmbedOnlyViewName === embedOnlyViewName) return;
    window.parent.postMessage({
      message: 'changeViewName', data: {
        roomId: datasheetId,
        viewId: activeView,
        viewName: embedOnlyViewName
      }
    }, '*');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedOnlyViewName, previousEmbedOnlyViewName]);

  const handleInputBlur = (e: React.FocusEvent) => {
    const newViewName = (e.target as any).value;

    if (embedOnlyViewName === newViewName) {
      setViewEditor(false);
      return;
    }

    if (!checkViewName(newViewName)) {
      return;
    }

    modifyViewName(newViewName);
    setViewEditor(false);
  };

  const modifyViewName = (name: string) => {
    //@ts-ignore
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ModifyViews,
      data: [
        {
          viewId: activeView!,
          key: 'name',
          value: name
        },
      ],
      datasheetId: datasheetId!,
    });
  };

  const handleInputEnter = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Esc) {
      setViewEditor(false);
      return;
    }
    if (e.keyCode !== KeyCode.Enter) {
      return;
    }
    const newViewName = (e.target as any).value;

    if (embedOnlyViewName === newViewName) {
      setViewEditor(false);
      return;
    }

    if (!checkViewName(newViewName)) {
      return;
    }

    modifyViewName(newViewName);
    setViewEditor(false);
  };

  return (
    <div
      className={styles.nav}
    >
      {
        isOnlyView ?
          <div className={styles.embedTitle}>
            {
              viewEditor && editable ? <>
                <input
                  className={classNames(styles.inputBox, {
                    [styles.error]: errMsg
                  })}
                  type='text'
                  defaultValue={embedOnlyViewName}
                  autoFocus
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputEnter}
                  onDoubleClick={(e: any) => e.stopPropagation()}
                  onClick={(e: any) => e.stopPropagation()}
                  onMouseDown={stopPropagation}
                />
                {
                  errMsg && <Typography component={'span'} variant={'body3'} color={colors.errorColor}>
                    {errMsg}
                  </Typography>
                }

              </> : <p
                onDoubleClick={() => setViewEditor(true)}
              >
                {embedOnlyViewName}
              </p>
            }
          </div> : (
            isShowNodeInfoBar && <div className={styles.nodeName} style={{ paddingLeft: !sideBarVisible ? 16 : '' }}>
              {
                datasheetName && (
                  <NodeInfoBar
                    data={{
                      nodeId: datasheetId!,
                      type: ConfigConstant.NodeType.DATASHEET,
                      icon: datasheetIcon,
                      name: datasheetName,
                      role: role === ConfigConstant.Role.Foreigner && editable ? ConfigConstant.Role.Editor : role,
                      favoriteEnabled: nodeFavorite,
                      nameEditable: renamable,
                      iconEditable: iconEditable,
                    }}
                    hiddenModule={{ favorite: Boolean(shareId || templateId) }}
                  />
                )
              }
            </div>
          )
      }
      {isShowViewbar && !isOnlyView && <ViewBar
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        views={views || []}
        switchView={switchView}
        className={classNames(styles.viewBarWrapper, {
          [styles.embedView]: isOnlyView
        })}
        extra={views && views.length > 0 && viewCreatable && (
          <TabAddView
            viewCount={views ? views.length : 0}
            activityViewId={activeView}
            switchView={switchView}
            setEditIndex={setEditIndex}
            disabled={views && views.length >= getMaxViewCountPerSheet()}
          />
        )}
        {...props}
      />}
      {
        !templateId &&
        <div className={styles.status}>
          <CollaboratorStatus resourceId={datasheetId!} resourceType={ResourceType.Datasheet} />
          <NetworkStatus currentStatus={status} />
        </div>
      }
      {
        templateId && !isIdassPrivateDeployment() &&
        <TemplateUseButton
          block={false}
          style={{ marginRight: 12 }}
          showIcon
        />
      }
    </div>
  );
});
