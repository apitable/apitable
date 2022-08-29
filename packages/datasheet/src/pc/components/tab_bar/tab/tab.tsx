import {
  ConfigConstant, IReduxState, IViewProperty, ResourceType,
  Selectors, getMaxViewCountPerSheet, PREVIEW_DATASHEET_ID,
  isIdassPrivateDeployment
} from '@vikadata/core';
import { NetworkStatus } from 'pc/components/network_status';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { TemplateUseButton } from 'pc/components/template_centre/template_use_button';
// import { ToolHandleType } from 'pc/components/tool_bar/interface';
import { changeView, useSideBarVisible } from 'pc/hooks';
import { useNetwork } from 'pc/hooks/use_network';
import { FC, memo, useState, useEffect } from 'react';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
// import IconOption from 'static/icon/datasheet/viewtoolbar/datasheet_icon_viewlist.svg';
// import { Display } from '../../tool_bar/display/display';
// import { DescriptionModal } from '../description_modal';
import { TabAddView } from '../tab_add_view';
import styles from './style.module.less';
import { ViewBar } from './view_bar';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';

export interface ITabStateProps {
  width: number;
}

export type ICustomViewProps = Pick<IViewProperty, 'name' | 'id' | 'type'>;

export const Tab: FC<ITabStateProps> = memo(props => {
  const { datasheetId, viewId: activeView, templateId, shareId } = useSelector(state => {
    const { datasheetId, viewId: activeView, templateId, shareId } = state.pageParams;
    return { datasheetId, viewId: activeView, templateId, shareId };
  }, shallowEqual);
  const datasheet = useSelector((state: IReduxState) => Selectors.getDatasheet(state));
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const datasheetName = treeNodesMap[datasheetId!]?.nodeName || datasheet?.name;
  const datasheetIcon = datasheet?.icon;
  // const { shareInfo } = useContext(ShareContext);
  const role = useSelector((state: IReduxState) => {
    const datasheet = Selectors.getDatasheet(state);
    if (datasheet) {
      return datasheet.role;
    }
    return;
  });
  const nodeFavorite = useSelector((state: IReduxState) => {
    const datasheet = Selectors.getDatasheet(state);
    if (datasheet) {
      return datasheet.nodeFavorite;
    }
    return;
  });
  const { viewCreatable, editable, iconEditable, renamable } = useSelector((state: IReduxState) => {
    const permissions = Selectors.getDatasheet(state)?.permissions;
    if (!permissions) {
      return {};
    }
    return {
      editable: permissions.editable,
      renamable: permissions.renamable,
      viewCreatable: permissions.viewCreatable,
      iconEditable: permissions.iconEditable,
    };
  }, shallowEqual);

  const views = useSelector(state => {
    const snapshot = Selectors.getSnapshot(state);
    if (!snapshot) {
      return;
    }
    return snapshot.meta.views;
  });
  const [editIndex, setEditIndex] = useState<null | number>(null);
  const { sideBarVisible } = useSideBarVisible();
  const { status } = useNetwork(true, datasheetId!, ResourceType.Datasheet);
  // const [iconHighlight, setIconHighlight] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);

  // 更改视图
  const switchView = (e: React.MouseEvent | null, id: string) => {
    if (activeView === id) {
      return;
    }
    // 时光机预览时不能切换视图
    if(datasheet?.id === PREVIEW_DATASHEET_ID) {
      return;
    }
    changeView(id);
  };

  return (
    <div
      className={styles.nav}
    >
      <div className={styles.nodeName} style={{ paddingLeft: !sideBarVisible ? 16 : '' }}>
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
      <ViewBar
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        views={views || []}
        switchView={switchView}
        className={styles.viewBarWrapper}
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
      />
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
          style={{ marginRight: 12, marginBottom: 0 }}
          showIcon
        />
      }
    </div>
  );
});
