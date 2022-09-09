import { Message, useThemeColors } from '@vikadata/components';
import { ConfigConstant, INodeMeta, IPermissions, ISourceDatasheetInfo, Navigation, Selectors, Strings, t } from '@vikadata/core';
import { Tooltip } from 'antd';
import throttle from 'lodash/throttle';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useSideBarVisible } from 'pc/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { gstMirrorIconByViewType } from './mirror_list/utils';
import styles from './style.module.less';

interface IMirrorPath {
  breadInfo: ISourceDatasheetInfo;
  permission: IPermissions;
  nodeInfo: INodeMeta;
}

export const MirrorPath: React.FC<IMirrorPath> = props => {
  const colors = useThemeColors();
  const { breadInfo, permission, nodeInfo } = props;
  const { sideBarVisible } = useSideBarVisible();
  const { shareId, templateId } = useSelector(state => state.pageParams);
  const view = useSelector(state => {
    const snapshot = Selectors.getSnapshot(state, breadInfo.datasheetId)!;
    if (!snapshot) {
      return;
    }
    return Selectors.getViewById(snapshot, breadInfo.viewId);
  });
  const isGhostNode = useSelector(state => {
    return Selectors.getDatasheet(state, breadInfo.datasheetId)?.isGhostNode;
  });
  const isOriginDstReadable = useSelector(state => {
    return Boolean(Selectors.getDatasheet(state, breadInfo.datasheetId)?.permissions.readable);
  });

  const navigationTo = useNavigation();
  // 跳转到源表的入口暂时关闭;
  const jumpHandler = throttle(() => {
    // 原表是幽灵节点，不应该跳转
    if (isGhostNode) {
      return;
    }

    if (!isOriginDstReadable) {
      return Message.warning({
        content: t(Strings.no_access_view),
      });
    }

    navigationTo({ path: Navigation.WORKBENCH, params: { nodeId: breadInfo.datasheetId, viewId: breadInfo.viewId }});
  }, 5000);

  if (!view) {
    return null;
  }

  return (
    <div style={{ height: 48 }}>
      <div className={styles.breadcrumbsBar} style={{ paddingLeft: !sideBarVisible ? 60 : '' }}>
        <div className={styles.container}>
          <div>
            <NodeInfoBar
              data={{
                nodeId: nodeInfo.id!,
                name: nodeInfo.name,
                type: ConfigConstant.NodeType.MIRROR,
                icon: nodeInfo.icon,
                role: nodeInfo.role === ConfigConstant.Role.Foreigner && permission.editable ? ConfigConstant.Role.Editor : nodeInfo.role,
                favoriteEnabled: nodeInfo.nodeFavorite,
                nameEditable: permission.manageable,
                iconEditable: permission.iconEditable,
              }}
              hiddenModule={{ favorite: Boolean(shareId || templateId) }}
              style={{ maxWidth: '256px', width: 'auto' }}
            />
          </div>
          {/* 来源信息 */}
          {!shareId && (
            <div className={styles.sourceInfo}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{t(Strings.mirror_from)}</span>
              <InlineNodeName
                className={styles.datasheetInfo}
                nodeId={breadInfo.datasheetId!}
                nodeName={breadInfo.datasheetName}
                nodeIcon={breadInfo.datasheetIcon}
                withIcon
                iconSize={16}
                iconEditable={false}
              />
              <span style={{ margin: '0 4px' }}>/</span>
              <Tooltip title={isGhostNode ? t(Strings.ghost_node_no_access) : t(Strings.form_to_datasheet_view)}>
                <span className={styles.viewInfo} onClick={jumpHandler}>
                  <span className={styles.viewIcon}>{gstMirrorIconByViewType(view!.type, colors.fourthLevelText)}</span>
                  <span className={styles.viewName}>{view?.name}</span>
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
