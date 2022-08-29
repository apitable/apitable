import * as React from 'react';
import styles from './style.module.less';
import { IMirror, ResourceType } from '@vikadata/core';
import { MirrorPath } from 'pc/components/mirror/mirror_path';
import { useNetwork } from 'pc/hooks/use_network';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { NetworkStatus } from 'pc/components/network_status';
import { SuspensionPanel } from 'pc/components/suspension_panel';
import { useSelector } from 'react-redux';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { MobileToolBar } from 'pc/components/mobile_tool_bar';
import { DataSheetPane } from 'pc/components/datasheet_pane';
import { View } from 'pc/components/view';

export const Mirror: React.FC<{ mirror: IMirror }> = ({ mirror }) => {
  const { status } = useNetwork(true, mirror!.id, ResourceType.Mirror);
  const { shareId, datasheetId } = useSelector(state => state.pageParams);

  return <DataSheetPane
    panelLeft={
      <div
        className={styles.mirrorContainer}
        style={{ width: '100%', height: '100%' }}
      >
        <div className={styles.tab}>
          <SuspensionPanel shareId={shareId} datasheetId={datasheetId} />
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div className={styles.left}>
              <MirrorPath
                nodeInfo={mirror}
                breadInfo={mirror!.sourceInfo}
                permission={mirror!.permissions}
              />
            </div>
            <div className={styles.right}>
              <CollaboratorStatus
                resourceId={mirror!.id} resourceType={ResourceType.Mirror}
              />
              <NetworkStatus currentStatus={status} />
            </div>
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <MobileToolBar hideToolBar />
          </ComponentDisplay>
        </div>
        <View />
      </div>
    }
  />;
};

